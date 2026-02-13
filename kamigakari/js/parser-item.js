var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.item = function(itemData) {
	const itemRef = initItemRef();
	const titleModifyStyle = (itemData.name.length > 8)? `style="font-size:0.9em;"`: "";
	const DOMArr = getDOMs();
	return `
		<div class="ListEntry Item ${getCategoryColorTheme()}">
			<div class="TitleCell fixWidth">
				<div class="tag">${getCategoryText()}</div>
				<div class="title"><div ${titleModifyStyle}>${getNameDOM()}</div></div>
			</div>
			${ DOMArr.join('') }
		</div>`;

	// =================
	function getCategoryColorTheme() {
		if (isWeapon())    return 'weapon';
		if (isProtector()) return 'protector';
		if (isAccessory()) return 'accessory';
		
		const parts = itemData.type.split('-');
		return parts[0];
	}
	function getCategoryText() {
		const parts = itemData.type.split('-');
		switch(parts[0]){
			case "weapon":     parts[0]="武器"; break;
			case "protector":  parts[0]="防具"; break;
			case "accessory":  parts[0]="裝飾"; break;
			case "consumable": parts[0]="消耗品"; break;
			case "sacrament":  parts[0]="常備品"; break;
			case "hunterset":  parts[0]="探索者套裝"; break;
			case "legacy":     parts[0]="神成神器"; break;
			case "upgrade":    parts[0]="追加效果"; break;
		}
		return `${parts.join('-')}`;
	}
	function getNameDOM() {
		var prefixText = "";
		if (isWeapon() && itemData.isFirearm) prefixText = "※";
		if (isWeaponUpgrade())  {
			if(Number.isInteger(itemData.value) && itemData.value<=2)
				prefixText = "◇";
		}

		const prefixClass = (prefixText)? "": "IndentSpace";
		return `<font class="PrefixIcon ${prefixClass}">${prefixText}</font>` + itemData.name;
	}
	function getDOMs() {
		switch(itemRef.category) {
			case "upgrade":    return getUpgradeDOMs();
			case "weapon":     return getWeaponDOMs();
			case "protector":  return getProtectorDOMs();
			case "accessory":  return getAccessoryDOMs();
			case "sacrament":  return getItemsDOMs();
			case "consumable": return getItemsDOMs();
			case "hunterset":  return getHunterSetDOMs();
		}
		return [];
	}
	// ======================
	function getUpgradeDOMs() {
		const DOMArr = [];
		DOMArr.push(renderBlockCellDOM('value', itemData.value, 'number w45'));
		DOMArr.push(renderBlockCellDOM('cost',  getCostText()));
		DOMArr.push(`<div class="field">${getEffectText()}</div>`);
		return DOMArr;
	}
	function getWeaponDOMs() {
		const type = isMagicWeapon()? "mgc": "phy";
		const isVersatile = (itemData.equip === "versatile");

		const DOMArr = [];
		DOMArr.push(renderBlockCellDOM('require', getRequireText(), 'w80'));
		DOMArr.push(renderBlockCellDOM('wield', getEquipmentText(), 'w45'));
		DOMArr.push(renderBlockCellDOM(`state-${type}hit`, getModifierText(itemData.hit), 'number w45'));
		DOMArr.push(renderBlockCellDOM(`state-${type}dmg`, getDamageText(), `number ${isVersatile? "small": ""}`));
		DOMArr.push(renderBlockCellDOM(`state-speed`, getModifierTexts(itemData.spd), `number w45 ${isVersatile? "small": ""}`));
		DOMArr.push(renderBlockCellDOM('cost',  getCostText()));
		DOMArr.push(`<div style="flex:1 1 300px;">
			<div class="property">${getWeaponProperty()}</div>
			<div class="field">${getEffectText()}</div>
			</div>`);
		return DOMArr;
	}
	function getProtectorDOMs() {
		const DOMArr = [];
		DOMArr.push(renderBlockCellDOM('require', getRequireText(), 'w80'));
		if (itemData.equip) {
			DOMArr.push(renderBlockCellDOM('wield', getEquipmentText(), 'w45'));
		}
		DOMArr.push(renderBlockCellDOM('state-evade',  getModifierText(itemData.evd), 'number w45'));
		DOMArr.push(renderBlockCellDOM('state-speed',  getModifierTexts(itemData.spd), 'number w45'));
		DOMArr.push(renderBlockCellDOM('state-phydef', getModifierText(itemData.phyArmor), 'number w45'));
		DOMArr.push(renderBlockCellDOM('state-mgcdef', getModifierText(itemData.mgcArmor), 'number w45'));
		DOMArr.push(renderBlockCellDOM('cost',  getCostText()));
		DOMArr.push(`<div class="field">${getEffectText()}</div>`);
		return DOMArr;
	}
	function getAccessoryDOMs() {
		const DOMArr = [];
		DOMArr.push(renderBlockCellDOM('equip', getEquipmentText(), 'w80'));
		DOMArr.push(renderBlockCellDOM('cost',  getCostText()));
		DOMArr.push(`<div class="field">${getEffectText()}</div>`);
		return DOMArr;
	}
	function getItemsDOMs() {
		const DOMArr = [];
		DOMArr.push(renderBlockCellDOM('usage', getUsageText(), 'w80'));
		DOMArr.push(renderBlockCellDOM('cost',  getCostText()));
		DOMArr.push(`<div class="field">${getEffectText()}</div>`);

		return DOMArr;
	}
	function getHunterSetDOMs() {
		const DOMArr = [];
		DOMArr.push(`<div class="content-title">常備品</div>`);
		itemData.sacrament.forEach(entry => {
			DOMArr.push(`<div class="content"><b>${entry.name}</b>：${entry.effect}</div>`);
		});
		DOMArr.push(`<div class="content-title">消耗品</div>`);
		itemData.consumable.forEach(entry => {
			DOMArr.push(`<div class="content"><b>${entry.name}</b>：${entry.effect}</div>`);
		});
		return [`<div class="content-group">${DOMArr.join('')}</div>`];
	}


	// ======================
	function renderBlockCellDOM(labelClass, content, addiClass = '') {
		const innerDOMs = [
			`<div class="${labelClass}"></div>`,
			`<div>${content}</div>`
		];
		return `<div class="blockCell fixWidth ${addiClass}">${innerDOMs.join('')}</div>`;
	}
	// ======================
	function getCostText() {
		const costVal = itemData.cost;
		if (costVal == 0) return '無';
		if (!costVal || costVal === '-') return '非賣品';
		if (Number.isInteger(costVal)) return `${costVal}G`;
		return costVal;
	}
	function getRequireText() {
		if(itemData.require.length==0) return '-';
		return itemData.require.join('<br>/');
	}
	function getDamageText() {
		const arr = (Array.isArray(itemData.dmg))? itemData.dmg: [itemData.dmg];
		return arr.map(value => {
			if (itemData.isFirearm) return `(${value})`;
			return getModifierText(value);
		}).join('/');
	}
	function getWeaponProperty() {
		var p = itemData.property;
		var arr = [];
		arr.push(`距離：${p.range}`);
		arr.push(`對象：${p.target}`);
		if(p.resist)    arr.push(`抵抗：${p.resist}`);
		if(p.elemental) arr.push(`屬性：${p.elemental}`);
		if(p.rank)      arr.push(`階級：${p.rank}`);
		return arr.map( tag => `<div class="tag">${tag}</div>` ).join('');
	}
	function getUsageText() {
		const UsageTextMap = {
			"other": "其他",
			"enchantment": "法則障礙",
			"rest": "小休",
			"rest-meal": "小休(用餐)",
			"rest-prepare": "小休(準備)",
			"rest-sleep": "小休(睡眠)",
		};
		return itemData.usage.map(u => UsageTextMap[u]).join('<br>');
	}
	function getEquipmentText() {
		const EquipTextMap = {
			"one-hand": "單手",
			"two-hand": "雙手",
			"versatile": "單雙手",
			"head": "頭",
			"back": "背",
			"waist": "腰",
			"hand": "手",
			"feet": "足",
		};
		if (Array.isArray(itemData.equip)) return itemData.equip.map(e => EquipTextMap[e]).join('、');
		return EquipTextMap[itemData.equip];
	}
	function getEffectText() {
		if (Array.isArray(itemData.effect)) return itemData.effect.join('<br>');
		return itemData.effect.replace(/\n/, '<br>');
	}
	function getModifierTexts(values) {
		const arr = (Array.isArray(values))? values: [values];
		const isMultiple = arr.length > 1;
		return arr.map(value => {
			return getModifierText(value, isMultiple);
		}).join('/');
	}
	function getModifierText(num, remainZero){
		if(num==0 && !remainZero) return '-';
		if(num>=0) return '+'+num;
		return ''+num;
	}
	// ======================
	function initItemRef() {
		const typeParts = itemData.type.split('-');
		return {
			category: !isLegacy()? typeParts[0]: (
				isWeapon()? "weapon":
				isProtector()? "protector":
				isAccessory()? "accessory": "unknown"
			),
			isWeapon: isWeapon(),
			isProtector: isProtector(),
			isAccessory: isAccessory(),
			isConsumable: (typeParts[0] === "cosumable"),
			isSacrament:  (typeParts[0] === "sacrament"),
			isHunterSet:  (typeParts[0] === "hunterset"),
		};
	}
	function isMagicWeapon() {
		if(itemData.type.indexOf('魔法')>=0) return true;
		return false;
	}
	function isWeapon() {
		const keywordArr = ["劍","槍","斧","錘","射擊","魔法"];
		const parts = itemData.type.split('-');
		return (parts.length >= 2) && (keywordArr.includes(parts[1]));
	}
	function isProtector() {
		const keywordArr = ["鎧","盾"];
		const parts = itemData.type.split('-');
		return (parts.length >= 2) && (keywordArr.includes(parts[1]));
	}
	function isAccessory() {
		const keywordArr = ["裝飾"];
		const parts = itemData.type.split('-');
		return (parts.length >= 2) && (keywordArr.includes(parts[1]));
	}
	function isLegacy() {
		const parts = itemData.type.split('-');
		return parts[0] === "legacy";
	}
	function isWeaponUpgrade() {
		const parts = itemData.type.split('-');
		return parts[0] === "upgrade";
	}

}