export async function run( pageCtrl ) {
  const bgData = await Fetcher.fetchJSON('./data/background.json');
  const boonData = await Fetcher.fetchJSON('./data/boons.json');
  boonData.sort(SorterUtils.compareBoons(boonData));

  pageCtrl.setParseFunc(CustomParser.boon);
  const tabs = Object.values(bgData).map(bg => {
    return { text: bg.name, value: bg.name };
  });
	pageCtrl.enableDropdownTabs({
		options: tabs,
		onChangeFunc: () => renderPage(),
	});

  pageCtrl.disableTitle();
  pageCtrl.disableDescription();
  renderPage();

  //=======================
  function renderPage() {
    const tabID = pageCtrl.tabCfg.tabID;
    const tabInfo = bgData[tabID];

    const newDataList = boonData.filter( t => t.category===`background-${tabID}` );
    pageCtrl.setItems(newDataList);
    pageCtrl.setCustomBlock(renderCustomBlock(tabInfo));
    pageCtrl.displayItemList();
  }

  function renderCustomBlock(tabInfo) {
    var firstProphecyBlock = (tabInfo.prophecy)? _renderFirstProphecyBlock(tabInfo): "";
    var specialRuleBlock = (tabInfo.rules)? _renderSpecialRuleBlock(tabInfo): "";

    return `
    <div class="easyRow" style="align-items: start">
      <div style="flex-shrink: 1;" >  
        <h2 class="itemlist__title">${tabInfo.name}</h2>  
        <div class="itemlist__description">${tabInfo.desc.join('<br>')}</div>

        <h4>預言修正</h4>
        <div class="easyRow" style="gap: 5px;">
        ${ tabInfo.offset.map(oData => _renderAttrOffset(oData)).join('') }
        </div>

        ${firstProphecyBlock}
        ${specialRuleBlock}
      </div
      <div>
        <img class="custom__background_image" src="imgs/${tabInfo.image}"/>
      </div>
    </div>
    <h4>背景恩惠</h4>`;
  }

  function _renderSpecialRuleBlock(tabInfo) {
    return `<h4>特殊規則</h4>
            <div class="custom__special-rules">
              ${tabInfo.rules.join("<br/>")}
            </div>`;
  }
  function _renderFirstProphecyBlock(tabInfo) {
    return `<h4>最初的預言表</h4>
            <table class="custom__table prophecy">
              <tr><th class="dice">d6</th><th colspan="2">效果</th></tr>
              ${_renderProphecies(tabInfo.prophecy)}
            </table>`;
  }
  function _renderProphecies(prophecyArr) {
    return prophecyArr.map((pData, idx) => {
      const parts = pData.split("：");
      return `<tr><td>${idx}</td><td>${parts[0]}</td><td>${parts[1]}</td></tr>`
    }).join('');
  }
  function _renderAttrOffset(oData) {
    var text = '???';
    switch(oData) {
    case "shift":   text = "升階"; break;
    case "shift-A": text = "限定升階(A)"; break;
    case "degrade": text = "降階"; break;
    case "up-1":    text = "上升1"; break;
    case "up-2":    text = "上升2"; break;
    case "down-1":  text = "下降1"; break;
    }

    return `<div class="custom__attroffset ${oData}">${text}</div>`;
  }
}

