const INDEX = [
	{ title: "首頁", pid: "home" },
	{ title: "規則單元", members: [
		{ title: "1. 創建角色", pid: "doc-core-rule-character-creation" },
		{ title: "2. 命運之輪", pid: "doc-core-rule-wheel-of-fate" },
		{ title: "3. 行為判定", pid: "doc-core-rule-dice-check" },
	]},
	{ title: "玩家資料庫", members: [
		{ title: "神群", members: [
		  { title: "希臘神群", pid: "data-deities-greek" },
		 	{ title: "大和神群", pid: "data-deities-yamato" },
		 	{ title: "埃及神群", pid: "data-deities-egypt" },
		 	{ title: "克蘇魯神群", pid: "data-deities-cthulhu" },
			{ title: "北歐神群", pid: "data-deities-norse" },
		 	{ title: "中華神群", pid: "data-deities-china" },
		 	{ title: "凱爾特神群", pid: "data-deities-celtic" },
		 	{ title: "印度神群", pid: "data-deities-india" },
		 	{ title: "中美洲神群", pid: "data-deities-mesoamerica" },
		]},
		{ title: "背景", pid: "data-background" },
		// { title: "泛用恩惠", pid: "data-common-boon" },
		// { title: "道具", pid: "data-item" },
	]},
];

const MAP = {
	"home": { title: "首頁", handler: "home" },

	"doc-core-rule-character-creation": {
		title: "創建角色", handler: 'docs', url: 'docs/core-doc-rule-character-creation.json' },
	"doc-core-rule-wheel-of-fate": {
		title: "命運之輪", handler: 'docs', url: 'docs/core-doc-rule-wheel-of-fate.json' },
	"doc-core-rule-dice-check": {
		title: "行為判定", handler: 'docs', url: 'docs/core-doc-rule-dice-check.json' },
	
	"data-deities-greek": {
		title: "希臘神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'greek' }},
	"data-deities-yamato": {
		title: "大和神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'yamato' }},
	"data-deities-egypt": {
		title: "埃及神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'egypt' }},
	"data-deities-cthulhu": {
		title: "克蘇魯神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'cthulhu' }},
	"data-deities-norse": {
		title: "北歐神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'norse' }},
	"data-deities-china": {
		title: "中華神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'china' }},
	"data-deities-celtic": {
		title: "凱爾特神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'celtic' }},
	"data-deities-india": {
		title: "印度神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'india' }},
	"data-deities-mesoamerica": {
		title: "中美洲神群", handler: 'custom', params: { layout: 'pages/player-deities.html', script: 'pages/player-deities.js', uid: 'mesoamerica' }},
		
	"data-background": {
		title: "背景", handler: 'data', script: 'pages/player-background.js' },
}

const Config = {
	Title: "神話創世",
	
	// for Navbar rendering
	NavbarIndex: INDEX,

	// for Page handling
	PageHandlerMap: MAP,
};
