export async function run() {
  // Get JSON Data
  const itemData   = await Fetcher.fetchJSON('./data/ancestries.json');
  const talentData = await Fetcher.fetchJSON('./data/talents-ancestry.json');
  const itemNameList = Object.keys(itemData);

  // Get DOM Element
  const dropdownElem = document.getElementById('DropdownMenu');
  // Get RID from URL Params
  const itemID = getUrlItemID();
  CoreRouter.setUrlParams('key', itemID);
  
  // Main Tasks
  appendOptions();
  initListener();
  renderPage(itemID);

  //=======================
  function getUrlItemID() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRaceID = urlParams.get('key');
    return (itemNameList.includes(urlRaceID))? urlRaceID: itemNameList[0];
  }
  function appendOptions() {
    dropdownElem.innerHTML = itemNameList.map( key => {
      return `<option value="${key}"><span class="label">${key}</span></option>`
    }).join('');
    dropdownElem.value = itemID;
  }
  function initListener() {
    dropdownElem.addEventListener('change', (e) => {
      const newItemID = e.target.value;
      // Write URL Params
      CoreRouter.setUrlParams('key', newItemID);
      renderPage(newItemID);
    });
  }
  function renderPage(itemID) {
    const itemObj = itemData[itemID];
    const talentList = talentData
      .filter( t => t.type===`ancestry-${itemID}` )
      .sort(SorterUtils.compareTalent(talentData));

    CoreRouter.setSiteTitle(`種族 - ${itemID}`);
    document.getElementById("Name").textContent = itemObj.name;
    document.getElementById("Description").innerHTML = itemObj.desc.join('<br>');
    document.getElementById("FeatName").textContent = itemObj.feat.name;
    document.getElementById("FeatEffect").innerHTML = itemObj.feat.effect.join('<br>');
    document.getElementById("AttrPhysical").innerHTML = _renderAttributeRow("戰士", itemObj.states.phy);
    document.getElementById("AttrGeneral").innerHTML = _renderAttributeRow("泛用", itemObj.states.gen);
    document.getElementById("AttrMagical").innerHTML = _renderAttributeRow("魔法", itemObj.states.mgc);
    document.getElementById("TalentsContainer").innerHTML = _renderTalents(talentList);
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
  function _renderTalents(dataList) {
    return dataList.map( data => CustomParser.talent(data) ).join('');
  }
}

