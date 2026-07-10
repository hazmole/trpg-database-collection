export async function run( pageCtrl ) {
	const dataList = await Fetcher.fetchJSON('./data/items-consumable.json');

	pageCtrl.disableHeader();
	pageCtrl.setTitle("消耗品");
	pageCtrl.setDescription([
		"透過靈力秘術或愚者黃金所製造出的靈藥、秘藥、一次性咒物和符咒、護符等人造神器，統稱為［消耗品］。",
		"若［消耗品］的［名稱］中記有「×n」，則每使用 1 次， n 的數值就會減少，且會在該數值變為 0 時消滅。",
		"若［消耗品］的［名稱］不存在「×n」標記，則只要使用一次之後就會立即消滅。"
	]);

	pageCtrl.enableSort({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"用途", value: "usage" },
		],
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋消耗品的名稱、效果...",
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

	//=======================

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

