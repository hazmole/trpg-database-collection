export async function run() {
	const dataList = await Fetcher.fetchJSON('./data/items-consumable.json');

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.disableHeader();
	ctrl.setTitle("消耗品");
	ctrl.setDescription([
		"透過靈力秘術或愚者黃金所製造出的靈藥、秘藥、一次性咒物和符咒、護符等人造神器，統稱為［消耗品］。",
		"若［消耗品］的［名稱］中記有「×n」，則每使用 1 次， n 的數值就會減少，且會在該數值變為 0 時消滅。",
		"若［消耗品］的［名稱］不存在「×n」標記，則只要使用一次之後就會立即消滅。"
	]);

	ctrl.enableSorter({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"用途", value: "usage" },
		],
		onChangeFunc: () => renderDataList(),
	});
	ctrl.enableSearching({
		placeholder: "搜尋消耗品的名稱、效果...",
		onChangeFunc: () => {
			renderDataList();
		}
	});

	renderDataList();

	//=======================
	function renderDataList() {
		const sortKey = ctrl.sortCfg.sortKey;
		const sortFunc = sortFuncFactory(sortKey, dataList);

		const newList = [...dataList]
			.filter(data => searchData(data, ctrl.searchCfg.keyword))
			.sort(sortFunc);
		ctrl.renderDataList(newList, CustomParser.item);
	}
	function searchData(data, keyword) {
		if (!keyword) return true;
		if (data.name.includes(keyword)) return true;
		if (data.effect.includes(keyword)) return true;
		return false;
	}

	function sortFuncFactory(sortKey, dataListRef) {
		// define Sorting Order
		const defaultUsageOrder = ["enchantment", "rest", "rest-meal", "rest-prepare", "rest-sleep", "other"];
		const defaultSortingOrder = ["cost", "usage"];
		const newSortingOrder = [];
		newSortingOrder.push(sortKey);
		defaultSortingOrder.forEach(o => {
			if (o != sortKey) newSortingOrder.push(o);
		});

		// define Reference Factory
		const refFactory = (item) => {
			return {
				name: item.name,
				cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
				usage: item.usage.map( u => defaultUsageOrder.indexOf(u) ).sort()[0],
			};
		};

		return function(a, b) {
			const aRef = refFactory(a);
			const bRef = refFactory(b);
			for(let i=0; i<newSortingOrder.length; i++) {
				const key = newSortingOrder[i];
				if (aRef[key] != bRef[key]) return (aRef[key] > bRef[key]? 1: -1);
			}
			return dataListRef.indexOf(a) - dataListRef.indexOf(b);
		}
	}
}

