import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.dirname(new URL(import.meta.url).pathname);
const js = fs.readFileSync(path.join(root, "client/assets/page-v31-clean.js"), "utf8");
const css = fs.readFileSync(path.join(root, "client/assets/index-v31-clean.css"), "utf8");
const checks = [];

function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
}

const sceneIds = [
  "arrival", "come-in", "why-english", "languages", "tongue", "names",
  "many-toys", "dunno-arrives", "age", "actions", "four-toys", "guess",
  "rhyme", "dunno-test", "likes", "nice-nasty", "secret-bag", "roy", "final",
];

check("19 scenes are present", sceneIds.every((id) => js.includes(`id:\`${id}\``)));
check("version is 36", js.includes("VERSION 36") && !js.includes("VERSION 35"));
check("fresh resource cache keys", !js.includes("?v=34") && !js.includes("?v=35"));
check("Dima is explicitly classified as a boy", js.includes("`dima`,`дима`"));
check("entered name is pronounced dynamically", js.includes("speechSynthesis") && js.includes("`${e}. Nice to meet you!`"));
check("age scene asks a clear age question", js.includes("How old is Dunno?") && js.includes("My name is Dunno! I am six!"));
check("action states use three different images",
  ["actions-standing.png", "actions-chairs.png", "actions-floor.png"].every((name) => js.includes(name)));
check("scene 15 has one conditional Dunno bubble", js.includes("english:M.length===3?`Thank you! Nice girls and boys!`"));
check("real song control is labelled", js.includes("Спеть настоящую песенку с музыкой"));
check("feedback is a teacher/Dunno cloud", css.includes("VERSION 36 — complete dialogue ownership") && css.includes(".scene-card>.feedback:after"));
check("scene 8 dialogue sides are explicit", css.includes(".stage.scene-dunno-arrives .speech-teacher") && css.includes(".stage.scene-dunno-arrives .speech-dunno"));
check("scene 14 dialogue sides are explicit", css.includes(".stage.scene-dunno-test .speech-teacher") && css.includes(".stage.scene-dunno-test .speech-dunno"));
check("scene 15 dialogue sides are explicit", css.includes(".stage.scene-likes .speech-teacher") && css.includes(".stage.scene-likes .speech-dunno"));
check("scene 18 has separate lyrics and answer layers", css.includes(".stage.scene-roy .song-card") && css.includes(".stage.scene-roy .choice-row"));

for (const asset of [
  "client/scenes/actions-standing.png",
  "client/scenes/actions-chairs.png",
  "client/scenes/actions-floor.png",
  "client/audio/voice-boy/dunno-age.mp3",
  "client/audio/voice-boy/thank-you.mp3",
  "client/audio/voice-boy/roy-song.mp3",
]) {
  check(`asset exists: ${asset}`, fs.existsSync(path.join(root, asset)));
}

const song = path.join(root, "client/audio/voice-boy/roy-song.mp3");
const songDuration = Number(execFileSync("ffprobe", [
  "-v", "error", "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1", song,
], { encoding: "utf8" }).trim());
check("Roy song is a full musical track", songDuration >= 20);

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? "PASS" : "FAIL"}  ${item.name}`);
}
if (failed.length) {
  process.exitCode = 1;
} else {
  console.log(`\nAll ${checks.length} VERSION 36 checks passed.`);
}
