export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-sacrament.json');

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

    document.getElementById("Name").textContent = `常備品`;
    document.getElementById("Description").innerHTML = [
      "能在超常存在們的日常生活或［戰鬥外］場景中發揮作用的［道具］，統稱為［常備品］。",
		  "雖然在戰鬥中無法發揮作用，但在追查與超常存在相關的事件時，仍然是不可或缺的。"
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

