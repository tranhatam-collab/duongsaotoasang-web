// DSTS Legacy Media API
// POST /api/legacy/upload — Upload media to R2
// GET /api/legacy/{id} — Download media from R2

export async function onRequestPost(context) {
  const r2 = context.env.DSTS_LEGACY_MEDIA;
  if (!r2) return new Response('R2 not bound', { status: 500 });
  
  try {
    const formData = await context.request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const fileName = file.name || 'upload';
    const key = `legacy/${crypto.randomUUID()}-${fileName}`;
    
    await r2.put(key, file);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      key: key,
      url: `https://duongsaotoasang.com/api/legacy/${key}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestGet(context) {
  const r2 = context.env.DSTS_LEGACY_MEDIA;
  if (!r2) return new Response('R2 not bound', { status: 500 });
  
  try {
    const url = new URL(context.request.url);
    const key = url.pathname.replace('/api/legacy/', '');
    
    const object = await r2.get(key);
    
    if (!object) {
      return new Response('Not found', { status: 404 });
    }
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    
    return new Response(object.body, { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
