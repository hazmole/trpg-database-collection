export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-consumable.json');

  // Get DOM Element
  const dropdownElem = document.getElementById('SortingSelect');

  appendSortOptions();
  initListener();
  renderPage();

  //=======================
  function appendSortOptions() {
    const sortKey = [
      // { text:"名稱", value: "name" },
      { text:"價格", value: "cost" },
      { text:"用途", value: "usage" },
    ];
    dropdownElem.innerHTML = sortKey.map( key => {
      return `<option value="${key.value}-asc"><span class="label">${key.text}</span></option>`;
    }).join('');
    dropdownElem.value = 'cost-asc';
  }
  function initListener() {
    dropdownElem.addEventListener('change', (e) => {
      const newSortKey = e.target.value;
      renderPage(newSortKey);
    });
  }
  function renderPage(sortKey = "cost-asc") {
    const dataListSorted = _sorting(sortKey);

    document.getElementById("Name").textContent = `消耗品`;
    document.getElementById("Description").innerHTML = [
      "透過靈力秘術或愚者黃金所製造出的靈藥、秘藥、一次性咒物和符咒、護符等人造神器，統稱為［消耗品］。",
      "若［消耗品］的［名稱］中記有「×n」，則每使用 1 次， n 的數值就會減少，且會在該數值變為 0 時消滅。",
      "若［消耗品］的［名稱］不存在「×n」標記，則只要使用一次之後就會立即消滅。"
    ].join('<br>');
    document.getElementById("DatasContainer").innerHTML = _renderDatas(dataListSorted);
  }
  //=======================
  function _renderDatas(dataList) {
    return dataList.map( data => CustomParser.item(data) ).join('');
  }
  function _sorting(sortKeyTicket) {
    const parts = sortKeyTicket.split('-');
    const sortPrimaryKey = parts[0];

    // define Sorting Order
    const defaultUsageOrder = ["enchantment", "rest", "rest-meal", "rest-prepare", "rest-sleep", "other"];
    const defaultSortingOrder = ["cost", "usage"];
    const newSortingOrder = [];
    newSortingOrder.push(sortPrimaryKey);
    defaultSortingOrder.forEach(o => {
      if (o != sortPrimaryKey) newSortingOrder.push(o);
    });
    
    // define Reference Factory
    const refFactory = (item) => {
      return {
        name: item.name,
        cost: item.cost=='-'? Number.MAX_SAFE_INTEGER: item.cost,
        usage: item.usage.map( u => defaultUsageOrder.indexOf(u) ).sort()[0],
      };
    };

    return [...dataList].sort(SorterUtils.compareCustom(dataList, refFactory, newSortingOrder));
  }
}

