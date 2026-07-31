import app from './index.js';

const VERSION_SCRIPT = `<script>(()=>{
  const run=()=>{
    document.querySelectorAll('.brand small').forEach(e=>{
      if(e.textContent.includes('VERSION 47')) e.textContent=e.textContent.replace('VERSION 47','VERSION 48');
    });
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run();
})();</script>`;

const SCENE_11_SCRIPT = `<script>(()=>{
  if(window.__eaScene11FixInstalled) return;
  window.__eaScene11FixInstalled=true;
  window.__eaFourToysUnlocked=false;

  const installStyles=()=>{
    if(document.getElementById('ea-scene11-count-style')) return;
    const style=document.createElement('style');
    style.id='ea-scene11-count-style';
    style.textContent='.scene-four-toys .count-first-card{background:rgba(255,255,255,.96);border-radius:22px;padding:16px 22px;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:720px;margin:0 auto;box-shadow:0 8px 24px rgba(23,58,87,.14)}.scene-four-toys .count-first-card b{font-size:20px;color:#173a57}.scene-four-toys .count-first-options{display:flex;gap:12px;justify-content:center}.scene-four-toys .count-first-options button{min-width:110px;padding:12px 22px;border:3px solid #d7e2e5;border-radius:16px;background:#fff;color:#173a57;font-weight:900;cursor:pointer;box-shadow:0 4px #dbe3e4}.scene-four-toys .count-first-options button.correct{background:#e3f9ea;border-color:#3eb270}.scene-four-toys .count-first-message{min-height:22px;font-weight:900;color:#26784b}.scene-four-toys .word-card[data-count-locked="true"]{display:none!important}@media(max-width:560px){.scene-four-toys .count-first-options button{min-width:82px;padding:11px 15px}}';
    document.head.appendChild(style);
  };

  const enhance=()=>{
    installStyles();
    const stage=document.querySelector('.scene-four-toys');
    if(!stage) return;
    const wordCard=stage.querySelector('.word-card');
    if(!wordCard) return;

    if(window.__eaFourToysUnlocked){
      wordCard.removeAttribute('data-count-locked');
      stage.querySelector('.count-first-card')?.remove();
      return;
    }

    wordCard.setAttribute('data-count-locked','true');
    if(stage.querySelector('.count-first-card')) return;

    const card=document.createElement('div');
    card.className='count-first-card';
    card.innerHTML='<b>Сколько игрушек на столе?</b><div class="count-first-options"><button type="button">3</button><button type="button">4</button><button type="button">5</button></div><div class="count-first-message"></div>';
    wordCard.before(card);

    const message=card.querySelector('.count-first-message');
    card.querySelectorAll('button').forEach(button=>{
      button.addEventListener('click',()=>{
        if(button.textContent.trim()==='4'){
          window.__eaFourToysUnlocked=true;
          button.classList.add('correct');
          message.textContent='Правильно! На столе 4 игрушки. Теперь назовём их по-английски.';
          setTimeout(()=>{
            card.remove();
            wordCard.removeAttribute('data-count-locked');
          },450);
        }else{
          message.textContent='Посчитай ещё раз: медведь, заяц, собака и лягушка.';
          message.style.color='#b45b3c';
        }
      });
    });
  };

  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',enhance,{once:true}):enhance();
})();</script>`;

const SCENE_18_SCRIPT = `<script>(()=>{
  if(window.__eaRoySongFixInstalled) return;
  window.__eaRoySongFixInstalled=true;

  const installStyles=()=>{
    if(document.getElementById('ea-roy-song-style')) return;
    const style=document.createElement('style');
    style.id='ea-roy-song-style';
    style.textContent='@media(min-width:881px){.scene-roy .song-card{left:50%!important;right:auto!important;bottom:116px!important;top:auto!important;width:56%!important;max-width:56%!important;height:auto!important;max-height:none!important;min-height:138px!important;padding:18px 24px!important;transform:translateX(-50%)!important;overflow:hidden!important;border-radius:24px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important}.scene-roy .song-card.ea-roy-ready>:not(button):not(.primary-action):not(.ea-roy-helper){display:none!important}.scene-roy .song-card.ea-roy-playing{min-height:230px!important}.scene-roy .song-card.ea-roy-playing>:not(.ea-roy-helper){display:revert}.scene-roy .song-card .ea-roy-helper{font-size:18px;font-weight:800;color:#31546b;text-align:center}.scene-roy .song-card.ea-roy-playing .ea-roy-helper{display:none}.scene-roy .choice-row{left:50%!important;right:auto!important;bottom:18px!important;top:auto!important;width:56%!important;max-width:56%!important;min-height:82px!important;padding:14px 20px!important;transform:translateX(-50%)!important;border-radius:22px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:18px!important;z-index:450!important}.scene-roy .choice-row[data-roy-locked="true"]{visibility:hidden!important;pointer-events:none!important}.scene-roy .choice-row.ea-roy-unlocked{visibility:visible!important;pointer-events:auto!important}.scene-roy .choice-row .ea-roy-question{font-size:20px;font-weight:900;color:#173a57;margin-right:18px;white-space:nowrap}.scene-roy .choice-row button{min-width:105px!important;min-height:54px!important}.scene-roy .song-card:before,.scene-roy .song-card:after,.scene-roy .choice-row:before,.scene-roy .choice-row:after{display:none!important}}@media(max-width:880px){.scene-roy .choice-row[data-roy-locked="true"]{display:none!important}.scene-roy .choice-row.ea-roy-unlocked{display:flex!important}.scene-roy .choice-row .ea-roy-question{width:100%;text-align:center;font-weight:900;color:#173a57}.scene-roy .choice-row{flex-wrap:wrap!important}.scene-roy .song-card .ea-roy-helper{text-align:center;font-weight:800;color:#31546b}}';
    document.head.appendChild(style);
  };

  const unlock=(stage)=>{
    const choices=stage.querySelector('.choice-row');
    if(!choices) return;
    choices.removeAttribute('data-roy-locked');
    choices.classList.add('ea-roy-unlocked');
    if(!choices.querySelector('.ea-roy-question')){
      const question=document.createElement('div');
      question.className='ea-roy-question';
      question.textContent='How old is Roy?';
      choices.prepend(question);
    }
  };

  const enhance=()=>{
    installStyles();
    const stage=document.querySelector('.scene-roy');
    if(!stage) return;
    const card=stage.querySelector('.song-card');
    const choices=stage.querySelector('.choice-row');
    if(!card||!choices) return;

    if(!stage.dataset.roySongStarted){
      choices.setAttribute('data-roy-locked','true');
      card.classList.add('ea-roy-ready');
      if(!card.querySelector('.ea-roy-helper')){
        const helper=document.createElement('div');
        helper.className='ea-roy-helper';
        helper.textContent='Послушай песню и узнай, сколько лет Рою';
        const playButton=card.querySelector('button,.primary-action');
        playButton?.after(helper);
      }
    }

    const playButton=card.querySelector('button,.primary-action');
    if(playButton&&!playButton.dataset.roySongBound){
      playButton.dataset.roySongBound='true';
      playButton.addEventListener('click',()=>{
        stage.dataset.roySongStarted='true';
        card.classList.remove('ea-roy-ready');
        card.classList.add('ea-roy-playing');
        let unlocked=false;
        const finish=()=>{
          if(unlocked) return;
          unlocked=true;
          card.classList.remove('ea-roy-playing');
          card.classList.add('ea-roy-finished');
          unlock(stage);
        };
        setTimeout(()=>{
          const audio=[...document.querySelectorAll('audio')].find(a=>!a.paused);
          if(audio){
            audio.addEventListener('ended',finish,{once:true});
            audio.addEventListener('error',finish,{once:true});
          }
        },250);
        setTimeout(finish,22000);
      });
    }
  };

  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',enhance,{once:true}):enhance();
})();</script>`;

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
          element.append('<link rel="stylesheet" href="/assets/fix-v48.css?v=48">', { html: true });
        }
      })
      .on('body', {
        element(element) {
          element.append(VERSION_SCRIPT + SCENE_11_SCRIPT + SCENE_18_SCRIPT, { html: true });
        }
      })
      .transform(htmlResponse);
  }
};
