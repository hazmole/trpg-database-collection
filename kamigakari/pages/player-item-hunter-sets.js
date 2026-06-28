export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-hunter-set.json');
	const moduleT = await import(`./general-data-page-template-ctrl.js`);
	const pageCtrl = new moduleT.GeneralDataPageCtrl();
  

  pageCtrl.disableHeader();
  pageCtrl.setTitle("探索者套裝");
  pageCtrl.setDescription([
    "超常存在們所持有的探索用人造神器或隨身物品全套，稱之為「探索者套裝」。",
		"在初次角色創建階段時，可以從「體力型～幸運型」中選擇一個，並獲得其中的全部項目。",
  ]);
  
  const container = pageCtrl.getItemContainerDOM();
	container.style.display = 'flex';
	container.style.flexDirection = 'column';
	container.style.gap = '5px';
  
  pageCtrl.setItems(dataList);
  pageCtrl.setParseFunc(CustomParser.item);
  pageCtrl.displayItemList();
}

