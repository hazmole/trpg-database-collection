export async function run() {
	const normalDataList = await Fetcher.fetchJSON('./data/items-accessory.json');
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(item => {
		return item.type.includes("裝飾");
	});
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

	pageCtrl.setTitle("裝飾");
	pageCtrl.setDescription([
			"除了［武器、防具］以外，其他賦予了靈力的武裝，統稱為［裝飾］。",
			"對於以強大邪神為對手的超常存在們而言，［裝飾］類型的［道具］同樣是不可或缺的。",
			"要注意的是，同一個角色不能重複［裝備］相同［部位］的［裝飾］。"
	]);
	pageCtrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" }
		],
		onChangeFunc: () => renderDataList(),
	});

	pageCtrl.enableSort({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"部位", value: "equip" },
		],
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋裝飾的名稱、效果...",
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
		const defaultSortingOrder = ["cost", "equip", "index"];
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
		const equipOrder = ["head", "hand", "back", "waist", "feet"];
		const dataList = getDataList();
		return {
			cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
			equip: (Array.isArray(item.equip)? item.equip: [item.equip])
				.map( u => equipOrder.indexOf(u) )[0],
			index: dataList.indexOf(item)
		};
	}
}

