/* ==========================================================================
   AJUSTES GENERALES DE LA WEB
   Datos de contacto, secciones del menú y fondos.
   Los textos y las obras están en js/data.js
   ========================================================================== */

const SITE = {
  artist: "Alberto Alber",
  contact: {
    email: "albertoalghul@gmail.com",
    instagram: "https://www.instagram.com/alberto__alber",
    youtube: "https://www.youtube.com/@mondoklein6756",
    imdb: "https://www.imdb.com/name/nm14228898/",
    cvPdf: "https://45d492eb-1618-41dc-9724-5ff73eefb5b7.filesusr.com/ugd/bda149_2345ec5095fb4be6941ffb4974506dd9.pdf"
  }
};

/* Secciones del menú, en el orden en que aparecen.
   "id" es lo que sale en la dirección (#/fotografia) y enlaza con las obras de data.js */
const SECTIONS = [
  { id: "audiovisual",             name: "Audiovisual" },
  { id: "escultura-e-instalacion", name: "Escultura e Instalación" },
  { id: "fotografia",              name: "Fotografía" },
  { id: "dibujo-y-pintura",        name: "Dibujo y pintura" },
  { id: "publicaciones",           name: "Publicaciones" },
  { id: "exposiciones",            name: "Exposiciones" },
  { id: "sobre-mi",                name: "Sobre mí" }
];

/* Fondo de cada página (carpeta img/fondos) */
const BACKGROUNDS = {
  "home":                    "img/fondos/home.jpg",
  "sobre-mi":                "img/fondos/sobre-mi.jpg",
  "dibujo-y-pintura":        "img/fondos/dibujo-y-pintura.jpg",
  "audiovisual":             "img/fondos/audiovisual.jpg",
  "escultura-e-instalacion": "img/fondos/escultura-e-instalacion.jpg",
  "fotografia":              "img/fondos/fotografia.jpg",
  "publicaciones":           "img/fondos/publicaciones.jpg",
  "exposiciones":            "img/fondos/exposiciones.jpg"
};
