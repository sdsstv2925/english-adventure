import fs from "node:fs";

const file = new URL("./client/assets/page-v31-clean.js", import.meta.url);
let source = fs.readFileSync(file, "utf8");

function replaceOnce(search, replacement, label) {
  const matches = typeof search === "string"
    ? source.split(search).length - 1
    : [...source.matchAll(new RegExp(search.source, search.flags.includes("g") ? search.flags : `${search.flags}g`))].length;
  if (matches !== 1) {
    throw new Error(`${label}: expected exactly one match, found ${matches}`);
  }
  source = source.replace(search, replacement);
}

source = source
  .replaceAll("VERSION 35", "VERSION 36")
  .replaceAll("?v=35", "?v=36")
  .replaceAll("?v=34", "?v=36");

replaceOnce(
  "I.id===`actions`?`/scenes/approved-10.webp?v=36`",
  "I.id===`actions`?E===2?`/scenes/actions-floor.png?v=36`:[0,3].includes(E)?`/scenes/actions-standing.png?v=36`:`/scenes/actions-chairs.png?v=36`",
  "action scene state image",
);

replaceOnce(
  "function g({sceneId:e,speaking:t,sceneDone:n,substep:r,actionIndex:a})",
  `function detectChildGender(e){let t=e.trim().toLocaleLowerCase().replaceAll(\`ё\`,\`е\`),n=new Set([\`dima\`,\`дима\`,\`nikita\`,\`никита\`,\`ilya\`,\`илья\`,\`sasha\`,\`саша\`,\`misha\`,\`миша\`,\`kolya\`,\`коля\`,\`vanya\`,\`ваня\`,\`zhenya\`,\`женя\`,\`slava\`,\`слава\`,\`kuzma\`,\`кузьма\`,\`foma\`,\`фома\`]),r=new Set([\`anna\`,\`анна\`,\`maria\`,\`мария\`,\`sofia\`,\`софия\`,\`alina\`,\`алина\`,\`diana\`,\`диана\`,\`emma\`,\`эмма\`,\`eva\`,\`ева\`]);return n.has(t)?\`boy\`:r.has(t)?\`girl\`:/[aая]$/i.test(t)?\`girl\`:\`boy\`}function speakEnteredName(e,t){if(typeof window===\`undefined\`)return;activeAudio?.pause(),window.speechSynthesis?.cancel(),emitSpeak(t,\`My name is \${e}. Nice to meet you!\`);let n=t===\`girl\`?\`voice-girl\`:\`voice-boy\`,r=new Audio(\`/audio/\${n}/my-name-is.mp3?v=36\`),i=()=>{if(!(\`speechSynthesis\`in window)){emitSpeak(null);return}let n=new SpeechSynthesisUtterance(\`\${e}. Nice to meet you!\`);n.lang=\`en-US\`,n.rate=.72,n.pitch=t===\`girl\`?1.16:.94;let r=window.speechSynthesis.getVoices(),i=t===\`girl\`?r.find(e=>/Flo|Kathy|Princess|Samantha/i.test(e.name)):r.find(e=>/Eddy|Junior|Daniel|Alex/i.test(e.name));i&&(n.voice=i),n.onend=()=>emitSpeak(null),window.speechSynthesis.speak(n)};activeAudio=r,r.volume=.96,r.onended=i,r.onerror=i,r.play().catch(i)}function g({sceneId:e,speaking:t,sceneDone:n,substep:r,actionIndex:a})`,
  "dynamic name voice helpers",
);

replaceOnce(
  "h(`My name is ${S}. Nice to meet you!`,/[aаáàя]$/i.test(S.trim())?`girl`:`boy`),H(2,`Nice to meet you, ${S}! Let’s be friends! 🤝`)",
  "let e=S.trim(),t=detectChildGender(e);speakEnteredName(e,t),H(2,`Nice to meet you, ${e}! Let’s be friends! 🤝`)",
  "name pronunciation and gender",
);

replaceOnce(
  "function J(e){let t=s[w];if(x(e),e!==t.answer){y(`Попробуй другой ответ.`),h(`Try again!`);return}h(`Yes! Excellent!`),w===s.length-1?H(2,`Отлично! В мире очень много языков.`):(T(e=>e+1),x(``),y(`Yes! Следующая страна.`))}",
  "function J(e){let t=s[w];if(x(e),e!==t.answer){y(`Try again! Попробуй другой ответ.`),h(`Try again!`);return}h(`Yes! Excellent!`),w===s.length-1?H(2,`Yes! Excellent! В мире очень много языков.`):(T(e=>e+1),x(``),y(`Yes! Excellent! Следующая страна.`))}",
  "language feedback",
);

replaceOnce(
  /case`age`:return.*?case`actions`:/s,
  `case\`age\`:return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(_,{who:\`teacher\`,english:\`What's your name and how old are you?\`,translation:\`Как тебя зовут и сколько тебе лет?\`,children:(0,i.jsx)(\`b\`,{children:\`What’s your name and how old are you?\`})}),(0,i.jsxs)(_,{who:\`dunno\`,english:\`My name is Dunno! I am six!\`,translation:\`Меня зовут Незнайка! Мне шесть лет!\`,children:[\`My name is Dunno!\`,(0,i.jsx)(\`br\`,{}),(0,i.jsx)(\`b\`,{children:\`I am six!\`})]}),(0,i.jsxs)(\`p\`,{className:\`prompt\`,children:[(0,i.jsx)(\`b\`,{children:\`How old is Dunno?\`}),(0,i.jsx)(\`span\`,{className:\`prompt-translation\`,children:\`Сколько лет Незнайке?\`})]}),(0,i.jsx)(\`div\`,{className:\`choice-row\`,children:[\`4\`,\`5\`,\`6\`].map(e=>(0,i.jsx)(v,{onClick:()=>q(e,\`6\`,2),selected:b===e,correct:e===\`6\`,children:e},e))})]});case\`actions\`:`,
  "clear age scene logic",
);

replaceOnce(
  /case`actions`:\{.*?case`four-toys`:/s,
  `case\`actions\`:{let e=c[E];return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(_,{who:\`teacher\`,english:e.phrase,translation:e.ru,children:(0,i.jsx)(\`b\`,{children:e.phrase})}),(0,i.jsxs)(\`div\`,{className:\`action-card\`,children:[(0,i.jsx)(\`span\`,{children:e.icon}),(0,i.jsx)(\`b\`,{children:e.phrase}),(0,i.jsx)(\`small\`,{children:e.ru}),(0,i.jsx)(\`button\`,{onClick:()=>h(e.phrase),children:\`🔊 Послушать ещё раз\`})]}),!R&&(0,i.jsx)(\`button\`,{className:\`primary-action\`,onClick:Y,children:\`Готово! Следующая команда →\`}),(0,i.jsx)(\`div\`,{className:\`mini-progress\`,children:c.map((e,t)=>(0,i.jsx)(\`span\`,{className:t<=E?\`filled\`:\`\`},t))})]})}case\`four-toys\`:`,
  "action instructions",
);

replaceOnce(
  /case`likes`:return.*?case`nice-nasty`:/s,
  `case\`likes\`:return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(_,{who:\`teacher\`,english:\`Dunno, what would you like?\`,translation:\`Незнайка, что бы ты хотел?\`,children:[\`Незнайка загрустил. Давайте дадим ему игрушки! \`,(0,i.jsx)(\`b\`,{children:\`Dunno! What would you like?\`})]}),(0,i.jsx)(_,{who:\`dunno\`,english:M.length===3?\`Thank you! Nice girls and boys!\`:\`Can I have the dog, please?\`,translation:M.length===3?\`Спасибо! Хорошие девочки и мальчики!\`:\`Можно мне собаку, пожалуйста?\`,children:M.length===3?\`Thank you! Nice girls and boys!\`:\`Can I have the dog, please?\`}),(0,i.jsx)(\`div\`,{className:\`gift-row\`,children:o.slice(0,3).map(e=>(0,i.jsxs)(\`button\`,{disabled:M.includes(e.word),onClick:()=>{h(\`Here you are!\`,M.length%2?\`boy\`:\`girl\`);let t=[...M,e.word];N(t),t.length===3&&(h(\`Thank you! Nice girls and boys!\`,\`dunno\`),H(2,\`Thank you! Nice girls and boys!\`))},children:[(0,i.jsx)(\`span\`,{children:e.icon}),(0,i.jsx)(\`b\`,{children:M.includes(e.word)?\`Here you are! ✓\`:e.word})]},e.word))}),R&&(0,i.jsxs)(\`div\`,{className:\`kindness\`,children:[\`🐸 Погладим лягушку и скажем: \`,(0,i.jsx)(\`button\`,{onClick:()=>h(\`Nice frog!\`,\`girl\`),children:\`Nice frog! 🔊\`})]})]});case\`nice-nasty\`:`,
  "likes dialogue sequence",
);

replaceOnce(
  '"My name is Dunno! Nice to meet you too!":`dunno-name`,"How old are you?":`how-old`',
  '"My name is Dunno! Nice to meet you too!":`dunno-name`,"My name is Dunno! I am six!":`dunno-age`,"Thank you! Nice girls and boys!":`thank-you`,"How old are you?":`how-old`',
  "new child audio mappings",
);

replaceOnce(
  "`can-i-have-dog`,`yes-i-do`,`secret-guess`",
  "`can-i-have-dog`,`yes-i-do`,`dunno-age`,`thank-you`,`secret-guess`",
  "new allowed child audio",
);

replaceOnce(
  "children:`▶ Спеть песенку`",
  "children:`▶ Спеть настоящую песенку с музыкой`",
  "song button label",
);

fs.writeFileSync(file, source);
console.log("VERSION 36 JavaScript fixes applied.");
