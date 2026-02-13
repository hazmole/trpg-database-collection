export async function run() {
	const dataList = await Fetcher.fetchJSON('./data/items-sacrament.json');

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.disableHeader();
	ctrl.setTitle("常備品");
	ctrl.setDescription([
		"能在超常存在們的日常生活或［戰鬥外］場景中發揮作用的［道具］，統稱為［常備品］。",
		"雖然在戰鬥中無法發揮作用，但在追查與超常存在相關的事件時，仍然是不可或缺的。"
	]);

	ctrl.enableSorter({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"用途", value: "usage" },
		],
		onChangeFunc: () => renderDataList(),
	});
	ctrl.enableSearching({
		placeholder: "搜尋常備品的名稱、效果...",
		onChangeFunc: () => {
			renderDataList();
		}
	});

	renderDataList();

	// ==============================
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

