export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/enemies.json'));

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("敵人");
	ctrl.setDescription([
		"這裡列出了官方規則書中記載的所有敵人數據。",
	]);

	ctrl.enableSearching({
		placeholder: "搜尋敵人的名稱...",
		onChangeFunc: () => {
			renderDataList();
		}
	});
	ctrl.disableHeader();
	//ctrl.disableSorter();

	renderDataList();


	// ==============================

	function renderDataList() {
		const newList = dataList
			.filter(data => searchData(data, ctrl.searchCfg.keyword));
		ctrl.renderDataList(newList, CustomParser.enemy);
	}
	function searchData(data, keyword) {
		if (!keyword) return true;
		if (data.name.includes(keyword)) return true;
		return false;
	}

}

