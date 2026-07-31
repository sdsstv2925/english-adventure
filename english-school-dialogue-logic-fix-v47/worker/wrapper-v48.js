import app from './index.js';

const VERSION_SCRIPT = `<script>(()=>{const run=()=>{document.querySelectorAll('.brand small').forEach(e=>{if(e.textContent.includes('VERSION 47'))e.textContent=e.textContent.replace('VERSION 47','VERSION 48')})};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run()})();</script>`;

const STATIC_PREFIXES = ['/assets/', '/scenes/', '/audio/', '/characters/', '/_next/'];
const STATIC_FILES = new Set(['/favicon.ico', '/robots.txt', '/manifest.webmanifest']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve CSS, JavaScript, images and audio directly from Cloudflare Assets.
    if (STATIC_PREFIXES.some(prefix => url.pathname.startsWith(prefix)) || STATIC_FILES.has(url.pathname)) {
      if (url.pathname === '/audio/voice-boy-2/dunno-age.mp3') {
        url.pathname = '/audio/voice-boy/dunno-age.mp3';
        request = new Request(url, request);
      }
      return env.ASSETS.fetch(request);
    }

    const response = await app.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const htmlResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append('<link rel="stylesheet" href="/assets/fix-v48.css?v=48">', { html: true });
        }
      })
      .on('body', {
        element(element) {
          element.append(VERSION_SCRIPT, { html: true });
        }
      })
      .transform(htmlResponse);
  }
};
