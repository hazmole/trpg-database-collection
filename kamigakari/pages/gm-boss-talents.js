export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/talents-boss.json'));

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("BOSS 天賦");
	ctrl.setDescription([
		"這裡列出了荒御魂與［BOSS］能夠取得的《BOSS天賦》。",
	]);

	ctrl.enableSearching({
		placeholder: "搜尋天賦的名稱、效果...",
		onChangeFunc: () => {
			renderDataList();
		}
	});
	ctrl.disableHeader();
	ctrl.disableSorter();

	renderDataList();


	// ==============================

	function renderDataList() {
		const newList = dataList
			.filter(data => searchData(data, ctrl.searchCfg.keyword));
		ctrl.renderDataList(newList, CustomParser.talent);
	}
	function searchData(data, keyword) {
		if (!keyword) return true;
		if (data.name.includes(keyword)) return true;
		const effectText = (Array.isArray(data.effect))? data.effect.join(''): data.effect;
		if (effectText.includes(keyword)) return true;
		return false;
	}

}

