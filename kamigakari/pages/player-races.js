export async function run() {
  // Get JSON Data
  const raceData   = await Fetcher.fetchJSON('./data/races.json');
  const talentData = await Fetcher.fetchJSON('./data/talents-race.json');
  const raceNameList = Object.keys(raceData);

  // Get DOM Element
  const dropdownElem = document.getElementById('DropdownMenu');
  // Get RID from URL Params
  const raceID = getUrlRaceID();
  
  // Main Tasks
  appendOptions();
  initListener();
  renderPage(raceID);

  //=======================
  function getUrlRaceID() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRaceID = urlParams.get('race');
    return (raceNameList.includes(urlRaceID))? urlRaceID: '封神';
  }
  function appendOptions() {
    dropdownElem.innerHTML = raceNameList.map( key => {
      return `<option value="${key}"><span class="label">${key}</span></option>`
    }).join('');
    dropdownElem.value = raceID;
  }
  function initListener() {
    dropdownElem.addEventListener('change', (e) => {
      const newRaceID = e.target.value;
      // Write URL Params
      CoreRouter.setUrlParams('race', newRaceID);
      renderPage(newRaceID);
    });
  }
  function renderPage(raceID) {
    const raceObj = raceData[raceID];
    const talentList = talentData
      .filter( t => t.type===`race-${raceID}` )
      .sort(SorterUtils.compareTalent(talentData));

    CoreRouter.setSiteTitle(`種族 - ${raceID}`);
    document.getElementById("Name").textContent = raceObj.name;
    document.getElementById("Description").innerHTML = raceObj.desc.join('<br>');
    document.getElementById("FeatName").textContent = raceObj.feat.name;
    document.getElementById("FeatEffect").innerHTML = raceObj.feat.effect.join('<br>');
    document.getElementById("RaceAttrPhysical").innerHTML = _renderAttributeRow("戰士", raceObj.states.phy);
    document.getElementById("RaceAttrGeneral").innerHTML = _renderAttributeRow("泛用", raceObj.states.gen);
    document.getElementById("RaceAttrMagical").innerHTML = _renderAttributeRow("魔法", raceObj.states.mgc);
    document.getElementById("RaceTalentsContainer").innerHTML = _renderTalents(talentList);
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

