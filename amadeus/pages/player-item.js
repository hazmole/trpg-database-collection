export async function run( pageCtrl ) {
  const dataArr = await Fetcher.fetchJSON('./data/items.json');

  pageCtrl.enableTabs({
		options: [
			{ text: "常備品", value: "gear" },
			{ text: "消耗品", value: "consumable" },
			{ text: "異骸",   value: "body" },
		],
		onChangeFunc: () => renderPage(),
	});
  pageCtrl.disableDescription();
  pageCtrl.setParseFunc(CustomParser.item);
  
	pageCtrl.enableSort({
		options: [
			{ text:"價格", value: "cost" },
			{ text:"威力", value: "power" },
		],
		cmpFunc: sortCmpFunc,
	});
	pageCtrl.enableSimpleSearch({
		placeholder: "搜尋道具的名稱、效果...",
		matchFunc: (item, keyword) => {
			if (!keyword) return true;
			if (item.name.includes(keyword)) return true;
			if (item.effect.includes(keyword)) return true;
			return false;
		}
	});

  renderPage();

  //=======================
  function renderPage() {
    const tabID = pageCtrl.tabCfg.tabID;
    let newDataList;
    switch (tabID) {
      case "gear": {
        pageCtrl.setTitle("常備品");
        newDataList = dataArr.filter( t => t.category == "item" && t.type===`常備品` );
        break;
      }
      case "consumable": {
        pageCtrl.setTitle("消耗品");
        newDataList = dataArr.filter( t => t.category == "item" && t.type===`消耗品` );
        break;
      }
      case "body": {
        pageCtrl.setTitle("異骸");
        newDataList = dataArr.filter( t => t.category == "body" );
        break;
      }
    }
    pageCtrl.setItems(newDataList);
    pageCtrl.displayItemList();
  }
	function sortCmpFunc(a, b, sortKey) {
		const defaultSortingOrder = ["cost", "power"];
		const newSortingOrder = [sortKey];
		defaultSortingOrder.forEach(o => {
			if (o != sortKey) newSortingOrder.push(o);
		});

    const func = SorterUtils.compareCustom(dataArr, (data) => {
      return {
        cost: (data.cost == "-")? Math.max :data.cost,
        power: calcPowerValue(""+data.power),
      };
    }, newSortingOrder);
    return func(a, b);   
	}

  function calcPowerValue(powerFormula) {
    const dice_idx = powerFormula.indexOf("D6");
    if (dice_idx < 0) {
      return parseInt(powerFormula);
    } else {
      const diceNum = parseInt(powerFormula.substring(0, dice_idx));
      const modifier = parseInt(powerFormula.substring(dice_idx+2)) || 0;
      return diceNum*3.5 + modifier;
    }
  }
}

