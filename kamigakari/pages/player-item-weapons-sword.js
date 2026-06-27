export async function run() {
	const filterFunc = (item) => item.type.includes("劍");
	const normalDataList = (await Fetcher.fetchJSON('./data/items-weapon.json')).filter(filterFunc);
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(filterFunc);
	const upgradeDataList = (await Fetcher.fetchJSON('./data/items-weapon-upgrade.json')).filter(filterFunc);

	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

	pageCtrl.setTitle("肉搏武器／形狀：劍");
	pageCtrl.setDescription([
		"最正統的白刃戰專用人造神器。透過讓靈力滲透進刀身，能將任何物體連同其概念一同斬斷。"
	]);
	pageCtrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" },
			{ text: "追加效果", value: "upgrade" },
		],
		onChangeFunc: () => renderDataList(),
	});

	pageCtrl.enableSort({
		options: getSortOpts(),
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋武器的名稱、效果...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			if (item.effect.includes(keyword)) return true;
			return false;
		}
	});

	pageCtrl.setParseFunc(CustomParser.item);
	renderDataList();


	// ==============================
	function getDataList() {
		const tabID = pageCtrl.tabCfg.tabID;
		return (tabID === "normal")? normalDataList: 
					 (tabID === "legacy")? relicDataList: upgradeDataList;
	}
	function getSortOpts() {
		const tabID = pageCtrl.tabCfg.tabID;
		return (tabID !== "upgrade")? 
		[
			{ text:"價格", value: "cost" },
			{ text:"命中", value: "hit" },
			{ text:"物Ｄ", value: "dmg" },
			{ text:"行動值", value: "speed" },
		]:
		[
			{ text:"價格", value: "cost" },
		];
	}

	function renderDataList() {
		const dataList = getDataList();
		pageCtrl.reassignSort({
			options: getSortOpts()
		});
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
			hit: item.hit,
			dmg: Array.isArray(item.dmg)? item.dmg[0]: item.dmg,
			speed: Array.isArray(item.spd)? item.spd[0]: item.spd,
			index: dataList.indexOf(item)
		};
	}
}

