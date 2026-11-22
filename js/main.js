/* ==========================================================================
   FUNCIONAMIENTO DE LA WEB
   Menú, fondos, cuadrícula de obras, visor de imágenes y "Sobre mí".
   Normalmente no hace falta tocar este archivo para cambiar contenido:
   eso se hace en js/data.js y js/config.js
   ========================================================================== */

const mainApp = document.getElementById("main-content");
const navMenu = document.getElementById("nav-menu");
const navMenuUl = navMenu.querySelector("ul");
const burgerToggle = document.getElementById("burger-toggle");
const bgLayers = [document.getElementById("bg-layer-1"), document.getElementById("bg-layer-2")];

/* --------------------------------------------------------------------------
   ICONOS DE REDES
   -------------------------------------------------------------------------- */
const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,

  /* Logo de IMDb (img/iconos/imdb.png) */
  imdb: `<img class="icon-imdb" src="img/iconos/imdb.png" alt="">`,

  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

function socialLinksHtml() {
  const c = SITE.contact;
  return [
    ["Instagram", c.instagram, ICONS.instagram],
    ["IMDb", c.imdb, ICONS.imdb],
    ["YouTube", c.youtube, ICONS.youtube]
  ].map(([label, href, icon]) =>
    `<a class="social-icon-btn" href="${href}" target="_blank" rel="noopener" aria-label="${label}">${icon}</a>`
  ).join("");
}

function setupHomeSocial() {
  const email = document.querySelector("[data-email]");
  email.href = `mailto:${SITE.contact.email}`;
  email.textContent = SITE.contact.email;
  document.querySelector("[data-social]").innerHTML = socialLinksHtml();
}

/* --------------------------------------------------------------------------
   FONDOS (fijos, con fundido entre secciones)
   -------------------------------------------------------------------------- */
let currentBgIndex = 0;
let currentBgUrl = null;

function setBackground(url) {
  if (!url || url === currentBgUrl) return;
  currentBgUrl = url;
  const next = 1 - currentBgIndex;
  bgLayers[next].style.backgroundImage = `url("${url}")`;
  bgLayers[next].classList.add("active");
  bgLayers[currentBgIndex].classList.remove("active");
  currentBgIndex = next;
}

/* --------------------------------------------------------------------------
   MENÚ
   -------------------------------------------------------------------------- */
function renderMenu() {
  navMenuUl.innerHTML = SECTIONS.map(sec =>
    `<li><a href="#/${sec.id}" class="nav-link" data-id="${sec.id}">${sec.name}</a></li>`
  ).join("");
}

function setActiveNavLink(id) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.id === id);
  });
}

burgerToggle.addEventListener("click", () => navMenu.classList.toggle("open"));

/* --------------------------------------------------------------------------
   VISTAS
   -------------------------------------------------------------------------- */
const worksOf = (sectionId) => WORKS.filter(w => w.section === sectionId);

/* Secciones cuyas previsualizaciones tienen formato A4 vertical (carteles, cubiertas) */
const A4_SECTIONS = ["audiovisual", "publicaciones", "exposiciones"];
const formatClass = (sectionId) => A4_SECTIONS.includes(sectionId) ? " is-a4" : "";

function metaLine(work) {
  if (work.hideArtist) return work.year || "";
  return work.year ? `${SITE.artist}, ${work.year}` : SITE.artist;
}

/* Botones "Ver vídeo" y "Ver en IMDb".
   En data.js: video = [["Ver vídeo", "https://..."]] (puede haber varios) e imdb = "https://..." */
function workActionsHtml(work) {
  const buttons = [];
  (work.video || []).forEach(([label, url]) =>
    buttons.push(`<a class="work-btn" href="${url}" target="_blank" rel="noopener">▶ ${label}</a>`)
  );
  if (work.imdb) buttons.push(`<a class="work-btn" href="${work.imdb}" target="_blank" rel="noopener">Ver en IMDb</a>`);
  return buttons.length ? `<div class="work-actions">${buttons.join("")}</div>` : "";
}

function renderHome() {
  document.body.className = "is-home";
  document.title = `${SITE.artist} | Inicio`;
  setBackground(BACKGROUNDS.home);
  setActiveNavLink("");
  mainApp.innerHTML = "";
}

function renderAbout(section) {
  document.title = `${section.name} | ${SITE.artist}`;
  setBackground(BACKGROUNDS[section.id]);

  mainApp.innerHTML = `
    <div class="bio-container">
      <h1 class="page-title">${SITE.artist}</h1>
      ${BIO.map(p => `<p>${p}</p>`).join("")}
      <a href="${SITE.contact.cvPdf}" target="_blank" rel="noopener" class="cv-btn">Descargar CV (PDF)</a>
      <div class="bio-contact">
        <p><strong>Contacto:</strong> <a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></p>
        <div class="social-links-list">${socialLinksHtml()}</div>
      </div>
    </div>`;
}

function renderGrid(section) {
  document.title = `${section.name} | ${SITE.artist}`;
  setBackground(BACKGROUNDS[section.id]);

  const works = worksOf(section.id);
  if (!works.length) {
    mainApp.innerHTML = `<p class="empty-msg">Próximamente obras en ${section.name}.</p>`;
    return;
  }

  mainApp.innerHTML = `
    <div class="works-grid${formatClass(section.id)}">
      ${works.map(w => `
        <a href="#/${section.id}/${w.slug}" class="work-item">
          <div class="work-card">
            <img src="${w.thumb}" alt="${w.title}" loading="lazy"${w.thumbPos ? ` style="object-position: ${w.thumbPos}"` : ""}>
            <div class="title-overlay"><span>${w.title}</span></div>
          </div>
          <span class="work-year">${w.year || ""}</span>
        </a>`).join("")}
    </div>`;
}

/* Visor de una obra: muestra una imagen cada vez con Anterior / Siguiente.
   Solo se descargan la imagen visible y sus vecinas, para que cargue rápido. */
let mediaKeyHandler = null;
document.addEventListener("keydown", (e) => { if (mediaKeyHandler) mediaKeyHandler(e); });

function renderWork(section, work) {
  document.title = `${work.title} | ${SITE.artist}`;
  setBackground(BACKGROUNDS[section.id]);

  const total = work.media.length;
  const multi = total > 1;
  const others = worksOf(section.id).filter(w => w.slug !== work.slug);
  /* La descripción es la primera línea que no es una ficha tipo "Edición: ..." o
     "Reparto: ...". El resto (ficha técnica, créditos, premios) va debajo en pequeño. */
  const lines = work.text || [];
  const isLabel = (l) => /^[^.:]{2,60}:/.test(l);
  const mainIdx = lines.findIndex(l => !isLabel(l));
  const mainText = mainIdx >= 0 ? lines[mainIdx] : "";
  const details = lines.filter((_, i) => i !== mainIdx);

  mainApp.innerHTML = `
    <div class="work-detail">
      <div class="work-detail-nav">
        <a href="#/${section.id}">← Volver a ${section.name}</a>
        ${multi ? `
          <div class="media-nav">
            <button type="button" class="media-nav-btn" data-dir="-1">Anterior</button>
            <span class="media-counter">1 / ${total}</span>
            <button type="button" class="media-nav-btn" data-dir="1">Siguiente</button>
          </div>` : ""}
      </div>

      <div class="work-media-list">
        ${work.media.map((src, i) =>
          `<img class="media-slide" data-src="${src}" alt="${work.title} (${i + 1}/${total})" ${i ? "hidden" : ""}>`
        ).join("")}
      </div>

      <div class="work-caption">
        <h2>${work.title}</h2>
        <p class="work-meta">${metaLine(work)}</p>
        ${mainText ? `<p class="work-text">${mainText}</p>` : ""}
        ${details.length ? `<div class="work-details">${details.map(l =>
          l.trim().endsWith(":") ? `<h3 class="details-heading">${l.replace(/:\s*$/, "")}</h3>` : `<p>${l}</p>`
        ).join("")}</div>` : ""}
        ${workActionsHtml(work)}
        ${work.links && work.links.length ? `
          <div class="work-links">
            <h3 class="details-heading">Enlaces de interés</h3>
            ${work.links.map(([label, url]) => `<p><a href="${url}" target="_blank" rel="noopener">${label}</a></p>`).join("")}
          </div>` : ""}
      </div>

      ${others.length ? `
        <div class="related-works${formatClass(section.id)}">
          ${others.map(w => `
            <a href="#/${section.id}/${w.slug}" class="related-card">
              <div class="related-thumb"><img src="${w.thumb}" alt="${w.title}" loading="lazy"${w.thumbPos ? ` style="object-position: ${w.thumbPos}"` : ""}></div>
              <span class="related-title">${w.title}</span>
            </a>`).join("")}
        </div>` : ""}
    </div>`;

  const slides = mainApp.querySelectorAll(".media-slide");
  const counter = mainApp.querySelector(".media-counter");
  const load = (i) => {
    const el = slides[(i + total) % total];
    if (!el.src) el.src = el.dataset.src;
  };
  let idx = 0;
  const show = (n) => {
    idx = (n + total) % total;
    slides.forEach((el, i) => { el.hidden = i !== idx; });
    load(idx); load(idx + 1); load(idx - 1);
    if (counter) counter.textContent = `${idx + 1} / ${total}`;
  };
  show(0);

  if (multi) {
    mainApp.querySelectorAll(".media-nav-btn").forEach(btn =>
      btn.addEventListener("click", () => show(idx + Number(btn.dataset.dir)))
    );
    mediaKeyHandler = (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    };
  }
}

/* --------------------------------------------------------------------------
   NAVEGACIÓN (#/seccion/obra)
   -------------------------------------------------------------------------- */
function router() {
  const [sectionId, workSlug] = window.location.hash.replace(/^#\//, "").split("/");
  const section = SECTIONS.find(s => s.id === sectionId);

  navMenu.classList.remove("open");
  mediaKeyHandler = null;
  mainApp.scrollTop = 0;

  if (!section) return renderHome();

  document.body.className = "is-page";
  setActiveNavLink(section.id);

  if (section.id === "sobre-mi") return renderAbout(section);

  const work = workSlug && worksOf(section.id).find(w => w.slug === workSlug);
  if (work) return renderWork(section, work);

  renderGrid(section);
}

/* --------------------------------------------------------------------------
   PROTECCIÓN DE IMÁGENES
   Desactiva el clic derecho ("Guardar imagen como...") y arrastrar las fotos.
   -------------------------------------------------------------------------- */
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest("img, .bg-layer")) e.preventDefault();
});
document.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

renderMenu();
setupHomeSocial();
window.addEventListener("hashchange", router);
router();
