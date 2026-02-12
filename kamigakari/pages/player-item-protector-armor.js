export async function run() {
	const filterFunc = (item) => item.type.includes("鎧");
	const normalDataList = (await Fetcher.fetchJSON('./data/items-protector.json')).filter(filterFunc);
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(filterFunc);

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("防具／鎧");
	ctrl.setDescription([
			"..."
	]);

	ctrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" },
		],
		onChangeFunc: () => renderDataList(),
	});
	ctrl.enableSorter({
		options: [
			{ text:"價格", value: "cost" },
		],
		onChangeFunc: () => renderDataList(),
	});

	renderDataList()


	// ==============================
	function renderDataList() {
		const sortKey = ctrl.sortCfg.sortKey;
		const tabID   = ctrl.tabCfg.tabID;
		const dataList = 
			(tabID === "normal")? normalDataList: 
			(tabID === "legacy")? relicDataList: upgradeDataList;
		const sortFunc = sortFuncFactory(sortKey, dataList);

		const newList = [...dataList].sort(sortFunc);
		ctrl.renderDataList(newList);
	}
	function sortFuncFactory(sortKey, dataListRef) {
		// define Sorting Order
		const defaultSortingOrder = ["cost"];
		const newSortingOrder = [];
		newSortingOrder.push(sortKey);
		defaultSortingOrder.forEach(o => {
			if (o != sortKey) newSortingOrder.push(o);
		});

		// define Reference Factory
		const refFactory = (item) => {
			return {
				cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
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

