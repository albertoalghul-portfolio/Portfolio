/* Inicio de sesión del gestor de contenidos con GitHub (paso 1).
   Cloudflare Pages ejecuta este archivo en /api/auth.
   Necesita las variables GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET
   configuradas en Cloudflare (Settings → Variables and secrets). */

export async function onRequest({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response("Falta configurar GITHUB_CLIENT_ID en Cloudflare.", { status: 500 });
  }
  const url = new URL(request.url);
  const state = crypto.randomUUID();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    }
  });
}
