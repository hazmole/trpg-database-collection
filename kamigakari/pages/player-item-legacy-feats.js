export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-legacy-feat.json');

  const module = await import(`./player-item-template-ctrl.js`);
  const ctrl = new module.PlayerItemTemplateCtrl();
  
  ctrl.disableSorter();
  ctrl.disableDescription();
  
  ctrl.enableTabs({
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
  
  ctrl.setTitle("神器能力");
  renderDataList();

  // ===================
  function renderDataList() {
    const tabID = ctrl.tabCfg.tabID;
    const newList = dataList.filter( data => data.type.includes(tabID) );

    ctrl.renderDataList(newList, CustomParser.item);
  }
}

