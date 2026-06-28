export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/talents-boss.json'));
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

	pageCtrl.setTitle("BOSS 天賦");
	pageCtrl.setDescription([
		"這裡列出了荒御魂與［BOSS］能夠取得的《BOSS天賦》。",
	]);
	pageCtrl.disableHeader();

	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋天賦的名稱、效果...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			const effectText = (Array.isArray(item.effect))? item.effect.join(''): item.effect;
			if (effectText.includes(keyword)) return true;
			return false;
		}
	});

	pageCtrl.setItems(dataList);
	pageCtrl.setParseFunc(CustomParser.talent);
	pageCtrl.displayItemList();

}

