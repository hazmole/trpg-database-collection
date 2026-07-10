export async function run( pageCtrl ) {
  // Get JSON Data
  const ancData   = await Fetcher.fetchJSON('./data/ancestries.json');
  const talentData = await Fetcher.fetchJSON('./data/talents-ancestry.json');
  talentData.sort(SorterUtils.compareTalent(talentData));

  const options = Object.keys(ancData).map((name, idx) => {
    return { text: name, value: name };
  });

  pageCtrl.setParseFunc(CustomParser.talent);
	pageCtrl.enableDropdownTabs({
		options: options,
		onChangeFunc: () => renderPage(),
	});

  renderPage();

  //=======================
  function renderPage() {
    const tabID = pageCtrl.tabCfg.tabID;
    const tabInfo = ancData[tabID];

    pageCtrl.setTitle(tabInfo.name);
    pageCtrl.setDescription(tabInfo.desc);
    pageCtrl.setCustomBlock(renderCustomBlock(tabInfo));

    const newTalentList = talentData.filter( t => t.type===`ancestry-${tabID}` );
    pageCtrl.setItems(newTalentList);
    pageCtrl.displayItemList();
  }

  function renderCustomBlock(tabInfo) {
    return `
    <div>
      <h4>能力值類型</h4>
      <table class="custom__statetable">
        <tr><th>類型</th><th>體力</th><th>敏捷</th><th>知性</th><th>精神</th><th>幸運</th></tr>
        <tr id="AttrPhysical">${_renderAttributeRow("戰士", tabInfo.states.phy)}</tr>
        <tr id="AttrGeneral" >${_renderAttributeRow("泛用", tabInfo.states.phy)}</tr>
        <tr id="AttrMagical" >${_renderAttributeRow("魔法", tabInfo.states.phy)}</tr>
      </table>

      <h4>種族特典</h4>
      <div class="custom__information">
        <div><b>${tabInfo.feat.name}</b></div>
        <div>${tabInfo.feat.effect.join('<br>')}</div>
      </div>

      <h4>種族天賦一覽</h4>
    </div>`;
  }

  //=======================
  function _renderAttributeRow(labelText, data) {
    const arr = [ `<td class="title">${labelText}</td>` ];
    arr.push(`<td>${ data.con }</td>`);
    arr.push(`<td>${ data.dex }</td>`);
    arr.push(`<td>${ data.int }</td>`);
    arr.push(`<td>${ data.wil }</td>`);
    arr.push(`<td>${ data.luc }</td>`);
    return arr.join('');
  }

}

