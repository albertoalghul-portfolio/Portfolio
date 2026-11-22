/* Inicio de sesión del gestor de contenidos con GitHub (paso 2).
   GitHub vuelve aquí (/api/callback) con un código; lo cambiamos por un token
   y se lo pasamos a la ventana del gestor. */

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = (request.headers.get("Cookie") || "").match(/cms_oauth_state=([^;]+)/)?.[1];

  let message, status;
  if (!code || !state || state !== cookieState) {
    status = "error";
    message = { error: "La sesión ha caducado o no es válida. Vuelve a intentarlo." };
  } else {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "portfolio-cms" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`
      })
    });
    const data = await res.json().catch(() => ({}));
    if (data.access_token) {
      status = "success";
      message = { token: data.access_token, provider: "github" };
    } else {
      status = "error";
      message = { error: data.error_description || "GitHub no ha devuelto el permiso." };
    }
  }

  // Protocolo de Decap CMS: avisar a la ventana del gestor (solo a nuestro propio dominio)
  const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(message)}`);
  const origin = JSON.stringify(url.origin);
  const html = `<!doctype html><html><body><p>Conectando con el gestor…</p><script>
    (function () {
      function receive(e) {
        if (e.origin !== ${origin}) return;
        window.opener.postMessage(${payload}, e.origin);
        window.removeEventListener("message", receive);
        setTimeout(function () { window.close(); }, 300);
      }
      window.addEventListener("message", receive, false);
      window.opener.postMessage("authorizing:github", ${origin});
    })();
  </script></body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    }
  });
}
