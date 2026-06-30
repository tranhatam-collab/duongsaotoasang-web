export async function onRequest(context) {
  const url = new URL(context.request.url)

  if (url.pathname === "/content" && !url.searchParams.get("slug")) {
    const lang = url.searchParams.get("lang") === "en" ? "?lang=en" : ""
    return Response.redirect(`${url.origin}/posts${lang}`, 302)
  }

  const response = await context.next()

  // CSP hardening: remove unsafe-eval (no eval() used in codebase).
  // Keep unsafe-inline for now (122+ inline scripts would break without nonce injection).
  // Future: migrate inline scripts to external .js files, then switch to nonce-based CSP.
  const csp = response.headers.get("Content-Security-Policy")
  if (csp && csp.includes("unsafe-eval")) {
    const hardenedCsp = csp
      .replace(" 'unsafe-eval'", "")
      .replace("'unsafe-eval' ", "")
      .replace("'unsafe-eval'", "")
      .replace(/\s+/g, " ")
      .trim()
    const newHeaders = new Headers(response.headers)
    newHeaders.set("Content-Security-Policy", hardenedCsp)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  }

  return response
}
