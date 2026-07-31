import fs from "node:fs";

const file = new URL("./client/assets/page-v31-clean.js", import.meta.url);
let source = fs.readFileSync(file, "utf8");

function requiredReplace(search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing source fragment: ${label}`);
  source = source.replace(search, replacement);
}

// Dunno gets a dedicated clean young-male neural profile.
requiredReplace(
  "t===`boy`||t===`dunno`||t===`roy`?`voice-boy`",
  "t===`dunno`?`voice-dunno`:t===`boy`||t===`roy`?`voice-boy`",
  "Dunno audio routing",
);

// After a correct country answer, show the next question immediately.
requiredReplace(
  "(T(e=>e+1),x(``),y(`Yes! Excellent! Следующая страна.`))",
  "(T(e=>e+1),x(``),y(``))",
  "language round feedback",
);

// The country must be visible in the task panel, not inferred from tiny map pins.
const languagesStart = source.indexOf("case`languages`:");
const languagesEnd = source.indexOf("case`tongue`:", languagesStart);
if (languagesStart < 0 || languagesEnd < 0) throw new Error("languages scene");
let languages = source.slice(languagesStart, languagesEnd);
const choiceMarker = "(0,i.jsx)(`div`,{className:`choice-row`,children:e.options.map";
if (!languages.includes(choiceMarker)) throw new Error("language choices");
languages = languages.replace(
  choiceMarker,
  "(0,i.jsxs)(`div`,{className:`country-question`,children:[(0,i.jsx)(`span`,{children:e.country===`Франции`?`🇫🇷`:e.country===`Италии`?`🇮🇹`:`🇪🇸`}),(0,i.jsxs)(`b`,{children:[`Страна: `,e.country===`Франции`?`Франция`:e.country===`Италии`?`Италия`:`Испания`,`. Какой язык?`]})]}),(0,i.jsx)(`div`,{className:`choice-row`,children:e.options.map",
);
source = source.slice(0, languagesStart) + languages + source.slice(languagesEnd);

// Scene 8 completion must not leave an empty feedback container.
requiredReplace(
  "H(2,`Hello, little boy!`)",
  "H(2,``)",
  "scene 8 completion",
);

// Scene 10 had the same command twice. Keep the teacher cloud and one action button.
const actionsStart = source.indexOf("case`actions`:");
const actionsEnd = source.indexOf("case`four-toys`:", actionsStart);
if (actionsStart < 0 || actionsEnd < 0) throw new Error("actions scene");
let actions = source.slice(actionsStart, actionsEnd);
actions = actions.replace(
  /,\(0,i\.jsxs\)\(`div`,\{className:`action-card`,children:\[.*?\]\}\),!R&&/s,
  ",!R&&",
);
if (actions.includes("className:`action-card`")) throw new Error("duplicate action card remains");
actions = actions.replace(
  "children:`Готово! Следующая команда →`",
  "children:[`Я выполнил: `,e.phrase,` →`]",
);
source = source.slice(0, actionsStart) + actions + source.slice(actionsEnd);

source = source.replaceAll("?v=37", "?v=38");
source = source.replaceAll("VERSION 37", "VERSION 38");
fs.writeFileSync(file, source);
console.log("Applied VERSION 38 dialogue and task fixes.");
