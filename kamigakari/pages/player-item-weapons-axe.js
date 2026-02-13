export async function run() {
	const filterFunc = (item) => item.type.includes("斧");
	const normalDataList = (await Fetcher.fetchJSON('./data/items-weapon.json')).filter(filterFunc);
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(filterFunc);
	const upgradeDataList = (await Fetcher.fetchJSON('./data/items-weapon-upgrade.json')).filter(filterFunc);

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("肉搏武器／形狀：斧");
	ctrl.setDescription([
		"著重於破壞力的斧型人造神器。雖然稍微有些難以操作，但其足以彌補缺點的破壞力極具魅力。"
	]);

	const upgradeSortOps = [
		{ text:"價格", value: "cost" },
	];
	const weaponSortOpts = [
		{ text:"價格", value: "cost" },
		{ text:"命中", value: "hit" },
		{ text:"物Ｄ", value: "dmg" },
		{ text:"行動值", value: "speed" },
	];

	ctrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" },
			{ text: "追加效果", value: "upgrade" },
		],
		onChangeFunc: (tabID) => {
			setSorter(tabID);
			renderDataList();
		},
	});

	setSorter(ctrl.tabCfg.tabID);
	renderDataList();


	// ==============================
	function setSorter(tabID) {
		const optList = (tabID === "upgrade")? upgradeSortOps: weaponSortOpts;
		ctrl.enableSorter({
			options: optList,
			onChangeFunc: () => renderDataList(),
		});
	}
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
				hit: item.hit,
				dmg: Array.isArray(item.dmg)? item.dmg[0]: item.dmg,
				speed: Array.isArray(item.spd)? item.spd[0]: item.spd,
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

