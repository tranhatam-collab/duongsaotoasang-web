// FILE: /functions/app/[[path]].js

export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url)
  const path = url.pathname

  // Serve the app shell for all app routes
  // The client-side JavaScript will handle routing
  const appShell = await fetch(new URL('/app/index.html', request.url))
  const appShellHtml = await appShell.text()

  return new Response(appShellHtml, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate'
    }
  })
}
