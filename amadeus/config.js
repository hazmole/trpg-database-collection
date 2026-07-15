const INDEX = [
	{ title: "首頁", pid: "home" },
	{ title: "規則單元", members: [
		{ title: "創建角色", pid: "doc-core-rule-character-creation" },
	]},
	{ title: "玩家資料庫", members: [
		{ title: "神群", members: [
			{ title: "希臘神群", pid: "data-deities-greek" },
			{ title: "大和神群", pid: "data-deities-japan" },
			{ title: "埃及神群", pid: "data-deities-egypt" },
			{ title: "克蘇魯神群", pid: "data-deities-cthulhu" },
			{ title: "北歐神群", pid: "data-deities-nordic" },
			{ title: "泰坦神群", pid: "data-deities-titan" },
			{ title: "中華神群", pid: "data-deities-china" },
			{ title: "凱爾特神群", pid: "data-deities-celtic" },
			{ title: "印度神群", pid: "data-deities-india" },
			{ title: "中美洲神群", pid: "data-deities-america" },
		]},
		{ title: "背景", pid: "data-background" },
		{ title: "泛用恩惠", pid: "data-common-boon" },
		{ title: "道具", pid: "data-item" },
	]},
];

const MAP = {
	"home": { title: "首頁", handler: "home" },

	"doc-core-rule-character-creation": {
		title: "創建角色", handler: 'docs', url: 'docs/core-doc-rule-character-creation.json' },

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
