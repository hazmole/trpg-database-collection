export async function run( pageCtrl ) {
	const dataList = await Fetcher.fetchJSON('./data/items-sacrament.json');

	pageCtrl.disableHeader();
	pageCtrl.setTitle("常備品");
	pageCtrl.setDescription([
		"能在超常存在們的日常生活或［戰鬥外］場景中發揮作用的［道具］，統稱為［常備品］。",
		"雖然在戰鬥中無法發揮作用，但在追查與超常存在相關的事件時，仍然是不可或缺的。"
	]);

	pageCtrl.enableSort({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"用途", value: "usage" },
		],
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋常備品的名稱、效果...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			if (item.effect.includes(keyword)) return true;
			return false;
		}
	});

	pageCtrl.setItems(dataList);
	pageCtrl.setParseFunc(CustomParser.item);
	pageCtrl.displayItemList();

	// ==============================

	function sortCmpFunc(a, b, sortKey) {
		const defaultSortingOrder = ["cost", "usage", "index"];
		const newSortingOrder = [sortKey];
		defaultSortingOrder.forEach(o => {
			if (o != sortKey) newSortingOrder.push(o);
		});

		const aRef = toItemRef(a);
		const bRef = toItemRef(b);
		for(let i=0; i<newSortingOrder.length; i++) {
			const key = newSortingOrder[i];
			if (aRef[key] != bRef[key]) return (aRef[key] > bRef[key]? 1: -1);
		}
	}

	function toItemRef(item) {
		const usageOrder = ["enchantment", "rest", "rest-meal", "rest-prepare", "rest-sleep", "other"];
		return {
			cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
			usage: item.usage.map( u => usageOrder.indexOf(u) ).sort()[0],
			index: dataList.indexOf(item)
		};
	}
}

