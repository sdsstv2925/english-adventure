import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var scenes = [
	{
		id: "arrival",
		title: "Добро пожаловать в школу",
		chapter: "Дорога на урок",
		setting: "school"
	},
	{
		id: "come-in",
		title: "Come in, boys and girls!",
		chapter: "Начинаем урок",
		setting: "classroom"
	},
	{
		id: "why-english",
		title: "Для чего мы собрались?",
		chapter: "Зачем учить английский",
		setting: "classroom"
	},
	{
		id: "languages",
		title: "Языки мира",
		chapter: "Зачем учить английский",
		setting: "classroom"
	},
	{
		id: "tongue",
		title: "Английские язычки",
		chapter: "Проверка готовности",
		setting: "classroom"
	},
	{
		id: "names",
		title: "Игра «Повторюшки»",
		chapter: "Давайте познакомимся",
		setting: "classroom"
	},
	{
		id: "many-toys",
		title: "A lot of toys!",
		chapter: "Игрушки-помощники",
		setting: "classroom"
	},
	{
		id: "dunno-arrives",
		title: "Who’s there?",
		chapter: "К нам пришёл Незнайка",
		setting: "classroom"
	},
	{
		id: "age",
		title: "How old are you?",
		chapter: "Знакомимся с Незнайкой",
		setting: "classroom"
	},
	{
		id: "actions",
		title: "Stand up! Sit down!",
		chapter: "Игра с движениями",
		setting: "floor"
	},
	{
		id: "four-toys",
		title: "Four toys",
		chapter: "Учимся называть игрушки",
		setting: "classroom"
	},
	{
		id: "guess",
		title: "Is it a bear?",
		chapter: "Угадай игрушку",
		setting: "classroom"
	},
	{
		id: "rhyme",
		title: "I’m sitting on the floor",
		chapter: "Английский стишок",
		setting: "floor"
	},
	{
		id: "dunno-test",
		title: "Проверяем Незнайку",
		chapter: "Повторяем слова",
		setting: "classroom"
	},
	{
		id: "likes",
		title: "What would you like?",
		chapter: "Делимся игрушками",
		setting: "classroom"
	},
	{
		id: "nice-nasty",
		title: "Nice or nasty?",
		chapter: "This и that",
		setting: "classroom"
	},
	{
		id: "secret-bag",
		title: "What’s in the bag?",
		chapter: "Сумка с секретом",
		setting: "classroom"
	},
	{
		id: "roy",
		title: "What’s your name, little boy?",
		chapter: "Песенка про Роя",
		setting: "classroom"
	},
	{
		id: "final",
		title: "The lesson is over!",
		chapter: "До следующего урока",
		setting: "classroom"
	}
];
var toySet = [
	{
		word: "a bear",
		ru: "медведь",
		icon: "🧸"
	},
	{
		word: "a hare",
		ru: "заяц",
		icon: "🐰"
	},
	{
		word: "a dog",
		ru: "собака",
		icon: "🐶"
	},
	{
		word: "a frog",
		ru: "лягушка",
		icon: "🐸"
	}
];
var languageQuiz = [
	{
		country: "Франции",
		answer: "French",
		options: [
			"French",
			"Italian",
			"Spanish"
		]
	},
	{
		country: "Италии",
		answer: "Italian",
		options: [
			"English",
			"Spanish",
			"Italian"
		]
	},
	{
		country: "Испании",
		answer: "Spanish",
		options: [
			"Italian",
			"Spanish",
			"French"
		]
	}
];
var actionSequence = [
	{
		phrase: "Stand up!",
		ru: "Встань",
		icon: "🙋"
	},
	{
		phrase: "Sit down!",
		ru: "Сядь",
		icon: "🪑"
	},
	{
		phrase: "Sit on the floor!",
		ru: "Сядь на пол",
		icon: "🧘"
	},
	{
		phrase: "Stand up!",
		ru: "Встань",
		icon: "🙋"
	},
	{
		phrase: "Sit down!",
		ru: "Сядь",
		icon: "🪑"
	},
	{
		phrase: "Sit on the chairs!",
		ru: "Сядь на стул",
		icon: "🪑"
	}
];
var voiceFiles = {
	"Hello! Good morning!": "hello-good-morning",
	"Come in, boys and girls! Sit down! Sit on the chairs!": "come-in",
	"Good morning!": "good-morning",
	"Good!": "good",
	"Yes! Excellent!": "yes-excellent",
	"Try again!": "try-again",
	"No. Try again!": "try-again",
	"Hello!": "hello",
	"Hi!": "hi",
	"My": "my-name-is",
	"name": "my-name-is",
	"is…": "my-name-is",
	"A lot of toys!": "a-lot-of-toys",
	"Who's there?": "whos-there",
	"It's me! I'm a little boy!": "dunno-at-door",
	"Come in, little boy!": "come-in-little-boy",
	"What's your name, little boy?": "whats-your-name-boy",
	"My name is Dunno! Nice to meet you too!": "dunno-name",
	"How old are you?": "how-old",
	"1": "one",
	"2": "two",
	"3": "three",
	"4": "four",
	"Let's play a game!": "lets-play",
	"Stand up!": "stand-up",
	"Sit down!": "sit-down",
	"Sit on the floor!": "sit-floor",
	"Sit on the chairs!": "sit-chairs",
	"How many toys are there on the table?": "how-many-toys",
	"This is a bear.": "this-bear",
	"This is a hare.": "this-hare",
	"This is a dog.": "this-dog",
	"This is a frog.": "this-frog",
	"Are you ready?": "are-you-ready",
	"One, two, three, four. I'm sitting on the floor. I'm sitting on the floor. One, two, three, four.": "floor-rhyme",
	"One, two, three, five, six! I give up! I don't know!": "i-give-up",
	"There are four toys on the table!": "four-toys",
	"Dunno, what would you like?": "what-would-you-like",
	"Can I have the dog, please?": "can-i-have-dog",
	"Here you are!": "here-you-are",
	"Yes, I do! I like the bear. I don't like the frog!": "yes-i-do",
	"Nice frog!": "nice-frog",
	"This frog is nice!": "this-frog-nice",
	"That frog isn't nice. That frog is nasty!": "that-frog-nasty",
	"Let me have a look at the bag! What's in the bag?": "look-at-bag",
	"It's a secret! Guess!": "secret-guess",
	"Yes, it is! It's a picture!": "yes-picture",
	"a cat, a mouse": "cat-mouse",
	"What's your name? What's your name? What's your name, little boy? My name is Roy. How old are you? How old are you? How old are you? I am six, I am six, I am six, and you?": "roy-song",
	"Goodbye! See you next time!": "goodbye"
};
var translations = {
	"Hello! Good morning!": "Привет! Доброе утро!",
	"Come in, boys and girls! Sit down! Sit on the chairs!": "Входите, мальчики и девочки! Садитесь! Садитесь на стулья!",
	"Good morning!": "Доброе утро!",
	"Good!": "Хорошо!",
	"Yes! Excellent!": "Да! Отлично!",
	"Try again!": "Попробуй ещё раз!",
	"No. Try again!": "Нет. Попробуй ещё раз!",
	"Hello!": "Привет!",
	"Hi!": "Привет!",
	"A lot of toys!": "Много игрушек!",
	"Who's there?": "Кто там?",
	"It's me! I'm a little boy!": "Это я! Я маленький мальчик!",
	"Come in, little boy!": "Входи, маленький мальчик!",
	"What's your name, little boy?": "Как тебя зовут, маленький мальчик?",
	"My name is Dunno! Nice to meet you too!": "Меня зовут Незнайка! Мне тоже приятно познакомиться!",
	"How old are you?": "Сколько тебе лет?",
	"Let's play a game!": "Давайте поиграем!",
	"Stand up!": "Встань!",
	"Sit down!": "Сядь!",
	"Sit on the floor!": "Сядь на пол!",
	"Sit on the chairs!": "Сядь на стул!",
	"How many toys are there on the table?": "Сколько игрушек на столе?",
	"This is a bear.": "Это медведь.",
	"This is a hare.": "Это заяц.",
	"This is a dog.": "Это собака.",
	"This is a frog.": "Это лягушка.",
	"Are you ready?": "Ты готов?",
	"One, two, three, four. I'm sitting on the floor. I'm sitting on the floor. One, two, three, four.": "Один, два, три, четыре. Я сижу на полу. Я сижу на полу. Один, два, три, четыре.",
	"One, two, three, five, six! I give up! I don't know!": "Один, два, три, пять, шесть! Я сдаюсь! Я не знаю!",
	"There are four toys on the table!": "На столе четыре игрушки!",
	"Dunno, what would you like?": "Незнайка, что бы ты хотел?",
	"Can I have the dog, please?": "Можно мне собаку, пожалуйста?",
	"Here you are!": "Вот, держи!",
	"Yes, I do! I like the bear. I don't like the frog!": "Да! Мне нравится медведь. Мне не нравится лягушка!",
	"Nice frog!": "Милая лягушка!",
	"This frog is nice!": "Эта лягушка милая!",
	"That frog isn't nice. That frog is nasty!": "Та лягушка не милая. Она противная!",
	"Let me have a look at the bag! What's in the bag?": "Дай мне посмотреть на сумку! Что находится в сумке?",
	"It's a secret! Guess!": "Это секрет! Угадай!",
	"Yes, it is! It's a picture!": "Да! Это картинка!",
	"a cat, a mouse": "кошка, мышка",
	"What's your name? What's your name? What's your name, little boy? My name is Roy. How old are you? How old are you? How old are you? I am six, I am six, I am six, and you?": "Как тебя зовут, маленький мальчик? Меня зовут Рой. Сколько тебе лет? Мне шесть, а тебе?",
	"Goodbye! See you next time!": "До свидания! До следующей встречи!"
};
var activeAudio = null;
var speechStopTimer = null;
var childVoiceFiles = new Set([
	"hello",
	"hi",
	"good-morning",
	"my-name-is",
	"one",
	"two",
	"three",
	"four",
	"here-you-are",
	"nice-frog",
	"dunno-at-door",
	"dunno-name",
	"i-give-up",
	"can-i-have-dog",
	"yes-i-do",
	"secret-guess",
	"yes-picture",
	"yes-it-is",
	"no-isnt",
	"roy-song"
]);
function setSpeakingCharacter(who, text = "") {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("lesson-character-speak", { detail: {
		who,
		text
	} }));
	if (speechStopTimer) window.clearTimeout(speechStopTimer);
	if (who) speechStopTimer = window.setTimeout(() => window.dispatchEvent(new CustomEvent("lesson-character-speak", { detail: {
		who: null,
		text: ""
	} })), Math.max(1300, Math.min(9e3, text.length * 72)));
}
function speak(text, who = "teacher", onEnd) {
	if (typeof window === "undefined") return;
	if (text === "Knock knock!") {
		const AudioContextClass = window.AudioContext;
		const context = new AudioContextClass();
		[0, .28].forEach((delay) => {
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			oscillator.type = "sine";
			oscillator.frequency.setValueAtTime(115, context.currentTime + delay);
			oscillator.frequency.exponentialRampToValueAtTime(62, context.currentTime + delay + .11);
			gain.gain.setValueAtTime(1e-4, context.currentTime + delay);
			gain.gain.exponentialRampToValueAtTime(.62, context.currentTime + delay + .012);
			gain.gain.exponentialRampToValueAtTime(1e-4, context.currentTime + delay + .15);
			oscillator.connect(gain).connect(context.destination);
			oscillator.start(context.currentTime + delay);
			oscillator.stop(context.currentTime + delay + .16);
		});
		return;
	}
	setSpeakingCharacter(who, text);
	let voiceFile = voiceFiles[text];
	if (!voiceFile && text.startsWith("This is a ")) voiceFile = voiceFiles[`${text.replace("This is a ", "This is a ").replace("..", ".")}`];
	if (!voiceFile && text.startsWith("My name is ")) voiceFile = "my-name-is";
	if (!voiceFile && text.startsWith("Yes, it is!")) voiceFile = "yes-it-is";
	if (!voiceFile && text.startsWith("No, it isn't")) voiceFile = "no-isnt";
	if (voiceFile) {
		if (who !== "teacher" && !childVoiceFiles.has(voiceFile)) voiceFile = void 0;
	}
	if (voiceFile) {
		activeAudio?.pause();
		activeAudio = new Audio(`/audio/${who === "girl" || who === "child" ? "voice-girl" : who === "girl2" ? "voice-girl-2" : who === "boy" || who === "dunno" || who === "roy" ? "voice-boy" : who === "boy2" ? "voice-boy-2" : "voice"}/${voiceFile}.mp3`);
		activeAudio.volume = .96;
		activeAudio.onended = () => {
			setSpeakingCharacter(null);
			onEnd?.();
		};
		activeAudio.play();
		return;
	}
	if (!("speechSynthesis" in window)) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "en-US";
	utterance.rate = .78;
	utterance.pitch = who === "teacher" ? 1.03 : who === "girl" || who === "child" ? 1.12 : .96;
	const voices = window.speechSynthesis.getVoices();
	const selectedVoice = who === "teacher" ? voices.find((voice) => /Samantha|Victoria|Allison/i.test(voice.name)) : who === "girl" || who === "girl2" || who === "child" ? voices.find((voice) => /Flo|Kathy|Princess/i.test(voice.name)) : voices.find((voice) => /Eddy|Junior|Daniel/i.test(voice.name));
	if (selectedVoice) utterance.voice = selectedVoice;
	utterance.onend = () => {
		setSpeakingCharacter(null);
		onEnd?.();
	};
	window.speechSynthesis.speak(utterance);
}
function AnimatedCast({ sceneId, speaking, sceneDone, substep, actionIndex }) {
	const hasTeacher = false;
	const hasDunno = [
		"dunno-arrives",
		"age",
		"dunno-test",
		"likes",
		"nice-nasty",
		"secret-bag"
	].includes(sceneId) && (sceneId !== "dunno-arrives" || substep >= 2);
	const hasRoy = sceneId === "roy";
	const hasChildren = ![
		"arrival",
		"secret-bag",
		"final",
		"roy"
	].includes(sceneId) && (!hasDunno || sceneId === "likes");
	const pose = sceneId === "come-in" ? sceneDone || substep >= 1 ? "kids-seated" : "kids-entering" : sceneId === "actions" ? actionSequence[actionIndex].phrase.includes("floor") ? "kids-on-floor" : actionSequence[actionIndex].phrase.includes("Stand") ? "kids-standing" : "kids-seated" : sceneId === "rhyme" ? "kids-on-floor" : hasChildren && sceneId !== "arrival" ? "kids-seated" : "";
	const bubbleText = speaking.text.length > 72 ? `${speaking.text.slice(0, 69)}…` : speaking.text;
	const girlImage = pose === "kids-seated" ? "/characters/girl-chair.png" : pose === "kids-on-floor" ? "/characters/girl-floor.png" : "/characters/girl-standing-v2.png";
	const boyImage = pose === "kids-seated" ? "/characters/boy-chair.png" : pose === "kids-on-floor" ? "/characters/boy-floor.png" : "/characters/boy-standing-v2.png";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `animated-cast cast-${sceneId} ${pose}`,
		children: [
			hasTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `cartoon-character character-teacher ${speaking.who === "teacher" ? "is-speaking" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/characters/teacher.png",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "talk-bubble",
					children: bubbleText
				})]
			}),
			hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `cartoon-character character-girl ${speaking.who === "girl" || speaking.who === "child" ? "is-speaking" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: girlImage,
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "talk-bubble",
					children: bubbleText
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `cartoon-character character-boy ${speaking.who === "boy" ? "is-speaking" : speaking.who === "child" ? "is-reacting" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: boyImage,
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "talk-bubble",
					children: bubbleText
				})]
			})] }),
			hasDunno && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `cartoon-character character-dunno ${speaking.who === "dunno" ? "is-speaking" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/characters/dunno.png",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "talk-bubble",
					children: bubbleText
				})]
			}),
			hasRoy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `cartoon-character character-roy ${speaking.who === "roy" ? "is-speaking" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/characters/boy-standing-v2.png",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "talk-bubble",
					children: bubbleText
				})]
			})
		]
	});
}
function Speech({ who, children, english, translation, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `speech speech-${who}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "speaker-avatar",
				"aria-hidden": "true",
				children: {
					teacher: "👩🏼‍🏫",
					girl: "👧🏻",
					girl2: "👧🏼",
					boy: "👦🏻",
					boy2: "👦🏽",
					child: "👧🏻",
					dunno: "👦🏼",
					roy: "👦🏽"
				}[who]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "speech-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "speaker-name",
						children: {
							teacher: "Мисс Эмми",
							girl: "Девочка",
							girl2: "Девочка",
							boy: "Мальчик",
							boy2: "Мальчик",
							child: "Дети",
							dunno: "Незнайка",
							roy: "Рой"
						}[who]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "speech-text",
						children
					}),
					english && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "translation-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RU" }), translation ?? translations[english] ?? "Перевод показан в задании ниже"]
					}),
					note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
						className: "gesture-note",
						children: ["☝️ ", note]
					})
				]
			}),
			english && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "round-sound",
				onClick: () => speak(english, who),
				"aria-label": `Послушать: ${english}`,
				children: "🔊"
			})
		]
	});
}
function ChoiceButton({ children, onClick, selected, correct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: `choice-button ${selected ? correct ? "right" : "wrong" : ""}`,
		onClick,
		children
	});
}
function Home() {
	const [sceneIndex, setSceneIndex] = (0, import_react.useState)(0);
	const [stars, setStars] = (0, import_react.useState)(0);
	const [completed, setCompleted] = (0, import_react.useState)({});
	const [substep, setSubstep] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)("");
	const [childName, setChildName] = (0, import_react.useState)("");
	const [languageIndex, setLanguageIndex] = (0, import_react.useState)(0);
	const [actionIndex, setActionIndex] = (0, import_react.useState)(0);
	const [toyIndex, setToyIndex] = (0, import_react.useState)(0);
	const [guessTarget, setGuessTarget] = (0, import_react.useState)(2);
	const [gifted, setGifted] = (0, import_react.useState)([]);
	const [speakingCharacter, setSpeakingCharacterState] = (0, import_react.useState)({
		who: null,
		text: ""
	});
	(0, import_react.useEffect)(() => {
		const handleSpeech = (event) => {
			setSpeakingCharacterState(event.detail);
		};
		window.addEventListener("lesson-character-speak", handleSpeech);
		return () => window.removeEventListener("lesson-character-speak", handleSpeech);
	}, []);
	const scene = scenes[sceneIndex];
	const progress = Math.round(sceneIndex / (scenes.length - 1) * 100);
	const done = Boolean(completed[scene.id]);
	const sceneImage = scene.id === "arrival" ? "/scenes/v17-scene-01.webp" : scene.id === "come-in" ? "/scenes/v17-scene-02.webp" : scene.id === "why-english" ? "/scenes/v17-scene-03.webp" : scene.id === "languages" ? "/scenes/v17-scene-04.webp" : scene.id === "tongue" ? "/scenes/v17-scene-05.webp" : scene.id === "names" ? "/scenes/approved-06.webp" : scene.id === "many-toys" ? "/scenes/approved-07.webp" : scene.id === "dunno-arrives" ? "/scenes/approved-08.webp" : scene.id === "age" ? "/scenes/approved-09.webp" : scene.id === "actions" ? "/scenes/approved-10.webp" : scene.id === "rhyme" ? "/scenes/approved-song.webp" : scene.id === "secret-bag" ? "/scenes/mystery-bag.webp" : ["four-toys", "guess", "likes", "nice-nasty", "dunno-test"].includes(scene.id) ? "/scenes/toy-table.webp" : "/scenes/classroom-story.webp";
	const visualKind = scene.id === "arrival" ? "school" : scene.id === "secret-bag" ? "mystery" : ["many-toys", "four-toys", "guess", "likes", "nice-nasty", "dunno-test"].includes(scene.id) ? "toys" : ["dunno-arrives", "age", "roy", "final"].includes(scene.id) ? "story" : "welcome";
	const shuffledToys = (0, import_react.useMemo)(() => {
		const orders = [
			[
				toySet[2],
				toySet[0],
				toySet[3],
				toySet[1]
			],
			[
				toySet[1],
				toySet[3],
				toySet[0],
				toySet[2]
			],
			[
				toySet[3],
				toySet[2],
				toySet[1],
				toySet[0]
			],
			[
				toySet[0],
				toySet[1],
				toySet[2],
				toySet[3]
			]
		];
		return orders[guessTarget % orders.length];
	}, [guessTarget]);
	function complete(points = 1, message = "Excellent! Можно идти дальше.") {
		if (!completed[scene.id]) setStars((value) => value + points);
		setCompleted((old) => ({
			...old,
			[scene.id]: true
		}));
		setFeedback(message);
	}
	function resetSceneState() {
		setSubstep(0);
		setFeedback("");
		setSelected("");
		setLanguageIndex(0);
		setActionIndex(0);
		setToyIndex(0);
		setGuessTarget(2);
		setGifted([]);
	}
	function nextScene() {
		setSceneIndex((value) => Math.min(value + 1, scenes.length - 1));
		resetSceneState();
	}
	function previousScene() {
		setSceneIndex((value) => Math.max(value - 1, 0));
		resetSceneState();
	}
	function enterSchool() {
		if (!completed.arrival) setStars((value) => value + 1);
		setCompleted((old) => ({
			...old,
			arrival: true
		}));
		setSceneIndex(1);
		resetSceneState();
		let seatingFinished = false;
		const seatChildren = () => {
			if (seatingFinished) return;
			seatingFinished = true;
			setSubstep(1);
			setFeedback("Все сели полукругом. Good morning!");
			if (!completed["come-in"]) setStars((value) => value + 1);
			setCompleted((old) => ({
				...old,
				"come-in": true
			}));
		};
		speak("Come in, boys and girls! Sit down! Sit on the chairs!", "teacher", seatChildren);
		window.setTimeout(seatChildren, 4300);
	}
	function pickAnswer(value, answer, points = 1) {
		setSelected(value);
		if (value === answer) {
			speak("Yes! Excellent!", "teacher");
			complete(points);
		} else {
			speak("No. Try again!", "teacher");
			setFeedback("Почти! Попробуй ещё раз.");
		}
	}
	function answerLanguage(value) {
		const question = languageQuiz[languageIndex];
		setSelected(value);
		if (value !== question.answer) {
			setFeedback("Попробуй другой ответ.");
			speak("Try again!");
			return;
		}
		speak("Yes! Excellent!");
		if (languageIndex === languageQuiz.length - 1) complete(2, "Отлично! В мире очень много языков.");
		else {
			setLanguageIndex((index) => index + 1);
			setSelected("");
			setFeedback("Yes! Следующая страна.");
		}
	}
	function nextAction() {
		const next = actionIndex + 1;
		if (next === actionSequence.length) {
			complete(2, "Not bad! Good for you!");
			return;
		}
		setActionIndex(next);
		speak(actionSequence[next].phrase);
		setFeedback("Хорошо! Слушай следующую команду.");
	}
	function nextToyWord() {
		const next = toyIndex + 1;
		if (next === toySet.length) {
			complete(2, "Все четыре слова выучены!");
			return;
		}
		setToyIndex(next);
		speak(`This is ${toySet[next].word}.`);
	}
	function guessToy(word) {
		const answer = toySet[guessTarget].word;
		setSelected(word);
		if (word !== answer) {
			setFeedback(`No, it isn’t! It isn’t ${word}.`);
			speak(`No, it isn't. It isn't ${word}.`);
			return;
		}
		speak(`Yes, it is! It's ${answer}.`);
		if (guessTarget === 3) complete(3, "Yes, it is! Все игрушки угаданы!");
		else {
			setGuessTarget((value) => value + 1);
			setSelected("");
			setFeedback("Yes, it is! Следующая загадка.");
		}
	}
	function renderScene() {
		switch (scene.id) {
			case "arrival": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arrival-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "arrival-title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LESSON 1–1 · ТВОЁ ПЕРВОЕ ПРИКЛЮЧЕНИЕ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Добро пожаловать в" }), "English School!"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Нажми на ребят и поздоровайся с ними" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "school-friends",
						"aria-label": "Поздоровайся с детьми возле школы",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `school-friend friend-boy-front ${speakingCharacter.who === "boy" ? "is-greeting" : ""}`,
								onClick: () => speak("Hello!", "boy"),
								"aria-label": "Мальчик говорит Hello",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Hello!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Привет!" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `school-friend friend-girl-center ${speakingCharacter.who === "girl" ? "is-greeting" : ""}`,
								onClick: () => speak("Hi!", "girl"),
								"aria-label": "Девочка говорит Hi",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Hi!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Привет!" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `school-friend friend-boy-center ${speakingCharacter.who === "boy2" ? "is-greeting" : ""}`,
								onClick: () => speak("Hello!", "boy2"),
								"aria-label": "Мальчик говорит Hello",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Hello!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Привет!" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `school-friend friend-girl-right ${speakingCharacter.who === "girl2" ? "is-greeting" : ""}`,
								onClick: () => speak("Good morning!", "girl2"),
								"aria-label": "Девочка говорит Good morning",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Good morning!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Доброе утро!" })] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-action arrival-enter",
						onClick: enterSchool,
						children: [
							"Войти в школу ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Enter the school" })
						]
					})
				]
			});
			case "come-in": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					english: "Come in, boys and girls! Sit down! Sit on the chairs!",
					note: "Учительница открывает дверь и приглашает жестом.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Come in, boys and girls!" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Sit down! Sit on the chairs!"
					]
				}),
				!done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "seating-progress",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🪑" }), " Дети проходят к стульям…"]
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "girl",
					english: "Good morning!",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Good morning!" })
				})
			] });
			case "why-english": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					children: "Надеюсь, все попали в нужный кабинет! Для чего мы здесь собрались? Рисовать? Петь? Учить китайский? 🙂"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prompt",
					children: "Выбери правильный ответ:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-grid",
					children: [
						"Рисовать 🎨",
						"Петь 🎵",
						"Учить китайский 🀄",
						"Изучать английский 🇬🇧"
					].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer(value, "Изучать английский 🇬🇧"),
						selected: selected === value,
						correct: value.startsWith("Изучать"),
						children: value
					}, value))
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					english: "Good!",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Ну, хорошо! Good!" })
				})
			] });
			case "languages": {
				const quiz = languageQuiz[languageIndex];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
						who: "teacher",
						children: [
							"Какие языки вы знаете? На каком языке говорят во ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: quiz.country }),
							"?"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "language-map",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: quiz.country === "Франции" ? "🇫🇷" : quiz.country === "Италии" ? "🇮🇹" : "🇪🇸" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: quiz.country })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "choice-row",
						children: quiz.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
							onClick: () => answerLanguage(option),
							selected: selected === option,
							correct: option === quiz.answer,
							children: option
						}, option))
					}),
					done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "story-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🌍" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Языков на свете очень много, и выучить все невозможно. Поэтому для общения между людьми разных стран выбрали ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "английский язык" }),
							". Его называют международным!"
						] })]
					})
				] });
			}
			case "tongue": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					note: "Хитро улыбается и смотрит на детей.",
					children: [
						"Сейчас проверим: у всех ли есть ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "английские язычки" }),
						" во рту? Повторяйте за мной!"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hero-phrase",
					onClick: () => {
						speak("Hello!");
						setSubstep(1);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔊" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Hello!" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Привет! · Нажми, послушай и повтори" })
					]
				}),
				substep > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-action",
					onClick: () => complete(1, "Отлично! Все готовы к английскому!"),
					children: "Я повторил: Hello!"
				})
			] });
			case "names": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					children: [
						"Поиграем в ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "«Повторюшки»" }),
						"! У повторюшек огромные уши, поэтому они красиво всё повторяют. Приготовили ушки!"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "echo-gnomes",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👂" }),
						[
							"My",
							"name",
							"is…"
						].map((word) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => speak(word),
							children: word
						}, word)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👂" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "name-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["My name is ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "· Меня зовут" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: childName,
						onChange: (event) => setChildName(event.target.value),
						placeholder: "твоё имя",
						maxLength: 18
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-action",
					onClick: () => {
						if (!childName.trim()) return setFeedback("Сначала напиши своё имя.");
						speak(`My name is ${childName}. Nice to meet you!`, /[aаáàя]$/i.test(childName.trim()) ? "girl" : "boy");
						complete(2, `Nice to meet you, ${childName}! Let’s be friends! 🤝`);
					},
					children: "Познакомиться 🤝"
				})
			] });
			case "many-toys": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					children: [
						"А помогут нам выучить английский вот эти игрушки! Интересно, сколько их? Если я угадала, говорите ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Yes!" }),
						", если нет — ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "No!" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "toy-cloud",
					"aria-label": "Много игрушек",
					children: [
						"🧸",
						"🐰",
						"🐶",
						"🐸",
						"🐱",
						"🐭",
						"🦊",
						"🦁",
						"🐵",
						"🦄",
						"🐼",
						"🐯"
					].map((toy, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toy }, index))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "prompt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "How many toys are here?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "prompt-translation",
						children: "Сколько здесь игрушек?"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-row",
					children: [
						"1",
						"2",
						"4",
						"A lot of toys!"
					].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer(value, "A lot of toys!", 2),
						selected: selected === value,
						correct: value === "A lot of toys!",
						children: value
					}, value))
				})
			] });
			case "dunno-arrives": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "knock-event",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "knock-rings",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Кто-то стучит в дверь…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Нажми, чтобы услышать стук" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "knock-button",
							onClick: () => {
								speak("Knock knock!", "dunno");
								setSubstep(Math.max(substep, 1));
							},
							children: ["ТУК-ТУК! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✊" })]
						})
					]
				}),
				substep >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					english: "Who's there?",
					note: "Who — пожимаем плечами; there — показываем на дверь.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Who’s there?" })
				}),
				substep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-action",
					onClick: () => {
						speak("It's me! I'm a little boy!", "dunno");
						setSubstep(2);
					},
					children: "Спросить, кто там"
				}),
				substep >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "dunno",
					english: "It's me! I'm a little boy!",
					children: "It’s me! I’m a little boy!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "primary-action",
					onClick: () => {
						speak("Come in, little boy!");
						complete(2, "Hello, little boy!");
					},
					children: ["Come in, little boy! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "· Входи, маленький мальчик!" })]
				})] })
			] });
			case "age": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "character-card dunno-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👦🏼" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dunno" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Незнайка" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					english: "What's your name, little boy?",
					children: "What’s your name, little boy?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "dunno",
					english: "My name is Dunno! Nice to meet you too!",
					children: "My name is Dunno! Nice to meet you too!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					english: "How old are you?",
					note: "На каждый слог разгибаем по одному пальцу.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "How old are you?" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "finger-count",
					children: [
						1,
						2,
						3,
						4
					].map((number) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => speak(String(number), number % 2 ? "girl" : "boy"),
						children: number
					}, number))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "prompt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Is Dunno a big boy or a little boy?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "prompt-translation",
						children: "Незнайка большой или маленький мальчик?"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "choice-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer("big", "little"),
						selected: selected === "big",
						children: "A big boy · большой"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer("little", "little", 2),
						selected: selected === "little",
						correct: true,
						children: "A little boy · маленький"
					})]
				})
			] });
			case "actions": {
				const action = actionSequence[actionIndex];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
						who: "teacher",
						english: action.phrase,
						translation: action.ru,
						children: ["Маленькие мальчики очень любят играть. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Let’s play a game!" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "action-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: action.icon }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: action.phrase }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: action.ru }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => speak(action.phrase),
								children: "🔊 Послушать"
							})
						]
					}),
					!done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: nextAction,
						children: "Выполнено! ✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mini-progress",
						children: actionSequence.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: index <= actionIndex ? "filled" : "" }, index))
					})
				] });
			}
			case "four-toys": {
				const toy = toySet[toyIndex];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
						who: "teacher",
						english: "How many toys are there on the table?",
						translation: "Сколько игрушек на столе?",
						children: ["How many toys are there on the table? Let’s count the toys: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1, 2, 3, 4!" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-toys",
						children: toySet.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.icon }, item.word))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "word-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toy.icon }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "What’s this?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								"This is ",
								toy.word,
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: toy.ru }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => speak(`This is ${toy.word}.`),
								children: "🔊"
							})
						]
					}),
					!done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: nextToyWord,
						children: toyIndex === toySet.length - 1 ? "Я запомнил все слова!" : "Следующая игрушка →"
					})
				] });
			}
			case "guess": {
				const target = toySet[guessTarget];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
						who: "teacher",
						english: "Are you ready?",
						translation: "Ты готов?",
						children: ["Я отвернусь, а ты выбери игрушку. Потом попробуем её угадать! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Are you ready?" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "prompt",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							"Find ",
							target.word,
							"!"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "prompt-translation",
							children: ["Найди: ", target.ru]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "toy-choice-grid",
						children: shuffledToys.map((toy) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => guessToy(toy.word),
							className: selected === toy.word ? toy.word === target.word ? "right" : "wrong" : "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toy.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: toy.word })]
						}, toy.word))
					})
				] });
			}
			case "rhyme": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					note: "1–2–3–4 — пальчики; I’m — на себя; sitting — по попе; on the floor — на пол.",
					children: "А вы знаете, какой стишок читают английские ребята, когда садятся на пол?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rhyme-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => speak("One, two, three, four. I'm sitting on the floor. I'm sitting on the floor. One, two, three, four."),
						children: "🔊"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1, 2, 3, 4," }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"I’m sitting on the floor.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"I’m sitting on the floor,",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1, 2, 3, 4." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "verse-translation",
						children: "Один, два, три, четыре — я сижу на полу."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-action",
					onClick: () => complete(2, "Good for you! Стишок получился!"),
					children: "Рассказать вместе"
				})
			] });
			case "dunno-test": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					english: "How many toys are there on the table?",
					translation: "Сколько игрушек на столе?",
					children: "Проверим, хорошо ли Незнайка запомнил урок. Dunno! How many toys are there on the table?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "dunno",
					english: "One, two, three, five, six! I give up! I don't know!",
					children: [
						"1, 2, 3, 5, 6!",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "I give up! I don’t know!" }),
						" 🙌"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prompt",
					children: "Помоги Незнайке выбрать правильный ответ:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-row",
					children: [
						"3 toys",
						"4 toys",
						"6 toys"
					].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer(value, "4 toys", 2),
						selected: selected === value,
						correct: value === "4 toys",
						children: value
					}, value))
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-toys small",
					children: toySet.map((toy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toy.icon }, toy.word))
				})
			] });
			case "likes": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					english: "Dunno, what would you like?",
					translation: "Незнайка, что бы ты хотел?",
					children: ["Незнайка загрустил. Давайте дадим ему игрушки! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Dunno! What would you like?" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "dunno",
					english: "Can I have the dog, please?",
					children: "Can I have the dog, please?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "gift-row",
					children: toySet.slice(0, 3).map((toy) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: gifted.includes(toy.word),
						onClick: () => {
							speak("Here you are!", gifted.length % 2 ? "boy" : "girl");
							const next = [...gifted, toy.word];
							setGifted(next);
							if (next.length === 3) complete(2, "Thank you! Nice girls and boys!");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toy.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: gifted.includes(toy.word) ? "Here you are! ✓" : toy.word })]
					}, toy.word))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "dunno",
					english: "Yes, I do! I like the bear. I don't like the frog!",
					children: [
						"Yes, I do! I like the bear!",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"No, I don’t! I don’t like the frog!"
					]
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kindness",
					children: ["🐸 Погладим лягушку и скажем: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => speak("Nice frog!", "girl"),
						children: "Nice frog! 🔊"
					})]
				})
			] });
			case "nice-nasty": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					english: "This frog is nice!",
					translation: "Эта лягушка милая!",
					children: [
						"This frog is nice! Look at ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "that frog" }),
						". Is that frog nice?"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "near-far",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "THIS · близко" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐸" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "nice" })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "THAT · далеко" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "nasty-frog",
							children: "🐸"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "nasty" })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "prompt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "That frog is…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "prompt-translation",
						children: "Та лягушка…"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "choice-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer("nice", "nasty"),
						selected: selected === "nice",
						children: "nice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer("nasty", "nasty", 2),
						selected: selected === "nasty",
						correct: true,
						children: "nasty"
					})]
				})
			] });
			case "secret-bag": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bag-scene",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎒" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "a red bag" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Speech, {
					who: "teacher",
					english: "Let me have a look at the bag! What's in the bag?",
					children: ["This is a nice red bag! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "What’s in the bag?" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "dunno",
					english: "It's a secret! Guess!",
					children: "It’s a secret! Guess!"
				}),
				substep === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prompt",
					children: "Is it a…?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-row",
					children: [
						"bear",
						"dog",
						"frog",
						"picture"
					].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "choice-button",
						onClick: () => {
							if (value === "picture") {
								speak("Yes, it is! It's a picture!", "dunno");
								setSubstep(1);
								setFeedback("Yes, it is! It’s a picture!");
							} else {
								speak(`No, it isn't. It isn't a ${value}.`, "dunno");
								setFeedback(`No, it isn’t! It isn’t a ${value}.`);
							}
						},
						children: value
					}, value))
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "picture-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🧸" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐰" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐶" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐸" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐱" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐭" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "prompt",
						children: ["Новые слова: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "inline-word",
							onClick: () => speak("a cat, a mouse"),
							children: "a cat 🐱 · a mouse 🐭 🔊"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: () => complete(3, "Секрет раскрыт! It’s a picture!"),
						children: "Я запомнил!"
					})
				] })
			] });
			case "roy": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "character-card roy-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👦🏽" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Roy" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "6 years old" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speech, {
					who: "teacher",
					children: "Хотите узнать, как зовут этого мальчика и сколько ему лет? Споём песенку!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "song-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => speak("What's your name? What's your name? What's your name, little boy? My name is Roy. How old are you? How old are you? How old are you? I am six, I am six, I am six, and you?", "roy"),
							children: "▶ Спеть песенку"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"🎵 What’s your name? What’s your name?",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"What’s your name, little boy?",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "My name is Roy." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"How old are you? How old are you?",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "I am 6, I am 6, and you?" }),
							" 🎵"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "song-translation",
							children: [
								"Как тебя зовут, маленький мальчик? — Меня зовут Рой.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Сколько тебе лет? — Мне шесть. А тебе?"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prompt",
					children: "Сколько лет Рою?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-row",
					children: [
						"4",
						"5",
						"6"
					].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceButton, {
						onClick: () => pickAnswer(value, "6", 3),
						selected: selected === value,
						correct: value === "6",
						children: value
					}, value))
				})
			] });
			case "final": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cinderella-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👸🏼" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cinderella" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Спой песенки на всех ступеньках — и помоги Золушке достать туфельку!" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👠" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lesson-complete",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏆" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["And now, the lesson is over!", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "А теперь урок окончен!" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Goodbye!" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => speak("Goodbye! See you next time!"),
							children: "🔊 Goodbye!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "score-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Твой результат" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["⭐ ", stars] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Отличная работа!" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "secondary-action",
					onClick: () => {
						setSceneIndex(0);
						setStars(0);
						setCompleted({});
						setChildName("");
						resetSceneState();
					},
					children: "Пройти урок ещё раз"
				})
			] });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "game-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-mark",
							children: "EA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "English Adventure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "LESSON 1–1" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "header-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: scene.chapter }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "top-progress",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${progress}%` } })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								sceneIndex + 1,
								" / ",
								scenes.length
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "star-counter",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⭐" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stars })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `stage setting-${scene.setting} scene-${scene.id}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `stage-visual visual-${visualKind}`,
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "scene-backdrop",
							src: sceneImage,
							alt: ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cinematic-shade" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCast, {
							sceneId: scene.id,
							speaking: speakingCharacter,
							sceneDone: done,
							substep,
							actionIndex
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "floating-light light-one" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "floating-light light-two" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "visual-caption",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sceneIndex === 0 ? "Утро начинается с улыбки" : sceneIndex < 7 ? "Добро пожаловать на урок" : "Учимся, играя вместе" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: scene.chapter })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `scene-card ${scene.id === "arrival" ? "arrival-stage-card" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "scene-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["СЦЕНА ", String(sceneIndex + 1).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: scene.title })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "scene-content",
							children: renderScene()
						}),
						feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `feedback ${done ? "success" : ""}`,
							children: [
								done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "success-stars",
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "★" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "★" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "★" })
									]
								}),
								done ? "⭐ " : "",
								feedback
							]
						})
					]
				})]
			}, scene.id),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "lesson-controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back-button",
						onClick: previousScene,
						disabled: sceneIndex === 0,
						children: "← Назад"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chapter-dots",
						"aria-label": "Этапы урока",
						children: scenes.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": `Сцена ${index + 1}: ${item.title}`,
							className: `${index === sceneIndex ? "active" : ""} ${completed[item.id] ? "done" : ""}`,
							onClick: () => {
								if (index <= sceneIndex || completed[item.id]) {
									setSceneIndex(index);
									resetSceneState();
								}
							}
						}, item.id))
					}),
					scene.id !== "final" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "next-button",
						onClick: nextScene,
						disabled: !done,
						children: "Следующая сцена →"
					})
				]
			})
		]
	});
}
//#endregion
export { Home as default };
