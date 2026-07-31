import fs from "node:fs";

const file = new URL("./client/assets/page-v31-clean.js", import.meta.url);
let source = fs.readFileSync(file, "utf8");

const oldNameAudio = /function speakEnteredName\(e,t\)\{.*?\}function g\(/s;
const newNameAudio = String.raw`function normalizeChildName(e){return e.trim().toLocaleLowerCase().replaceAll(\`ё\`,\`е\`).replace(/[^a-zа-я]/gi,\`\`)}const knownChildNames={dima:\`dima\`,дима:\`dima\`,dmitry:\`dima\`,дмитрий:\`dima\`,alex:\`alex\`,алекс:\`alex\`,alexander:\`alex\`,александр:\`alex\`,misha:\`misha\`,миша:\`misha\`,mikhail:\`misha\`,михаил:\`misha\`,max:\`max\`,макс:\`max\`,maxim:\`max\`,максим:\`max\`,ivan:\`ivan\`,иван:\`ivan\`,vanya:\`ivan\`,ваня:\`ivan\`,nikita:\`nikita\`,никита:\`nikita\`,artem:\`artem\`,артем:\`artem\`,артём:\`artem\`,daniel:\`daniel\`,даниил:\`daniel\`,anna:\`anna\`,анна:\`anna\`,anya:\`anna\`,аня:\`anna\`,maria:\`maria\`,мария:\`maria\`,masha:\`maria\`,маша:\`maria\`,sofia:\`sofia\`,софия:\`sofia\`,sonya:\`sofia\`,соня:\`sofia\`,alina:\`alina\`,алина:\`alina\`,diana:\`diana\`,диана:\`diana\`,emma:\`emma\`,эмма:\`emma\`,eva:\`eva\`,ева:\`eva\`};function speakEnteredName(e,t){if(typeof window===\`undefined\`)return;activeAudio?.pause(),window.speechSynthesis?.cancel(),emitSpeak(t,\`My name is \${e}. Nice to meet you!\`);let n=knownChildNames[normalizeChildName(e)]??\`generic\`,r=new Audio(\`/audio/name-\${t===\`girl\`?\`girl\`:\`boy\`}/\${n}.mp3?v=37\`);activeAudio=r,r.volume=.96,r.onended=()=>emitSpeak(null),r.onerror=()=>{let e=new Audio(\`/audio/name-\${t===\`girl\`?\`girl\`:\`boy\`}/generic.mp3?v=37\`);activeAudio=e,e.volume=.96,e.onended=()=>emitSpeak(null),e.play().catch(()=>emitSpeak(null))},r.play().catch(()=>r.onerror?.())}function g(`;
const browserSafeNameAudio = newNameAudio
  .replaceAll("\\`", "`")
  .replaceAll("\\${", "${");

if (!oldNameAudio.test(source)) throw new Error("speakEnteredName block not found");
source = source.replace(oldNameAudio, browserSafeNameAudio);

source = source.replace(
  "y(`Все сели полукругом. Good morning!`)",
  "y(``)"
);
source = source.replace(
  "children:[(0,i.jsxs)(_,{who:`teacher`,english:`Come in, boys and girls! Sit down! Sit on the chairs!`",
  "children:[!R&&(0,i.jsxs)(_,{who:`teacher`,english:`Come in, boys and girls! Sit down! Sit on the chairs!`"
);

source = source.replaceAll("?v=36", "?v=37");
source = source.replaceAll("VERSION 36", "VERSION 37");
fs.writeFileSync(file, source);
console.log("Applied VERSION 37 runtime fixes.");
