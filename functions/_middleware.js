export async function onRequest(context) {
  const url = new URL(context.request.url)

  if (url.pathname === "/content" && !url.searchParams.get("slug")) {
    const lang = url.searchParams.get("lang") === "en" ? "?lang=en" : ""
    return Response.redirect(`${url.origin}/posts${lang}`, 302)
  }

  return context.next()
}
