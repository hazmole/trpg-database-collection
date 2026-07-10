export async function run( pageCtrl ) {
	const filterFunc = (item) => item.type.includes("盾");
	const normalDataList = (await Fetcher.fetchJSON('./data/items-protector.json')).filter(filterFunc);
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(filterFunc);

	pageCtrl.setTitle("防具／盾");
	pageCtrl.setDescription([
		"守護身體的［形狀：盾］的人造神器。",
		"從使用皮革打底並釘上板金的木製圓盾，強化過後的金屬板，到覆蓋整隻手臂的護手型等，造型各式各樣。",
	]);

	pageCtrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" },
		],
		onChangeFunc: () => renderDataList(),
	});
	
	pageCtrl.enableSort({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"迴避", value: "evade" },
			{ text:"行動值", value: "speed" },
			{ text:"裝甲", value: "phydef" },
			{ text:"結界", value: "mgcdef" },
		],
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋防具的名稱、效果...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			if (item.effect.includes(keyword)) return true;
			return false;
		}
	});
	
	pageCtrl.setParseFunc(CustomParser.item);
	renderDataList()


	// ==============================
	function getDataList() {
		const tabID = pageCtrl.tabCfg.tabID;
		return (tabID === "normal")? normalDataList: relicDataList;
	}

	function renderDataList() {
		const dataList = getDataList();
		pageCtrl.setItems(dataList);
		pageCtrl.displayItemList();
	}

	function sortCmpFunc(a, b, sortKey) {
		const defaultSortingOrder = ["cost", "index"];
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
		const dataList = getDataList();
		return {
			cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
			evade: item.evd,
			speed: item.spd,
			phydef: item.phyArmor,
			mgcdef: item.mgcArmor,
			index: dataList.indexOf(item)
		};
	}
}

