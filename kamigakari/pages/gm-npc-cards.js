export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/npc-cards.json'));

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("NPC");
	ctrl.setDescription([
		"這個列出了一些這個世界中的重要人物，同時也是點綴故事的配角們 ── NPC。",
		"要注意的是，此處記述的情報終究只是他人對該 NPC 的外部評價。",
		"GM 可以根據自己的需要，自由地去追加額外設定或變更設定本身。當然，若打算調整設定的話，也最好把這些改動事先向玩家們傳達。", "\n",
		"NPC 們在現階段並未設定數據等資料。GM 可以根據需求自行設定 NPC 的數據。",
		"此外，由於 NPC 皆不具備［世界干涉等級］，因此只要 PC 不進行干涉，其行動或判定等結果皆由 GM 決定。",
	]);

	ctrl.enableSearching({
		placeholder: "搜尋 NPC 的名稱、說明...",
		onChangeFunc: () => {
			renderDataList();
		}
	});
	ctrl.disableHeader();
	ctrl.disableSorter();

	ctrl.elemRef.dataContainer.style.display = 'flex';
	ctrl.elemRef.dataContainer.style.flexDirection = 'column';
	ctrl.elemRef.dataContainer.style.gap = '5px';
	renderDataList();


	// ==============================
	function renderDataList() {
		const newList = dataList
			.filter(data => searchData(data, ctrl.searchCfg.keyword));
		ctrl.renderDataList(newList, facadeParser);
	}
	function searchData(data, keyword) {
		if (!keyword) return true;
		if (data.name.includes(keyword)) return true;
		if (data.desc.join('').includes(keyword)) return true;
		return false;
	}

	function facadeParser(itemData) {
		const DOMArr = [];
		
		return `
			<div class="ListEntry NPC-Card">
				<div class="TitleCell">
					<div>${getName()}</div>
				</div>
				<div class="InfoCell">
					<entry><b>職業</b>：${itemData.occupation}</entry>
					<entry><b>種族</b>：${itemData.ancestry}</entry>
					<entry><b>年齡</b>：${itemData.ages}</entry>
					<entry><b>性別</b>：${itemData.gender}</entry>
				</div>
				<div class="BodyCell">
					<img class="portrait" src="${getImage()}">
					<div class="quote">${ itemData.quote }</div>
					<div class="description">${ itemData.desc.map( text => `<p>${text}</p>` ).join('') }</div>
				</div>
			</div>`;

		function getName(){
			return itemData.name;
		}
		function getImage(){
			return itemData.image;
		}
	}
}

