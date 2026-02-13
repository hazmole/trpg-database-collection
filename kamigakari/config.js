const INDEX = [
	{ title: "首頁", pid: "home" },
	{ title: "核心規則書", members: [
		//{ title: "Ⅰ. 世界章節", members: [] },
		//{ title: "Ⅱ. 玩家章節", members: [] },
		{ title: "Ⅲ. 規則章節", members: [
			// { title: "判定", pid: "doc-core-gamerule-check" },
			{ title: "狀態變化", pid: "doc-core-gamerule-conditions" },
		] },
		{ title: "Ⅳ. GM章節", members: [
			{ title: "遊戲主持人", pid: "doc-core-gm-about" },
			{ title: "創建 NPC", pid: "doc-core-gm-npc-creation" },
			//{ title: "BOSS天賦一覽", pid: "doc-core-gm-boss-talents" },
			{ title: "創作劇本", pid: "doc-core-gm-scenario-writing" },
			//{ title: "關於法則障礙", pid: "doc-core-gm-anomalies-detail" },
			//{ title: "法則障礙一覽", pid: "doc-core-gm-anomalies-list" },
			//{ title: "關於素材", pid: "doc-core-gm-materials" },
			{ title: "關於精怪", pid: "doc-core-gm-about-mononoke" },
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
	{ title: "玩家資料庫", members: [
		{ title: "種族", pid: "data-ancestries" },
		{ title: "稱號", pid: "data-arm-systems" },
		{ title: "共通天賦", pid: "data-common-talents" },
		{ title: "道具", members: [
			{ title: "武器", members: [
				{ title: "形狀：劍", pid: "data-item-weapons-sword" },
				{ title: "形狀：槍", pid: "data-item-weapons-lance" },
				{ title: "形狀：斧", pid: "data-item-weapons-axe" },
				{ title: "形狀：錘", pid: "data-item-weapons-hammer" },
				{ title: "形狀：射擊", pid: "data-item-weapons-projectile" },
				{ title: "形狀：魔法", pid: "data-item-weapons-magic" },
			] },
			{ title: "防具", members: [
				{ title: "鎧", pid: "data-item-protectors-armor" },
				{ title: "盾", pid: "data-item-protectors-shield" },
			] },
			{ title: "裝飾", pid: "data-item-accessories" },
			{ title: "消耗品", pid: "data-item-consumables" },
			{ title: "常備品", pid: "data-item-sacraments" },
			{ title: "探索者套裝", pid: "data-item-hunter-sets" },
			{ title: "神器能力", pid: "data-item-legacy-feats" },
		] },
		{ title: "表職業", pid: "data-facades" },
		//{ title: "精怪", url: "" },
		//{ title: "BOSS天賦", url: "" },
		//{ title: "法則障礙", url: "" },
	] },
	//{ title: "GM 資料庫", members: [
	//	{ title: "BOSS天賦", pid: "data-boss-talents" },
	//] }
];

const MAP = {
	"home": { title: "首頁", handler: "home" },

	"data-ancestries": {
		title: "種族一覽", handler: 'custom', params: {
			layout: 'pages/player-ancestries.html',
			script: 'pages/player-ancestries.js',
		}},

	"data-arm-systems": {
		title: "稱號一覽", handler: 'custom', params: {
			layout: 'pages/player-arm-systems.html',
			script: 'pages/player-arm-systems.js',
		}},

	"data-common-talents": {
		title: "共通天賦一覽", handler: 'custom', params: {
			layout: 'pages/player-common-talents.html',
			script: 'pages/player-common-talents.js',
		}},

	"data-item-weapons-sword": {
		title: "武器／劍", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-sword.js',
		}},

	"data-item-weapons-lance": {
		title: "武器／槍", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-lance.js',
		}},

	"data-item-weapons-axe": {
		title: "武器／斧", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-axe.js',
		}},

	"data-item-weapons-hammer": {
		title: "武器／錘", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-hammer.js',
		}},

	"data-item-weapons-projectile": {
		title: "武器／射擊", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-projectile.js',
		}},

	"data-item-weapons-magic": {
		title: "武器／魔法", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-weapons-magic.js',
		}},

	"data-item-protectors-armor": {
		title: "防具／鎧", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-protector-armor.js',
		}},

	"data-item-protectors-shield": {
		title: "防具／盾", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-protector-shield.js',
		}},

	"data-item-accessories": {
		title: "裝飾", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-accessories.js',
		}},

	"data-item-consumables": {
		title: "消耗品", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-consumables.js',
		}},

	"data-item-sacraments": {
		title: "常備品", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-sacraments.js',
		}},

	"data-item-hunter-sets": {
		title: "探索者套裝", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-hunter-sets.js',
		}},

	"data-item-legacy-feats": {
		title: "神器能力", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-item-legacy-feats.js',
		}},

	"data-facades": {
		title: "表職業", handler: 'custom', params: {
			layout: 'pages/player-item-template.html',
			script: 'pages/player-facades.js',
		}},

	// 規則文件
	"doc-core-gamerule-conditions": {
		title: "狀態變化", handler: 'docs', url: 'docs/core-doc-conditions.json' },

	"doc-core-gm-about": {
		title: "遊戲主持人", handler: 'docs', url: 'docs/core-doc-gm.json' },
	
	"doc-core-gm-npc-creation": {
		title: "創建 NPC", handler: 'docs', url: 'docs/core-doc-gm-npc-creation.json' },

	"doc-core-gm-scenario-writing": {
		title: "關於劇本創作", handler: 'docs', url: 'docs/core-doc-gm-scenario-writing.json' },

	"doc-core-gm-about-mononoke": {
		title: "關於精怪", handler: 'docs', url: 'docs/core-doc-gm-about-mononoke.json', depth: 3 },

	// 擴充:神魂的鎮魂曲 Spirit Requiem
	"docs-exSpiritRequiem-makyou-conquer": {
		title: "魔境討伐", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-makyou-conquer.json' },
	
	"docs-exSpiritRequiem-contract-beast": {
		title: "契約神獸", handler: 'docs', url: 'docs/ex-spiritrequiem-doc-contrac-beast.json', depth: 3 },

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
