export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-legacy-feat.json');
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();

  pageCtrl.setTitle("神器能力");
  pageCtrl.disableDescription();
  pageCtrl.enableTabs({
    options: [
      { text: "共通", value: "common" },
			{ text: "武器", value: "weapon" },
			{ text: "防具", value: "protector" },
      { text: "裝飾", value: "accessory" },
    ],
    onChangeFunc: () => {
      renderDataList();
    }
  });
  
  pageCtrl.setParseFunc(CustomParser.item);
  renderDataList();

  // ===================
  function renderDataList() {
    const tabID = pageCtrl.tabCfg.tabID;
    const newDataList = dataList.filter( data => data.type.includes(tabID) );
    pageCtrl.setItems(newDataList);
    pageCtrl.displayItemList();
  }
}

