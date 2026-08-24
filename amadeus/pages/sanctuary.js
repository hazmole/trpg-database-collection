export async function run( pageCtrl, params ) {
  const scData = await Fetcher.fetchJSON('./data/sanctuary.json');
  const itemDatas = await Fetcher.fetchJSON('./data/items.json');

  pageCtrl.disableHeader();
  pageCtrl.disableDescription();
  
  renderPage();

  //=======================
  function renderPage() {
    const tabID = params.uid;
    const tabInfo = scData[tabID];

    pageCtrl.setTitle(tabInfo.name);
    pageCtrl.setCustomBlock(renderCustomBlock(tabInfo));
  }

  function renderCustomBlock(tabInfo) {
    const items = tabInfo.shop
      .map( itemName => {
        const itemData = itemDatas.find(data => data.name == itemName);
        if (!itemData) console.error("Missing Entry: " + itemName);
        return itemData;
      })
      .filter( d => d != null )
    items.sort(cmpFunc(items));

    return `
    <div>
      <div class="custom__sanctuary-intro_panel">
        ${tabInfo.intro.map(p => {
          if (p.startsWith("●")) return `<h4>${p}</h4>`;
          if (p.startsWith("○")) return `<h5>${p}</h5>`;
          return `<p>${p}</p>`;
        }).join('')}
      </div>
      <h4>試煉表</h4>
      <table class="custom__table trial">
        <tr><th class="dice">d6</th><th>效果</th></tr>
        ${_renderTrialEntries(tabInfo.trial)}
      </table>
      <h4>聖地服務</h4>
      <div>
        ${ _renderServices(tabInfo.service) }
      </div>
      <h4>聖地購買表</h4>
      <div>
        ${ items.map(CustomParser.item).join('') }
      </div>
    </div>`;
  }
  function _renderTrialEntries(entryArr) {
    return entryArr.map((pData, idx) => {
      return `<tr><td>${idx+1}</td><td>${pData}</td></tr>`
    }).join('');
  }
  function _renderServices(entryArr) {
    return entryArr.map((pData, idx) => {
      return `<div class="custom__sanctuary-service_panel">
        <div class="custom__sanctuary-service_title">${pData.name}</div>
        <div class="custom__sanctuary-service_cost">價格：${pData.cost} ${pData.cost !="參照"? "神貨": ""}</div>
        <div class="custom__sanctuary-service_effect">${pData.effect.join('<br>')}</div>
      </div>`
    }).join('');
  }

  function cmpFunc(list) {
    return SorterUtils.compareCustom(list, (data) => {
      return {
        cost: (data.cost == "-")? Math.max :data.cost,
      };
    }, ['cost']);
  }
}

