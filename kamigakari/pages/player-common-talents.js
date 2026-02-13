export async function run() {
  // Get JSON Data
  const itemData   = {
    "共通天賦": {
      type: "normal",
      desc: ["這裡列出了與角色［稱號］無關而可以直接習得的《共通天賦》。"]
    },
    "共通種族天賦": {
      type: "ancestry",
      desc: [
        "這裡列出了與角色［種族］無關而可以直接習得的共通《種族天賦》。",
        "要注意的是，它們並不會被視為任何［種族］的《種族天賦》（比如說，它們不會受到像是［封神］的《不祥的血脈》這類要指定特定［種族］的效果影響）。"
      ]
    },
    "高等天賦 (LV.5)": {
      type: "advanced5",
      desc: [
        "這裡列出了當角色升至 LV.5 或以上時可以習得的《高等天賦》。",
        "每當角色的［LV］或［世界干涉等級］達到 5、10、15、20 時，便能從中習得 1 個（不會自動習得）。"
      ]
    },
    "高等天賦 (LV.10)": {
      type: "advanced10",
      desc: [
        "這裡列出了當角色升至 10 級時可以習得的《高等天賦》。",
        "當角色的［LV］或［世界干涉等級］達到 10 時，會從《龍脈胎動》《稱號奧義》《稱號開花》中選擇 1 個自動習得。",
        "然後，可以再從※以外的《高等天賦》中任意選擇 1 個並習得。", "",
        "在這之後，每當角色的［LV］或［世界干涉等級］達到 15、20 時，便能再從※以外的《高等天賦》中任意選擇 1 個並習得。"
      ]
    },
    "高等天賦 (LV.15)": {
      type: "advanced15",
      desc: [
        "這裡列出了當角色升至 15 級時可以習得的《高等天賦》。",
        "每當角色的［LV］或［世界干涉等級］達到 15、20 時，便能從中習得一個（不會自動習得）。"
      ]
    },
    "高等天賦 (LV.20)": {
      type: "advanced20",
      desc: [
        "這裡列出了當角色升至 20 級可以習得的《高等天賦》。",
        "當角色的［LV］或［世界干涉等級］達到 10 時，會自動習得《弒神之力》。",
        "然後，可以再從※以外的《高等天賦》中任意選擇 1 個並習得。"
      ]
    },
  };
  const talentData = await Fetcher.fetchJSON('./data/talents-common.json');
  const itemNameList = Object.keys(itemData);

  // Get DOM Element
  const dropdownElem_forAS = document.getElementById('DropdownMenu');
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
    const urlItemID = urlParams.get('key');
    return (itemNameList.includes(urlItemID))? urlItemID: itemNameList[0];
  }
  function appendOptions() {
    dropdownElem_forAS.innerHTML = itemNameList.map( key => {
      return `<option value="${key}"><span class="label">${key}</span></option>`
    }).join('');
    dropdownElem_forAS.value = itemID;
  }
  function initListener() {
    dropdownElem_forAS.addEventListener('change', (e) => {
      const newItemID = e.target.value;
      // Write URL Params
      CoreRouter.setUrlParams('key', newItemID);
      renderPage(newItemID);
    });
  }
  function renderPage(itemID) {
    const itemObj = itemData[itemID];
    const talentList = talentData
      .filter( t => t.type===`common-${itemObj.type}` )
      .sort(SorterUtils.compareTalent(talentData));

    CoreRouter.setSiteTitle(`共通天賦 - ${itemID}`);
    document.getElementById("Name").textContent = `${itemID}`;
    document.getElementById("Description").innerHTML = itemObj.desc.join('<br>');
    document.getElementById("TalentsContainer").innerHTML = _renderTalents(talentList);
  }
  //=======================
  function _renderTalents(dataList) {
    return dataList.map( data => CustomParser.talent(data) ).join('');
  }
}

