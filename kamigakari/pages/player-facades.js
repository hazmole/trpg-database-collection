export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/facades.json'));

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("表職業");
	ctrl.setDescription([
		"［表職業］代表著角色在現代生活中所使用的立場或職業。",
		"在初次角色創建階段時，需要從中決定一個［表職業］。",
		"帶有 <span style='font-family:cursive'>□</span> 標誌的表職業，表示其適合初次接觸本系統的玩家遊玩。",
		"帶有 <span style='font-family:cursive'>△</span> 標誌的表職業，表示其需要GM的許可才能選取。",
	]);

	const options = [
		{ text: "表職業①／一般", value: "1" },
		{ text: "表職業②／神靈．幸御魂", value: "2" },
		{ text: "表職業③／英魂",  value: "3" },
		{ text: "表職業④／稀人", value: "4" },
		{ text: "表職業⑤／幸御魂", value: "5" },
		{ text: "表職業⑥／仿生機械", value: "6" },
		{ text: "表職業⑦／人造生命", value: "7" },
	];
	ctrl.enableDropdownTabs({
		options: options,
		onChangeFunc: () => {
			renderTitle();
			renderDataList();
		}
	});
	ctrl.disableSorter();

	
	ctrl.elemRef.dataContainer.style.display = 'flex';
	ctrl.elemRef.dataContainer.style.flexDirection = 'column';
	ctrl.elemRef.dataContainer.style.gap = '5px';
	renderTitle();
	renderDataList();


	// ==============================
	function renderTitle() {
		const selectedOpt = options.find( opt => opt.value == ctrl.tabCfg.tabID );
		if (selectedOpt) {
			ctrl.setTitle(selectedOpt.text);
		}
	}
	function renderDataList() {
		const newList = dataList.filter(data => data.type == ctrl.tabCfg.tabID);
		ctrl.renderDataList(newList, facadeParser);
	}
	function facadeParser(itemData) {
		const DOMArr = [];
		DOMArr.push(`<div class="description">${itemData.desc}</div>`);
		DOMArr.push(`<div class="content-title">${getFeatTitle()}</div>`);
		DOMArr.push(`<div class="content">${getFeatContent()}</div>`);
		DOMArr.push(`<div class="content-title">起始道具</div>`);
		itemData.items.forEach( item => {
			DOMArr.push(`<div class="content">${getItemDOM(item)}</div>`);
		});
		
		return `
			<div class="ListEntry Facade">
				<div class="TitleCell fixWidth">
					<div class="title"><div>${getName()}</div></div>
				</div>
				<div class="content-group">${ DOMArr.join('') }</div>
			</div>`;

		function getName(){
			var prefix = itemData.icon;
			return `<font class="PrefixIcon ${prefix==""? "IndentSpace": ""}">${prefix}</font>` + itemData.name;
		}
		function getFeatTitle() {
			if (itemData.feat.name) return `${itemData.feat.name}`;
			return "特徵";
		}
		function getFeatContent() {
			if (itemData.feat.effect) return itemData.feat.effect;
			return itemData.feat;
		}
		function getItemDOM(item) {
			if(item.effect) return `<b>${item.name}</b>：${item.effect}`;
			if(item.label)  return item.label;
			return `<b>${item.name}</b>`;
		}
	}
}

