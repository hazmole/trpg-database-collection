const INDEX = [
	{ title: "首頁", pid: "home" },
	{ title: "核心規則書", members: [
		{ title: "Ⅲ. 規則章節", members: [
			// { title: "判定", pid: "doc-core-gamerule-check" },
			{ title: "狀態變化", pid: "doc-core-gamerule-conditions" },
		] },
		{ title: "Ⅳ. GM章節", members: [
			{ title: "遊戲主持人", pid: "doc-core-gm-about" },
			{ title: "創建 NPC", pid: "doc-core-gm-npc-creation" },
			//{ title: "BOSS天賦一覽", pid: "doc-core-gm-boss-talents" },
			//{ title: "劇本創作", pid: "doc-core-gm-scenario-creation" },
			//{ title: "關於法則障礙", pid: "doc-core-gm-anomalies-detail" },
			//{ title: "法則障礙一覽", pid: "doc-core-gm-anomalies-list" },
			//{ title: "關於素材", pid: "doc-core-gm-materials" },
			//{ title: "關於精怪", pid: "doc-core-gm-mononoke" },
		] },
	] },
	{ title: "擴充書", members: [
			{ title: "擴充《神魂的鎮魂曲》", style:"font-size:.9em;", members: [
			// { title: "魔境討伐", 						pid: "docs-exSpiritRequiem-makyou-conquer" },
			{ title: "契約神獸", 						pid: "docs-exSpiritRequiem-contract-beast" },
			{ title: "奇御魂的追加用途", 		 pid: "docs-exSpiritRequiem-kushimitama" },
			{ title: "《複合技》的補充說明", pid: "docs-exSpiritRequiem-combine-technic" },
		] },
	] },
	{ title: "資料庫", members: [
		{ title: "種族", pid: "data-races" },
		{ title: "稱號", pid: "data-classes" },
		//{ title: "表職業", url: "" },
		//{ title: "共通天賦", url: "" },
		//{ title: "道具", url: "" },
		//{ title: "精怪", url: "" },
		//{ title: "BOSS天賦", url: "" },
		//{ title: "法則障礙", url: "" },
	] },
];

const MAP = {
	"home": { title: "首頁", handler: "home" },

	"data-races": {
		title: "種族一覽", handler: 'custom', params: {
			layout: 'pages/player-races.html',
			script: 'pages/player-races.js',
		}},

	"data-classes": {
		title: "稱號一覽", handler: 'custom', params: {
			layout: 'pages/player-classes.html',
			script: 'pages/player-classes.js',
		}},

	"doc-core-gamerule-conditions": {
		title: "狀態變化", handler: 'docs', url: 'docs/core-doc-conditions.json' },

	"doc-core-gm-about": {
		title: "遊戲主持人", handler: 'docs', url: 'docs/core-doc-gm.json' },
	
	"doc-core-gm-npc-creation": {
		title: "創建 NPC", handler: 'docs', url: 'docs/core-doc-gm-npc-creation.json' },


	// 擴充:神魂的鎮魂曲 Spirit Requiem
	"docs-exSpiritRequiem-makyou-conquer": {
		title: "魔境討伐", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-makyou-conquer.json' },
	
	"docs-exSpiritRequiem-contract-beast": {
		title: "契約神獸", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-contrac-beast.json' },

	"docs-exSpiritRequiem-kushimitama": {
		title: "奇御魂的追加用途", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-kushimitama.json' },

	"docs-exSpiritRequiem-combine-technic": {
		title: "《複合技》的補充說明", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-combine-technic.json' },
}

const Config = {
	Title: "神我狩",
	
	// for Navbar rendering
	NavbarIndex: INDEX,

	// for Page handling
	PageHandlerMap: MAP,
};
