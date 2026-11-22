/* ==========================================================================
   PUBLICACIÓN DE LA WEB
   Cloudflare ejecuta este script cada vez que hay un cambio en GitHub
   (por ejemplo, al guardar algo en el gestor de contenidos /admin).

   1. Lee el contenido de la carpeta content/ (obras, secciones, ajustes).
   2. Genera js/data.js, que es lo que usa la web.
   3. Copia la web a la carpeta dist/ (lo que se publica) y optimiza las
      imágenes subidas desde el gestor (tamaño web + miniaturas).

   Uso:  node build.mjs            -> genera dist/
         node build.mjs --local    -> además actualiza js/data.js para ver la
                                      web abriendo index.html en el ordenador
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, "dist");
const LOCAL = process.argv.includes("--local");
const MAX = 1800;   // lado mayor de las imágenes de la web
const THUMB = 720;  // lado mayor de las miniaturas

let sharp = null;
try { sharp = (await import("sharp")).default; }
catch { console.warn("Aviso: 'sharp' no está instalado; las imágenes subidas se copian sin optimizar."); }

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const rel = (p) => (p || "").replace(/^\/+/, "");               // "/img/x.jpg" -> "img/x.jpg"
const slugify = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const lines = (t) => (t || "").split("\n").map(l => l.trim()).filter(Boolean);

/* ------------------------------------------------------------------ datos */
const sitio = readJson("content/sitio.json");
const secciones = (readJson("content/secciones.json").secciones || []).filter(s => s.id && s.nombre);
const sectionIds = new Set(secciones.map(s => s.id));

const obrasDir = path.join(ROOT, "content/obras");
const works = [];
const usedSlugs = new Set();
for (const file of fs.readdirSync(obrasDir).filter(f => f.endsWith(".json")).sort()) {
  let o;
  try { o = readJson(`content/obras/${file}`); }
  catch (e) { console.warn(`Aviso: ${file} no se ha podido leer (${e.message}); se omite.`); continue; }
  if (o.publicada === false) continue;
  if (!sectionIds.has(o.seccion)) { console.warn(`Aviso: ${file} tiene una sección que no existe (${o.seccion}); se omite.`); continue; }
  const imagenes = (o.imagenes || []).filter(Boolean);
  if (!imagenes.length) { console.warn(`Aviso: ${file} no tiene imágenes; se omite.`); continue; }

  // La dirección de la obra (#/seccion/slug) sale del nombre del archivo
  let slug = slugify(file.replace(/\.json$/, "").split("--").pop()) || slugify(o.titulo || "obra");
  while (usedSlugs.has(`${o.seccion}/${slug}`)) slug += "-2";
  usedSlugs.add(`${o.seccion}/${slug}`);

  works.push({ file, o, slug, imagenes });
}

/* --------------------------------------------------------------- imágenes */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const item of ["index.html", "css", "js", "img", "admin"]) {
  const src = path.join(ROOT, item);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(DIST, item), { recursive: true });
}

// Las imágenes subidas desde el gestor se reducen a tamaño web en dist/
async function optimize(relPath) {
  if (!sharp || !relPath.startsWith("img/subidas/")) return;
  const out = path.join(DIST, relPath);
  if (!fs.existsSync(out)) return;
  try {
    const buf = await sharp(fs.readFileSync(out)).rotate()
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
    fs.writeFileSync(out, buf);
  } catch (e) { console.warn(`Aviso: no se pudo optimizar ${relPath} (${e.message})`); }
}

// Miniatura para la página de sección
async function thumbnail(w) {
  const { o, slug, imagenes } = w;
  if (!o.portada && o.miniatura) return rel(o.miniatura);
  const source = rel(o.portada || imagenes[0]);
  if (!sharp) return source;
  const outRel = `img/miniaturas/${o.seccion}/${slug}.jpg`;
  try {
    fs.mkdirSync(path.dirname(path.join(DIST, outRel)), { recursive: true });
    await sharp(path.join(ROOT, source)).rotate()
      .resize({ width: THUMB, height: THUMB, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(path.join(DIST, outRel));
    return outRel;
  } catch (e) { console.warn(`Aviso: no se pudo crear la miniatura de ${w.file} (${e.message})`); return source; }
}

const WORKS = [];
const seen = new Set();
for (const w of works) {
  const { o, slug, imagenes } = w;
  for (const img of imagenes.map(rel)) if (!seen.has(img)) { seen.add(img); await optimize(img); }
  WORKS.push({
    section: o.seccion,
    slug,
    order: Number(o.orden) || 0,
    title: o.titulo || "",
    year: String(o.anio || ""),
    hideArtist: o.mostrarNombre === false,
    thumb: await thumbnail(w),
    thumbPos: o.encuadre && o.encuadre !== "50% 50%" ? o.encuadre : "",
    media: imagenes.map(rel),
    text: o.texto || "",
    blocks: (o.bloques || []).map(b => ({ title: b.titulo || "", lines: lines(b.lineas) }))
                             .filter(b => b.title || b.lines.length),
    video: (o.videos || []).filter(v => v && v.url).map(v => [v.texto || "Ver vídeo", v.url]),
    imdb: o.imdb || "",
    links: (o.enlaces || []).filter(l => l && l.url).map(l => [l.texto || l.url, l.url])
  });
}
WORKS.sort((a, b) =>
  secciones.findIndex(s => s.id === a.section) - secciones.findIndex(s => s.id === b.section) ||
  a.order - b.order);

/* ---------------------------------------------------------------- data.js */
const SITE = {
  artist: sitio.artista || "",
  contact: {
    email: sitio.contacto?.email || "",
    instagram: sitio.contacto?.instagram || "",
    youtube: sitio.contacto?.youtube || "",
    imdb: sitio.contacto?.imdb || "",
    cvPdf: /^https?:/.test(sitio.cv || "") ? sitio.cv : rel(sitio.cv)
  }
};
const SECTIONS = [...secciones.map(s => ({ id: s.id, name: s.nombre })), { id: "sobre-mi", name: "Sobre mí" }];
const BACKGROUNDS = { home: rel(sitio.fondoInicio), "sobre-mi": rel(sitio.fondoSobreMi) };
for (const s of secciones) BACKGROUNDS[s.id] = rel(s.fondo);
const A4_SECTIONS = secciones.filter(s => s.formatoA4).map(s => s.id);
const BIO = (sitio.bio || []).filter(Boolean);

const js = `/* ARCHIVO GENERADO AUTOMÁTICAMENTE por build.mjs a partir de la carpeta content/.
   No lo edites a mano: los cambios se hacen desde el gestor de contenidos (/admin). */

const SITE = ${JSON.stringify(SITE, null, 2)};

const SECTIONS = ${JSON.stringify(SECTIONS, null, 2)};

const BACKGROUNDS = ${JSON.stringify(BACKGROUNDS, null, 2)};

const A4_SECTIONS = ${JSON.stringify(A4_SECTIONS)};

const BIO = ${JSON.stringify(BIO, null, 2)};

const WORKS = [
${WORKS.map(w => "  " + JSON.stringify(w)).join(",\n")}
];
`;
fs.writeFileSync(path.join(DIST, "js/data.js"), js);
if (LOCAL) fs.writeFileSync(path.join(ROOT, "js/data.js"), js);

console.log(`Web generada: ${WORKS.length} obras en ${secciones.length} secciones.`);
