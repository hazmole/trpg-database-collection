export async function run() {
	const dataList = (await Fetcher.fetchJSON('./data/anomalies.json'));

	const module = await import(`./player-item-template-ctrl.js`);
	const ctrl = new module.PlayerItemTemplateCtrl();

	ctrl.setTitle("法則障礙");
	ctrl.setDescription([
		"這裡列出了關於［法則障礙］的範例和各項數據。",
	]);

	ctrl.enableSearching({
		placeholder: "搜尋法則障礙的名稱、影響...",
		onChangeFunc: () => {
			renderDataList();
		}
	});
	ctrl.disableHeader();
	ctrl.disableSorter();

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
		if (data.specialDmg.includes(keyword)) return true;
		if (data.penalty.includes(keyword)) return true;
		if (data.fallout.A.includes(keyword)) return true;
		if (data.fallout.B.includes(keyword)) return true;
		return false;
	}

	function facadeParser(itemData) {
		const DOMArr = [];
		
		DOMArr.push(renderBlockCellDOM('sense',  getSenseText(), 'number'));
		DOMArr.push(renderBlockCellDOM('rating',  itemData.rating, 'number w45'));
		DOMArr.push(renderBlockCellDOM('require', itemData.requirement));
		DOMArr.push(renderBlockCellDOM('dispel',  itemData.dispel, '', 'width:70px;'));
		DOMArr.push(renderBlockCellDOM('target',  itemData.target, '', 'width:70px;'));
		
		const titleModifyStyle = (itemData.name.length > 8)? `style="font-size:0.9em;"`: "";

		return `
			<div class="ListEntry Anomaly">
				<div class="TitleCell fixWidth">
					<div class="title"><div ${titleModifyStyle}>${getName()}</div></div>
				</div>
				${ DOMArr.join('') }
				<div class="field">${getEffectText()}</div>
				${getInfoIcon()}
			</div>`;

		function getName(){
			return itemData.name;
		}
		function getSenseText() {
			return itemData.sense.map( v => {
				return (v===0)? "不需要": ""+v;
			}).join('／');
		}
		function getEffectText() {
			const arr = [
				`<div><b>特殊傷害</b>：${itemData.specialDmg}</div>`,
				`<div><b>懲罰</b>：${itemData.penalty}</div>`,
				`<div><b>其他影響Ａ</b>：${itemData.fallout.A}</div>`,
				`<div><b>其他影響Ｂ</b>：${itemData.fallout.B}</div>`,
			];
			return arr.join('');
		}

		function renderBlockCellDOM(labelClass, content, addiClass = '', addiStyle = '') {
			const innerDOMs = [
				`<div class="${labelClass}"></div>`,
				`<div>${content}</div>`
			];
			return `<div class="blockCell fixWidth ${addiClass}" style="${addiStyle}">${innerDOMs.join('')}</div>`;
		}
    function getInfoIcon() {
      if (!itemData.desc)  return "";
      return `<div class="info-box" data-tooltip="${itemData.desc}"></div>`;
    }
	}
}

