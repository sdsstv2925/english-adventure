import app from './index.js';

const VERSION_SCRIPT = `<script>(()=>{const run=()=>{document.querySelectorAll('.brand small').forEach(e=>{if(e.textContent.includes('VERSION 47'))e.textContent=e.textContent.replace('VERSION 47','VERSION 48')})};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run()})();</script>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // v47 points Dunno's age phrase at a missing voice-boy-2 file.
    if (url.pathname === '/audio/voice-boy-2/dunno-age.mp3') {
      url.pathname = '/audio/voice-boy/dunno-age.mp3';
      request = new Request(url, request);
    }

    const response = await app.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

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
      .transform(response);
  }
};
