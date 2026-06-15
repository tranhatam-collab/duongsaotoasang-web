// DSTS Legacy Media API
// POST /api/legacy/upload — Upload media to R2 (authenticated users only)
// GET /api/legacy/{id} — Download media from R2

import { requireAccessJWT } from '../../_lib/auth.js';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'audio/webm'
];

export async function onRequestPost(context) {
  const r2 = context.env.DSTS_LEGACY_MEDIA;
  if (!r2) return new Response('R2 not bound', { status: 500 });
  
  // Require authenticated session (using Access JWT for now)
  try {
    await requireAccessJWT(context.request, context.env);
  } catch (authError) {
    return authError;
  }
  
  try {
    const formData = await context.request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large (max 50MB)' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check MIME type
    const mimeType = file.type || '';
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), { 
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
