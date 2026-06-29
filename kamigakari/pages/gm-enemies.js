export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/enemies.json'));
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

	dataList.sort(SorterUtils.compareEnemy(dataList));

	pageCtrl.setTitle("敵人一覽");
	pageCtrl.setDescription([
		"這裡列出了官方規則和擴充中記載的敵人數據。",
	]);

	pageCtrl.setItems(dataList);
	pageCtrl.setParseFunc(CustomParser.enemy);
	pageCtrl.disableHeader();

	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋敵人的名稱...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			if (item.alias?.some(n => n.includes(keyword))) return true;
		}
	});
	pageCtrl.enableAdvanceSearch({
		options: [
			{
				title: "等級",
				type: "range",
				max: 20,
				min: 1,
				matchFunc: (item, filterVals) => {
					return filterVals.min <= item.level && filterVals.max >= item.level;
				}
			},
			{
				title: '種類',
				type: 'selection',
				list: [
					{ text: '人型', value: 'humanoid' },
					{ text: '魔獸', value: 'beast' },
					{ text: '怪蟲', value: 'insect' },
					{ text: '植物', value: 'plant' },
					{ text: '機械', value: 'machine' },
					{ text: '不死', value: 'undead' },
					{ text: '幻獸', value: 'eudemon' },
					{ text: '混沌', value: 'demon' },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.includes(item.type);
				}
			},
			{
				title: '智能',
				type: 'selection',
				list: [
					{ text: '低下', value: 'low' },
					{ text: '普通', value: 'nrm' },
					{ text: '高',   value: 'hgh' },
					{ text: '狡猾', value: 'cun' },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.includes(item.info.iq);
				}
			},
			{
				title: '感官',
				type: 'selection',
				list: [
					{ text: "普通", value: "nrm" },
					{ text: "熱", value: "hea" },
					{ text: "魔力", value: "mgc" },
					{ text: "領域", value: "fld" },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.includes(item.info.sense);
				}
			},
			{
				title: '反應',
				type: 'selection',
				list: [
					{ text: "敵對", value: "hos" },
					{ text: "中立", value: "neu" },
					{ text: "友好", value: "frn" },
					{ text: "各種", value: "any" },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.includes(item.info.react);
				}
			},
			{
				title: '弱點',
				type: 'selection',
				list: [
  				{ text: "火炎", value: "fir" },
  				{ text: "寒氣", value: "cld" },
  				{ text: "電擊", value: "ele" },
  				{ text: "磁力", value: "mag" },
  				{ text: "風壓", value: "wnd" },
  				{ text: "閃光", value: "fls" },
  				{ text: "魔毒", value: "poi" },
  				{ text: "幻覺", value: "ill" },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.some( val => item.info.weakness.includes(val));
				}
			},
			{
				title: '其他',
				type: 'selection',
				list: [
					{ text: "×n 精怪", value: "xn" },
				],
				matchFunc: (item, filterVals) => {
					if (filterVals.includes("xn")) {
						return item.isGroup;
					}
					return true;
				}
			},
			{
				title: '資料來源',
				type: 'selection',
				list: [
					{ text: "基本規則", value: "basic" },
    			{ text: "神魂的鎮魂曲", value: "ex-神魂" },
    			{ text: "達摩克利斯的機神", value: "ex-機神" },
    			{ text: "克羅諾斯的原初神器", value: "ex-原初" },
    			{ text: "焦灼少女的熾火", value: "ex-熾火" },
    			// { text: "四神守護者", value: "ex-四神" },
    			// { text: "與混沌神話的接觸", value: "ex-混沌" },
    			// { text: "時空異變", value: "ex-時空" },
    			// { text: "神魔亂鬥", value: "ex-神魔" },
    			// { text: "神怪夜行", value: "ex-神怪" },
    			// { text: "神機流亡", value: "ex-神機" },
    			// { text: "超神進化", value: "ex-超神" },
				],
				matchFunc: (item, filterVals) => {
					return filterVals.includes(item.source);
				}
			}
		]
	});


	pageCtrl.displayItemList();
}

