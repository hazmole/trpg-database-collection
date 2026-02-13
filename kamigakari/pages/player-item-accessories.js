export async function run() {
	const normalDataList = await Fetcher.fetchJSON('./data/items-accessory.json');
	const relicDataList = (await Fetcher.fetchJSON('./data/items-legacy.json')).filter(item => {
		return item.type.includes("裝飾");
	});

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("裝飾");
	ctrl.setDescription([
			"除了［武器、防具］以外，其他賦予了靈力的武裝，統稱為［裝飾］。",
			"對於以強大邪神為對手的超常存在們而言，［裝飾］類型的［道具］同樣是不可或缺的。",
			"要注意的是，同一個角色不能重複［裝備］相同［部位］的［裝飾］。"
	]);

	ctrl.enableTabs({
		options: [
			{ text: "人造神器", value: "normal" },
			{ text: "神成神器", value: "legacy" }
		],
		onChangeFunc: () => renderDataList(),
	});
	ctrl.enableSorter({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"部位", value: "equip" },
		],
		onChangeFunc: () => renderDataList(),
	});

	renderDataList()


	// ==============================
	function renderDataList() {
		const sortKey = ctrl.sortCfg.sortKey;
		const tabID   = ctrl.tabCfg.tabID;
		const dataList = (tabID === "normal")? normalDataList: relicDataList;
		const sortFunc = sortFuncFactory(sortKey, dataList);

		const newList = [...dataList].sort(sortFunc);
		ctrl.renderDataList(newList, CustomParser.item);
	}
	function sortFuncFactory(sortKey, dataListRef) {
		// define Sorting Order
		const defaultEquipOrder = ["head", "hand", "back", "waist", "feet"];
		const defaultSortingOrder = ["cost", "equip"];
		const newSortingOrder = [];
		newSortingOrder.push(sortKey);
		defaultSortingOrder.forEach(o => {
			if (o != sortKey) newSortingOrder.push(o);
		});

		// define Reference Factory
		const refFactory = (item) => {
			return {
				cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
				equip: (Array.isArray(item.equip)? item.equip: [item.equip])
					.map( u => defaultEquipOrder.indexOf(u) )[0],
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
	/*

	//=======================

	function initTabs() {
		// hide unnecessary Tabs
		document.getElementById("Tab-upgrade").style.display = "none";
		// add listener
		const containerElem = document.getElementById('ContextHeader');
		tabList.forEach((t) => {
			const tabElem = document.getElementById(`Tab-${t}`);
			tabElem.addEventListener('click', () => {
				containerElem.querySelectorAll('.TabItem').forEach(elem => {
					elem.classList.remove('active');
				});
				tabElem.classList.add('active'); 
				CoreRouter.setUrlParams('tab', t);
				renderPage(t)
			});
			if (t === tabID) {
				tabElem.classList.add('active');
			}
		});
	}
	function initSorter() {
		// Get DOM Element
		const sorterElem = document.getElementById('SortingSelect');
		const sortKey = [
			{ text:"價格", value: "cost" },
			{ text:"部位", value: "equip" },
		];
		sorterElem.innerHTML = sortKey.map( key => {
			return `<option value="${key.value}-asc"><span class="label">${key.text}</span></option>`;
		}).join('');
		sorterElem.value = 'cost-asc';
		sorterElem.addEventListener('change', (e) => {
			const tabID = getUrlTabID();
			const newSortKey = e.target.value;
			renderDatas(tabID, newSortKey);
		});
	}
	function renderPage(tabID) {
		document.getElementById("Name").textContent = `裝飾`;
		document.getElementById("Description").innerHTML = [
			"除了［武器、防具］以外，其他賦予了靈力的武裝，統稱為［裝飾］。",
			"對於以強大邪神為對手的超常存在們而言，［裝飾］類型的［道具］同樣是不可或缺的。",
			"要注意的是，同一個角色不能重複［裝備］相同［部位］的［裝飾］。"
		].join('<br>');

		const sortKey = getSortKey();
		renderDatas(tabID, sortKey);
	}
	function renderDatas(tabID, sortKey) {
		document.getElementById("DatasContainer").innerHTML = _renderDatas(tabID, sortKey);
	}
	//=======================
	function _renderDatas(tabID, sortKey) {
		const dataList = (tabID === "normal")? normalDataList: relicDataList;
		return _sorting(dataList, sortKey).map( data => CustomParser.item(data) ).join('');
	}
	function _sorting(dataList, sortKeyTicket) {
		const parts = sortKeyTicket.split('-');
		const sortPrimaryKey = parts[0];

		// define Sorting Order
		const defaultEquipOrder = ["head", "hand", "back", "waist", "feet"];
		const defaultSortingOrder = ["cost", "equip"];
		const newSortingOrder = [];
		newSortingOrder.push(sortPrimaryKey);
		defaultSortingOrder.forEach(o => {
			if (o != sortPrimaryKey) newSortingOrder.push(o);
		});
		
		// define Reference Factory
		const refFactory = (item) => {
			return {
				cost:  item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
				equip: (Array.isArray(item.equip)? item.equip: [item.equip])
					.map( u => defaultEquipOrder.indexOf(u) )[0],
			};
		};

		return [...dataList].sort(SorterUtils.compareCustom(dataList, refFactory, newSortingOrder));
	}
	*/
}

