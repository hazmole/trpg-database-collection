export async function run() {
	const filterFunc = (item) => item.type.includes("盾");
	const normalDataList = (await Fetcher.fetchJSON('./data/items-protector.json')).filter(filterFunc);
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(filterFunc);

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("防具／盾");
	ctrl.setDescription([
		"守護身體的［形狀：盾］的人造神器。",
		"從使用皮革打底並釘上板金的木製圓盾，強化過後的金屬板，到覆蓋整隻手臂的護手型等，造型各式各樣。",
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
			{ text:"迴避", value: "evade" },
			{ text:"行動值", value: "speed" },
			{ text:"裝甲", value: "phydef" },
			{ text:"結界", value: "mgcdef" },
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
		ctrl.renderDataList(newList, CustomParser.item);
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
				evade: item.evd,
				speed: item.spd,
				phydef: item.phyArmor,
				mgcdef: item.mgcArmor,
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

