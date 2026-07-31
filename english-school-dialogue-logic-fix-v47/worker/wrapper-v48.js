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
            '<link rel="stylesheet" href="/assets/fix-v48.css?v=73">' +
            '<link rel="stylesheet" href="/assets/transparent-dialogs-v48.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene-state-v62.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene2-v63.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene3-v65.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene-fixes-v66.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene7-v67.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene11-v69.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene12-v71.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene13-v72.css?v=73">' +
            '<link rel="stylesheet" href="/assets/scene4-v73.css?v=73">' +
            '<script defer src="/assets/runtime-v48.js?v=73"></script>' +
            '<script defer src="/assets/scene-state-v62.js?v=73"></script>' +
            '<script defer src="/assets/scene2-v63.js?v=73"></script>' +
            '<script defer src="/assets/scene3-v65.js?v=73"></script>' +
            '<script defer src="/assets/scene-fixes-v66.js?v=73"></script>' +
            '<script defer src="/assets/scene9-audio-v68.js?v=73"></script>' +
            '<style>.brand small{font-size:0!important}.brand small:after{content:"LESSON 1-1 · VERSION 73"!important;font-size:12px!important}</style>',
            { html: true }
          );
        }
      })
      .transform(htmlResponse);
  }
};
