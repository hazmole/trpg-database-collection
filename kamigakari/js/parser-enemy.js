var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.enemy = function(itemData) {
  const titleModifyStyle = (itemData.name.length > 8)? `style="font-size:0.9em;"`: "";
	const statesDOMArr = getEnemyStatesDOMs();
	const detailDOMArr = getEnemyDetailDOM();
	return `
		<div class="ListEntry Enemy">
			${ renderToggleBtnDOM() }
			<div class="TitleCell fixWidth">
			<div class="title"><div ${titleModifyStyle}>${itemData.name}</div></div>
			</div>
			${ renderSingleCellDOM('level', getLvText()) }
			${ statesDOMArr.join('') }
			<div class="ToggleExpandContent">
				${detailDOMArr.join('')}
			</div>
		</div>`;
	
  // =================
	function getEnemyStatesDOMs() {
		const DOMArr = [];
		DOMArr.push(renderCategoryDOM());
		DOMArr.push(renderBlockCellDOM('fame',         itemData.info.fame, 'number w45'));
		DOMArr.push(renderBlockCellDOM('size',         itemData.info.size, 'number w45'));
		DOMArr.push(`<div class="easyRow">${
			[
				renderBlockCellDOM('p_hit battle-state',  renderBattleStateDOM("p_hit"), 'number w45'),
				renderBlockCellDOM('p_evd battle-state',  renderBattleStateDOM("p_evd"), 'number w45'),
				renderBlockCellDOM('m_hit battle-state',  renderBattleStateDOM("m_hit"), 'number w45'),
				renderBlockCellDOM('m_evd battle-state',  renderBattleStateDOM("m_evd"), 'number w45'),
				renderBlockCellDOM('s_evd battle-state',  renderBattleStateDOM("s_evd"), 'number w45')
			].join('')
		}</div>`);
		DOMArr.push(`<div class="easyRow">${
			[
				renderBlockCellDOM('speed',          renderSpeedStateDOM(),   'number w45'),
				renderBlockCellDOM('health',         itemData.states.hp,      'number w45'),
				renderBlockCellDOM('p_armor armor',  itemData.states.p_armor, 'number w45'),
				renderBlockCellDOM('m_armor armor',  itemData.states.m_armor, 'number w45'),
			].join('')
		}</div>`);
		
		return DOMArr;
	}
	function getEnemyDetailDOM() {
		const DOMArr = [
			`<div class="Splitter"></div>`,
			...renderOtherInfo(),
			`<div class="TitleRow">行動</div>`,
			...renderActions(),
			`<div class="TitleRow">素材</div>`,
			...renderTreasures(),
		];
		if (itemData.desc) {
			DOMArr.push(...[
				`<div class="TitleRow">說明</div>`,
				`<div class="Description">${ itemData.desc }</div>`
			]);
		}

		return DOMArr;
	}
	function renderCategoryDOM() {
		return `<div class="type ${itemData.type} fixWidth singleCell">
				<div class="type-icon"></div>
				<div class="type-text">${getCategoryText()}</div>
			</div>`;
	}
	function renderToggleBtnDOM() {
		return `<button class="ToggleBtnWrapper" onclick="ToggleUtils.click(this)">
					<div class="ToggleBtnBox"><span class="icon-chevron"></span></div>
					<span class="ToggleBtnLabel">展開</span>
				</button>`;
	}
	function renderOtherInfo() {
		const DOMArr = [
			renderInfoPair("智能", getIntelligentText()),
			renderInfoPair("感官", getSenseText()),
			renderInfoPair("對話", getCommunicateText()),
			renderInfoPair("反應", getReactionText()),
			renderInfoPair("移動", getMovementsText()),
		];
		return [
			`<div class="Info SubEntry easyRow">${DOMArr.join('')}</div>`,
			`<div class="Info SubEntry easyRow">${renderInfoPair("弱點", getWeaknessText())}</div>`
		];
	}
	function renderInfoPair(title, value) {
		return `<div class="easyRow">
			<div class="label-title">${title}</div>
			<div class="label-value">${value}</div>
		</div>`;
	}

	function renderActions() {
		return itemData.actions.map(entry => {
			return `<div class="Talent SubEntry easyRow">
				<div class="title">${entry.name}</div>
				<div class="tags">${entry.tags.join('／')}</div>
				<div class="effect">${entry.effect.join("<br>")}</div>
			</div>`
		});
	}
	function renderTreasures() {
		return itemData.treasures.map(entry => {
			let contentText = entry.name;
			if (entry.effect && entry.value) {
				const cost = (entry.cost)? entry.cost: `${(entry.cost == 5)? 3000: 500 * entry.value}G`;
				contentText += ` ／ ${entry.effect}：${cost}（效果值 ${entry.value}）`;
			}

			return `<div class="Treasure SubEntry easyRow">
				<div class="range">${entry.range}</div>
				<div class="content">${contentText}</div>
			</div>`
		});
	}

	// =================
	function renderBattleStateDOM(key){
		const stateVal = itemData.states[key];
		const fixedVal = parseInt(stateVal) + 7;
		return `<div class="mainVal">${stateVal}</div><div class="subVal">(${fixedVal})</div>`;
	}
	function renderSpeedStateDOM(){
		const stateVal = itemData.states["speed"];
		const moveVal = Math.ceil((parseInt(stateVal) + 5) / 3);
		return `<div class="mainVal">${stateVal}</div><div class="subVal">(${moveVal})</div>`;
	}
	function renderSingleCellDOM(labelClass, content) {
		return `<div class="singleCell fixWidth ${labelClass}">${content}</div>`;
	}
	function renderBlockCellDOM(labelClass, content, addiClass = '') {
		const innerDOMs = [
			`<div class="${labelClass}"></div>`,
			`<div>${content}</div>`
		];
		return `<div class="blockCell fixWidth ${addiClass}">${innerDOMs.join('')}</div>`;
	}
	// =================
	function getIntelligentText() {
		switch (itemData.info.iq) {
			case "low": return "低下";
			case "nrm": return "普通";
			case "hgh": return "高";
			case "cun": return "狡猾";
		}
	}
	function getSenseText() {
		switch (itemData.info.sense) {
			case "nrm": return "普通";
			case "hea": return "熱";
			case "mgc": return "魔力";
			case "fld": return "領域";
		}
	}
	function getCommunicateText() {
		switch (itemData.info.comm) {
			case true:  return "可能";
			case false: return "不可";
		}
	}
	function getReactionText() {
		switch (itemData.info.react) {
			case "hos": return "敵對";
			case "neu": return "中立";
			case "frn": return "友好";
			case "any": return "各種";
		}
	}
	function getCategoryText() {
		switch (itemData.type) {
			case "humanoid": return "人型";
			case "beast":    return "魔獸";
			case "insect":   return "怪蟲";
			case "plant":    return "植物";
			case "machine":  return "機械";
			case "undead":   return "不死";
			case "eudemon":  return "幻獸";
			case "demon":    return "混沌";
		}
	}
	function getMovementsText() {
		return itemData.info.movement.map(n => getMovementText(n)).join('、');
	}
	function getWeaknessText() {
		if (itemData.info.weakness.length == 0) return '無';
		return itemData.info.weakness.map(n => `［${getElementText(n)}］`).join('')
	}
	function getMovementText(abrv) {
		switch (abrv) {
  		case "w": return "步行";
  		case "s": return "游泳";
  		case "f": return "飛行";
		}
	}
	function getElementText(abrv) {
		switch (abrv) {
  		case "fir": return "火炎";
  		case "cld": return "寒氣";
  		case "ele": return "電擊";
  		case "mag": return "磁力";
  		case "wnd": return "風壓";
  		case "fls": return "閃光";
  		case "poi": return "魔毒";
  		case "ill": return "幻覺";
		}
	}
	function getLvText() {
		return `Lv.${itemData.level}`;
	}
}