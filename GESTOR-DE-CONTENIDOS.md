# Gestor de contenidos de la web

La web se edita desde **`https://TU-WEB.pages.dev/admin`**: obras, imágenes, textos, orden,
secciones del menú, biografía, currículum, redes y fondos. No hace falta tocar GitHub.

Cada vez que guardas algo en el gestor, se guarda en GitHub y Cloudflare vuelve a publicar
la web sola. Tarda **uno o dos minutos** en verse el cambio.

---

## Configuración (solo una vez)

### 1. Publicar la web en Cloudflare Pages

En Cloudflare: **Workers y Pages → Crear → Pages → Importar un repositorio de Git** y elige
`albertoalghul-portfolio/Portfolio`.

| Ajuste | Valor |
|---|---|
| Rama de producción | `web-nueva` |
| Framework preset | None |
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |

Al terminar tendrás tu dirección, por ejemplo `https://alberto-alber.pages.dev`.

### 2. Crear la «llave» de GitHub para el gestor

En GitHub: tu foto (arriba a la derecha) → **Settings → Developer settings → OAuth Apps →
New OAuth App**.

| Campo | Valor |
|---|---|
| Application name | Gestor web Alberto Alber |
| Homepage URL | `https://alberto-alber.pages.dev` (tu dirección) |
| Authorization callback URL | `https://alberto-alber.pages.dev/api/callback` |

Pulsa **Register application**. Copia el **Client ID**, pulsa **Generate a new client secret**
y copia también el **Client secret**. Este último solo se ve una vez y no debe compartirse.

### 3. Darle la llave a Cloudflare

En Cloudflare, en tu proyecto: **Settings → Variables and secrets → Add**.

| Nombre | Valor | Tipo |
|---|---|---|
| `GITHUB_CLIENT_ID` | el Client ID | Text |
| `GITHUB_CLIENT_SECRET` | el Client secret | **Secret** |

Después ve a **Deployments** y pulsa **Retry deployment** en el último para que las use.

### 4. Entrar

Abre `https://alberto-alber.pages.dev/admin`, pulsa **Iniciar sesión con GitHub** y acepta.

> Si más adelante pones un dominio propio (por ejemplo `albertoalber.com`), cambia las dos
> direcciones del paso 2 por la del dominio nuevo.

---

## Cómo se usa

- **Obras** → lista de todas las obras. «Agrupar por → Sección» para verlas por secciones.
  - **Nueva obra:** botón **+ Obra**. Elige la sección, escribe título, año, descripción
    y sube las imágenes.
  - **Orden en la sección:** campo «Orden» (de menor a mayor: 10, 20, 30...).
  - **Orden de las imágenes:** arrástralas.
  - **Portada de la página de sección:** campo «Portada»; «Encuadre» la desplaza si se recorta.
  - **Ficha, créditos, premios:** «Bloques de información», uno por bloque, con título opcional.
  - **Ocultar sin borrar:** desactiva «Publicada».
  - **Borrar:** dentro de la obra, botón «Eliminar entrada».
- **Ajustes de la web**
  - **Sobre mí, contacto y fondos:** biografía, currículum (PDF), email, redes y fondos.
  - **Secciones del menú:** orden del menú, nombres, fondos y formato A4. Aquí también
    se crean secciones nuevas.

Las imágenes que subas se reducen solas a tamaño web al publicar (no hace falta prepararlas).
