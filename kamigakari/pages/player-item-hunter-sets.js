export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-hunter-set.json');

  const module = await import(`./player-item-template-ctrl.js`);
  const ctrl = new module.PlayerItemTemplateCtrl();
  
  ctrl.disableSorter();
  ctrl.disableHeader();
  
  ctrl.setTitle("探索者套裝");
  ctrl.setDescription([
    "超常存在們所持有的探索用人造神器或隨身物品全套，稱之為「探索者套裝」。",
		"在初次角色創建階段時，可以從「體力型～幸運型」中選擇一個，並獲得其中的全部項目。",
  ]);

  ctrl.elemRef.dataContainer.style.display = 'flex';
  ctrl.elemRef.dataContainer.style.flexDirection = 'column';
  ctrl.elemRef.dataContainer.style.gap = '5px';
  ctrl.renderDataList(dataList, CustomParser.item);
}

