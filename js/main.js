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

  /* Logo oficial de IMDb (Simple Icons), en blanco */
  imdb: `<svg class="icon-imdb" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.3781 0H1.6218C.7411.0583.0587.7437.0018 1.5953l-.001 20.783c.0585.8761.7125 1.543 1.5559 1.6191A.337.337 0 0 0 1.6016 24h20.7971a.4579.4579 0 0 0 .0437-.002c.8727-.0768 1.5568-.8271 1.5568-1.7085V1.7098c0-.8914-.696-1.6416-1.584-1.7078A.3294.3294 0 0 0 22.3781 0zm0 .496a1.2144 1.2144 0 0 1 1.1252 1.2139v20.5797c0 .6377-.4875 1.1602-1.1045 1.2145H1.6016c-.5967-.0543-1.0645-.5297-1.1053-1.1258V1.6284C.5371 1.0185 1.0184.5364 1.6217.496h20.7564zM4.7954 8.2603v7.3636H2.8899V8.2603h1.9055zm6.5367 0v7.3636H9.6707v-4.9704l-.6711 4.9704H7.813l-.6986-4.8618-.0066 4.8618h-1.668V8.2603h2.468c.0748.4476.1492.9694.2307 1.5734l.2712 1.8713.4407-3.4447h2.4817zm2.9772 1.3289c.0742.0404.122.108.1417.2034.0279.0953.0345.3118.0345.6442v2.8548c0 .4881-.0345.7867-.0955.8954-.0609.1152-.2304.1695-.5018.1695V9.5211c.204 0 .3457.0205.4211.0681zm-.0211 6.0347c.4543 0 .8006-.0265 1.0245-.0742.2304-.0477.4204-.1357.5694-.2648.1556-.1218.2642-.298.3251-.5219.0611-.2238.1021-.6648.1021-1.3224v-2.5832c0-.6986-.0271-1.1668-.0742-1.4039-.041-.237-.1431-.4543-.3126-.6437-.1695-.1973-.4198-.3324-.7456-.421-.3191-.0808-.8542-.1285-1.7694-.1285h-1.4244v7.3636h2.3051zm5.14-1.7827c0 .3523-.0199.5762-.0544.6708-.033.0947-.1894.1424-.3046.1424-.1086 0-.19-.0477-.2238-.1351-.041-.0887-.0609-.2986-.0609-.6238v-1.9469c0-.3324.0199-.5423.0543-.6237.0338-.0808.1086-.122.2171-.122.1153 0 .2709.0412.3114.1425.041.0947.0609.2986.0609.6032v1.8926zm-2.4747-5.5809v7.3636h1.7157l.1152-.4675c.1556.1894.3251.3324.5152.4271.1828.0881.4608.1357.678.1357.3047 0 .5629-.0748.7802-.237.2165-.1562.3589-.3462.4198-.5628.0543-.2173.0887-.543.0887-.9841v-2.0675c0-.4409-.0139-.7324-.0344-.8681-.0199-.1357-.0742-.2781-.1695-.4204-.1021-.1425-.2437-.251-.4272-.3325-.1834-.0742-.3999-.1152-.6576-.1152-.2172 0-.4952.0477-.6846.1285-.1835.0887-.353.2238-.5086.4007V8.2603h-1.8309z"/></svg>`,

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
const A4_SECTIONS = ["audiovisual", "publicaciones"];
const formatClass = (sectionId) => A4_SECTIONS.includes(sectionId) ? " is-a4" : "";

function metaLine(work) {
  if (work.hideArtist) return work.year || "";
  return work.year ? `${SITE.artist}, ${work.year}` : SITE.artist;
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
        <a href="#/${section.id}/${w.slug}" class="work-card">
          <img src="${w.thumb}" alt="${w.title}" loading="lazy">
          <div class="title-overlay"><span>${w.title}</span></div>
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
  const isLabel = (l) => /^[^.:]{2,40}:/.test(l);
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
      </div>

      ${others.length ? `
        <div class="related-works${formatClass(section.id)}">
          ${others.map(w => `
            <a href="#/${section.id}/${w.slug}" class="related-card">
              <div class="related-thumb"><img src="${w.thumb}" alt="${w.title}" loading="lazy"></div>
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

renderMenu();
setupHomeSocial();
window.addEventListener("hashchange", router);
router();
