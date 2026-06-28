export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/talents-common.json');
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

  dataList.sort(SorterUtils.compareTalent(dataList));
  pageCtrl.setParseFunc(CustomParser.talent);

	pageCtrl.enableDropdownTabs({
		options: [
			{ text: "共通天賦",         value: "normal" },
			{ text: "共通種族天賦",     value: "ancestry" },
			{ text: "高等天賦 (LV.5)",  value: "advanced5" },
      { text: "高等天賦 (LV.10)", value: "advanced10" },
      { text: "高等天賦 (LV.15)", value: "advanced15" },
      { text: "高等天賦 (LV.20)", value: "advanced20" },
		],
		onChangeFunc: () => renderPage(),
	});

  const tabInfos   = {
    "normal": {
      title: "共通天賦",
      desc: ["這裡列出了與角色［稱號］無關而可以直接習得的《共通天賦》。"]
    },
    "ancestry": {
      title: "共通種族天賦",
      desc: [
        "這裡列出了與角色［種族］無關而可以直接習得的共通《種族天賦》。",
        "要注意的是，它們並不會被視為任何［種族］的《種族天賦》（比如說，它們不會受到像是［封神］的《不祥的血脈》這類要指定特定［種族］的效果影響）。"
      ]
    },
    "advanced5": {
      title: "高等天賦 (LV.5)",
      desc: [
        "這裡列出了當角色升至 LV.5 或以上時可以習得的《高等天賦》。",
        "每當角色的［LV］或［世界干涉等級］達到 5、10、15、20 時，便能從中習得 1 個（不會自動習得）。"
      ]
    },
    "advanced10": {
      title: "高等天賦 (LV.10)",
      desc: [
        "這裡列出了當角色升至 10 級時可以習得的《高等天賦》。",
        "當角色的［LV］或［世界干涉等級］達到 10 時，會從《龍脈胎動》《稱號奧義》《稱號開花》中選擇 1 個自動習得。",
        "然後，可以再從※以外的《高等天賦》中任意選擇 1 個並習得。", "",
        "在這之後，每當角色的［LV］或［世界干涉等級］達到 15、20 時，便能再從※以外的《高等天賦》中任意選擇 1 個並習得。"
      ]
    },
    "advanced15": {
      title: "高等天賦 (LV.15)",
      desc: [
        "這裡列出了當角色升至 15 級時可以習得的《高等天賦》。",
        "每當角色的［LV］或［世界干涉等級］達到 15、20 時，便能從中習得一個（不會自動習得）。"
      ]
    },
    "advanced20": {
      title: "高等天賦 (LV.20)",
      desc: [
        "這裡列出了當角色升至 20 級可以習得的《高等天賦》。",
        "當角色的［LV］或［世界干涉等級］達到 10 時，會自動習得《弒神之力》。",
        "然後，可以再從※以外的《高等天賦》中任意選擇 1 個並習得。"
      ]
    },
  };

  
  renderPage();

  //=======================
  function renderPage() {
    const tabID = pageCtrl.tabCfg.tabID;
    const tabInfo = tabInfos[tabID];

    const newDataList = dataList.filter( t => t.type===`common-${tabID}` );
    pageCtrl.setItems(newDataList);
    pageCtrl.setTitle(tabInfo.title);
    pageCtrl.setDescription(tabInfo.desc);

    pageCtrl.displayItemList();
  }
}

