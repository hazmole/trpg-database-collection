export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/enemies.json'));

	const module = await import(`./item-list-controller.js`);
	const ctrl = new module.ItemListCtrl({
		itemContainerID: "DataContainer",
		items: dataList,
		parseFunc: CustomParser.enemy,
	});


	ctrl.enableSimpleSearch({
		elemID: "SearchGroup",
		elemID_input: "SearchInput",
		placeholder: "搜尋敵人的名稱...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;

			const l_keyword = keyword.toLowerCase();
			return (item.name?.toLowerCase().includes(l_keyword)) ||
				(item.alias?.some(n => n.toLowerCase().includes(l_keyword)))
		}
	});
	ctrl.enableAdvanceSearch({
		elemID: "AdvanceSearchBtn",
		elemID_btn: "AdvanceSearchBtn",
		elemID_overlay: "AdvanceSearchOverlay",
		options: [
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
			}
		]
	});

	// ctrl.setTitle("敵人");
	// ctrl.setDescription([
	// 	"這裡列出了官方規則書中記載的所有敵人數據。",
	// ]);

	// ctrl.enableSearching({
	// 	placeholder: "搜尋敵人的名稱...",
	// 	onChangeFunc: () => {
	// 		renderDataList();
	// 	}
	// });
	// ctrl.disableHeader();
	// ctrl.disableSorter();

	ctrl.display();
	// renderDataList();


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

