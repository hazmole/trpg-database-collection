export async function run() {
  // Get JSON Data
  const itemData   = await Fetcher.fetchJSON('./data/arm-systems.json');
  const talentData = await Fetcher.fetchJSON('./data/talents-arm-system.json');
  const itemNameList = Object.keys(itemData);

  // Get DOM Element
  const dropdownElem_forAS = document.getElementById('DropdownMenu');
  const dropdownElem_forType = document.getElementById('DropdownMenu2');
  // Get RID from URL Params
  const itemID = getUrlItemID();
  const typeID = getUrlTypeID();
  CoreRouter.setUrlParams('key', itemID);
  CoreRouter.setUrlParams('type', typeID);
  
  // Main Tasks
  appendOptions();
  initListener();
  renderPage(itemID, typeID);

  //=======================
  function getUrlItemID() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlItemID = urlParams.get('key');
    return (itemNameList.includes(urlItemID))? urlItemID: itemNameList[0];
  }
  function getUrlTypeID() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTypeID = urlParams.get('type');
    return (["A","B"].includes(urlTypeID))? urlTypeID: "A";
  }
  function appendOptions() {
    dropdownElem_forAS.innerHTML = itemNameList.map( key => {
      return `<option value="${key}"><span class="label">${key}</span></option>`
    }).join('');
    dropdownElem_forAS.value = itemID;

    const textArr = ["Ａ", "Ｂ"];
    dropdownElem_forType.innerHTML = ["A", "B"].map( (key, idx) => {
      return `<option value="${key}"><span class="label">${textArr[idx]}</span></option>`
    }).join('');
    dropdownElem_forType.value = typeID;
  }
  function initListener() {
    dropdownElem_forAS.addEventListener('change', (e) => {
      const newItemID = e.target.value;
      const typeID = getUrlTypeID();
      // Write URL Params
      CoreRouter.setUrlParams('key', newItemID);
      renderPage(newItemID, typeID);
    });
    dropdownElem_forType.addEventListener('change', (e) => {
      const itemID = getUrlItemID();
      const newTypeID = e.target.value;
      // Write URL Params
      CoreRouter.setUrlParams('type', newTypeID);
      renderPage(itemID, newTypeID);
    });
  }
  function renderPage(itemID, typeID) {
    const itemObj = itemData[itemID];
    const talentList = talentData
      .filter( t => t.type===`AS-${itemID}-${typeID}` )
      .sort(SorterUtils.compareTalent(talentData));

    CoreRouter.setSiteTitle(`稱號 - ${itemID}`);
    document.getElementById("Name").textContent = `【${itemObj.category}系】${itemObj.name} ${itemObj.alias[0]}`;
    document.getElementById("Description").innerHTML = itemObj.desc.join('<br>');
    document.getElementById("ArmSystemStateModifier").innerHTML = _renderAttributeRow(itemObj.states);
    document.getElementById("ArmSystemEffect").innerHTML = itemObj.effect.join('<br>');
    document.getElementById("ArmSystemTypeEffect").innerHTML = itemObj[`type${typeID}`].join('<br>');
    document.getElementById("TalentsContainer").innerHTML = _renderTalents(talentList);
  }
  //=======================
  function _renderAttributeRow(data) {
    const arr = [];
    arr.push(`<td>${ data.phy_hit }</td>`);
    arr.push(`<td>${ data.phy_evd }</td>`);
    arr.push(`<td>${ data.mgc_hit }</td>`);
    arr.push(`<td>${ data.mgc_evd }</td>`);
    arr.push(`<td>${ data.spc_evd }</td>`);
    arr.push(`<td>${ data.phy_dmg }</td>`);
    arr.push(`<td>${ data.mgc_dmg }</td>`);
    arr.push(`<td>${ data.speed }</td>`);
    arr.push(`<td>${ data.hp }</td>`);
    return arr.join('');
  }
  function _renderTalents(dataList) {
    return dataList.map( data => CustomParser.talent(data) ).join('');
  }
}

