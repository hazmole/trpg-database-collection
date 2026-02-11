export async function run() {
  // Get JSON Data
  const itemData   = await Fetcher.fetchJSON('./data/classes.json');
  // const talentData = await Fetcher.fetchJSON('./data/talents-race.json');
  const itemNameList = Object.keys(itemData);

  // Get DOM Element
  const dropdownElem = document.getElementById('DropdownMenu');
  // Get RID from URL Params
  const itemID = getUrlItemID();
  
  // Main Tasks
  appendOptions();
  initListener();
  renderPage(itemID);

  //=======================
  function getUrlItemID() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlItemID = urlParams.get('class');
    return (itemNameList.includes(urlItemID))? urlItemID: itemNameList[0];
  }
  function appendOptions() {
    dropdownElem.innerHTML = itemNameList.map( key => {
      return `<option value="${key}"><span class="label">${key}</span></option>`
    }).join('');
    dropdownElem.value = itemID;
  }
  function initListener() {
    dropdownElem.addEventListener('change', (e) => {
      const newitemID = e.target.value;
      // Write URL Params
      CoreRouter.setUrlParams('class', newitemID);
      renderPage(newitemID);
    });
  }
  function renderPage(itemID) {
    const itemObj = itemData[itemID];

    CoreRouter.setSiteTitle(`稱號 - ${itemID}`);
    document.getElementById("Name").textContent = `【${itemObj.category}系】${itemObj.name} ${itemObj.alias[0]}`;
    document.getElementById("Description").innerHTML = itemObj.desc.join('<br>');

    /*
    
    const talentList = talentData
      .filter( t => t.type===`race-${raceID}` )
      .sort(SorterUtils.compareTalent(talentData));

    document.getElementById("Description").innerHTML = raceObj.desc.join('<br>');
    document.getElementById("FeatName").textContent = raceObj.feat.name;
    document.getElementById("FeatEffect").innerHTML = raceObj.feat.effect.join('<br>');
    document.getElementById("RaceAttrPhysical").innerHTML = _renderAttributeRow("戰士", raceObj.states.phy);
    document.getElementById("RaceAttrGeneral").innerHTML = _renderAttributeRow("泛用", raceObj.states.gen);
    document.getElementById("RaceAttrMagical").innerHTML = _renderAttributeRow("魔法", raceObj.states.mgc);
    document.getElementById("RaceTalentsContainer").innerHTML = _renderTalents(talentList);
    */
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
    return dataList.map( data => Parser.talent(data) ).join('');
  }
}

