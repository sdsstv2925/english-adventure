import fs from "node:fs";
const js=fs.readFileSync("client/assets/page-v31-clean.js","utf8");
const css=fs.readFileSync("client/assets/index-v31-clean.css","utf8");
const checks=[
 ["header is VERSION 39",js.includes("LESSON 1–1 · VERSION 39")],
 ["audio cache is v39",js.includes(".mp3?v=39")],
 ["browser TTS is not constructed",!js.includes("new SpeechSynthesisUtterance")],
 ["audio play rejection is handled",js.includes("u.catch(c)")],
 ["audio load errors are handled",js.includes("o.onerror=c")],
 ["stale audio callbacks are guarded",js.includes("audioRunId")],
 ["all 7 arrival handlers use h()",(js.match(/onClick:\(\)=>h\(`/g)||[]).length>=7],
 ["v39 CSS is final",css.trimEnd().endsWith("}")&&css.lastIndexOf("VERSION 39")>css.lastIndexOf("VERSION 38")],
 ["tablet arrival layout exists",css.includes("@media(max-width:900px)")],
 ["seven hitbox selectors exist",["friend-girl-left","friend-boy-left","friend-girl-glasses","friend-girl-curly","friend-boy-dark","friend-boy-red","friend-teacher"].every(x=>css.slice(css.lastIndexOf("VERSION 39")).includes(x))]
];
let failed=0; for(const [name,ok] of checks){console.log(`${ok?"PASS":"FAIL"}  ${name}`);if(!ok)failed++} if(failed)process.exit(1); console.log(`\nAll ${checks.length} VERSION 39 checks passed.`);
