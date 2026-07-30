export async function run( pageCtrl, params ) {
  const boonData = await Fetcher.fetchJSON('./data/boons-common.json');
  boonData.sort(SorterUtils.compareBoons(boonData));

  pageCtrl.disableHeader();
  pageCtrl.setTitle("泛用恩惠");
  pageCtrl.setDescription(["這裡列出了的恩惠，為所有角色都能習得的泛用恩惠。"]);
  
  pageCtrl.setItems(boonData);
  pageCtrl.setParseFunc(CustomParser.boon);
  
  pageCtrl.displayItemList();
}

