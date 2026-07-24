const INDEX = [
	{ title: "首頁", pid: "home" },
	{ title: "規則單元", members: [
		{ title: "前言", pid: "doc-core-rule-preface" },
		{ title: "創建角色", pid: "doc-core-rule-character-creation" },
		{ title: "命運之輪", pid: "doc-core-rule-wheel-of-fate" },
		{ title: "行為判定", pid: "doc-core-rule-dice-check" },
		{ title: "劇次", pid: "doc-core-rule-session" },
		{ title: "導入階段", pid: "doc-core-rule-introduction-phase" },
		{ title: "冒險階段", pid: "doc-core-rule-adventure-phase" },
		{ title: "主要行動", pid: "doc-core-rule-main-action" },
		{ title: "自由行動", pid: "doc-core-rule-free-action" },
		{ title: "主控場景", pid: "doc-core-rule-master-scene" },
		{ title: "戰鬥", pid: "doc-core-rule-combat" },
		{ title: "決戰階段", pid: "doc-core-rule-showdown-phase" },
		{ title: "結束階段", pid: "doc-core-rule-ending-phase" },
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
		{ title: "背景", members: [
			{ title: "創世之子", pid: "data-background-genesis" },
			{ title: "災厄之子", pid: "data-background-calamity" },
			{ title: "引導之子", pid: "data-background-oracle" },
			{ title: "獸之子", pid: "data-background-beastborn" },
			{ title: "傳說之子", pid: "data-background-legend" },
			{ title: "機械之子", pid: "data-background-machine" },
			{ title: "忘卻之子", pid: "data-background-lost" },
			{ title: "替換之子", pid: "data-background-changeling" },
			{ title: "喪失之子", pid: "data-background-orphan" },
			{ title: "化身", pid: "data-background-avatar" },
		]},
		// { title: "泛用恩惠", pid: "data-common-boon" },
		// { title: "道具", pid: "data-item" },
	]},
];

const MAP = {
	"home": { title: "首頁", handler: "home" },

	"doc-core-rule-preface": {
		title: "前言", handler: 'docs', url: "docs/core-doc-rule-preface.json" },
	"doc-core-rule-character-creation": {
		title: "創建角色", handler: 'docs', url: 'docs/core-doc-rule-character-creation.json' },
	"doc-core-rule-wheel-of-fate": {
		title: "命運之輪", handler: 'docs', url: 'docs/core-doc-rule-wheel-of-fate.json' },
	"doc-core-rule-dice-check": {
		title: "行為判定", handler: 'docs', url: 'docs/core-doc-rule-dice-check.json' },

	/* 資料:神群 */
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
	
	/* 資料:背景 */
	"data-background-genesis":    { title: "背景 - 創世之子", params: { uid: '創世之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-calamity":   { title: "背景 - 災厄之子", params: { uid: '災厄之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-oracle":     { title: "背景 - 引導之子", params: { uid: '引導之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-beastborn":  { title: "背景 - 獸之子",   params: { uid: '獸之子' },   handler: 'data', script: 'pages/player-background.js' },
	"data-background-legend":     { title: "背景 - 傳說之子", params: { uid: '傳說之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-machine":    { title: "背景 - 機械之子", params: { uid: '機械之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-lost":       { title: "背景 - 忘卻之子", params: { uid: '忘卻之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-changeling": { title: "背景 - 替換之子", params: { uid: '替換之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-orphan":     { title: "背景 - 喪失之子", params: { uid: '喪失之子' }, handler: 'data', script: 'pages/player-background.js' },
	"data-background-avatar":     { title: "背景 - 化身",     params: { uid: '化身' },     handler: 'data', script: 'pages/player-background.js' },

}

const Config = {
	Title: "神話創世",
	
	// for Navbar rendering
	NavbarIndex: INDEX,

	// for Page handling
	PageHandlerMap: MAP,
};
