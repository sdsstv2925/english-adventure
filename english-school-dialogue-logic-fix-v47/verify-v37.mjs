import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.dirname(new URL(import.meta.url).pathname);
const js = fs.readFileSync(path.join(root, "client/assets/page-v31-clean.js"), "utf8");
const css = fs.readFileSync(path.join(root, "client/assets/index-v31-clean.css"), "utf8");
const generator = fs.readFileSync(path.join(root, "generate-v37-audio.py"), "utf8");
const checks = [];
const check = (name, condition) => checks.push({ name, ok: Boolean(condition) });

const sceneIds = [
  "arrival", "come-in", "why-english", "languages", "tongue", "names",
  "many-toys", "dunno-arrives", "age", "actions", "four-toys", "guess",
  "rhyme", "dunno-test", "likes", "nice-nasty", "secret-bag", "roy", "final",
];
check("19 scenes are present", sceneIds.every((id) => js.includes(`id:\`${id}\``)));
check("runtime and cache are VERSION 37",
  js.includes("VERSION 37") && !js.includes("?v=36"));
check("v37 CSS is the final cascade layer",
  css.indexOf("VERSION 37 — FINAL") > css.indexOf("VERSION 35") &&
  css.trimEnd().endsWith("}"));
check("old centred name feedback cannot win",
  !css.slice(css.indexOf("VERSION 37 — FINAL")).includes("top:43%"));
check("name audio never uses browser speech synthesis",
  !js.slice(js.indexOf("function speakEnteredName"), js.indexOf("function g("))
    .includes("SpeechSynthesisUtterance"));
check("Dima uses a dedicated neural file",
  js.includes("дима:`dima`") && js.includes("/audio/name-"));
check("generated browser module has no escaped template delimiters",
  !js.slice(js.indexOf("function normalizeChildName"), js.indexOf("function g("))
    .includes("\\`"));
check("scene 2 swaps speakers instead of stacking them",
  js.includes("children:[!R&&(0,i.jsxs)(_,{who:`teacher`") &&
  js.includes("R&&(0,i.jsx)(_,{who:`girl`"));
check("scene 8 primary action is explicitly visible",
  css.includes(".stage.scene-dunno-arrives .scene-content>.primary-action") &&
  css.includes("visibility:visible!important"));
check("scene 10 uses separate control columns",
  css.includes(".stage.scene-actions .action-card") &&
  css.includes(".stage.scene-actions .primary-action"));
check("scene 18 layers do not share a bottom offset",
  css.includes("bottom:102px!important") && css.includes("bottom:20px!important"));
check("song generator applies a note melody",
  generator.includes("semitones =") && generator.includes("asetrate=48000"));

for (const asset of [
  "client/audio/name-boy/dima.mp3",
  "client/audio/name-boy/generic.mp3",
  "client/audio/name-girl/generic.mp3",
  "client/audio/voice-boy/roy-song.mp3",
  "client/scenes/actions-standing.png",
  "client/scenes/actions-chairs.png",
  "client/scenes/actions-floor.png",
]) check(`asset exists: ${asset}`, fs.existsSync(path.join(root, asset)));

for (const relative of [
  "client/audio/name-boy/dima.mp3",
  "client/audio/voice-boy/roy-song.mp3",
]) {
  const asset = path.join(root, relative);
  const info = JSON.parse(execFileSync("ffprobe", [
    "-v", "error", "-show_entries",
    "stream=sample_rate,bit_rate:format=duration", "-of", "json", asset,
  ], { encoding: "utf8" }));
  check(`${relative} is 48 kHz / 192 kbps`,
    info.streams[0].sample_rate === "48000" &&
    Number(info.streams[0].bit_rate) >= 190000);
}

const songDuration = Number(execFileSync("ffprobe", [
  "-v", "error", "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1",
  path.join(root, "client/audio/voice-boy/roy-song.mp3"),
], { encoding: "utf8" }).trim());
check("Roy track is a complete song", songDuration >= 25);

const failed = checks.filter(({ ok }) => !ok);
for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"}  ${item.name}`);
if (failed.length) process.exitCode = 1;
else console.log(`\nAll ${checks.length} VERSION 37 checks passed.`);
