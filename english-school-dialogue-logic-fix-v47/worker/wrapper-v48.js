import app from './index.js';

const STATIC_PREFIXES = ['/assets/', '/scenes/', '/audio/', '/characters/', '/_next/'];
const STATIC_FILES = new Set(['/favicon.ico', '/robots.txt', '/manifest.webmanifest']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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
          element.append(
            '<link rel="stylesheet" href="/assets/fix-v48.css?v=59">' +
            '<link rel="stylesheet" href="/assets/transparent-dialogs-v48.css?v=59">' +
            '<script defer src="/assets/runtime-v48.js?v=59"></script>' +
            '<script defer src="/assets/scene3-v58.js?v=59"></script>' +
            '<script defer src="/assets/dialogue-cleanup-v59.js?v=59"></script>' +
            '<style>.brand small{font-size:0!important}.brand small:after{content:"LESSON 1-1 · VERSION 59"!important;font-size:12px!important}</style>',
            { html: true }
          );
        }
      })
      .transform(htmlResponse);
  }
};
