export async function run() {
  const dataList = await Fetcher.fetchJSON('./data/items-hunter-set.json');

  renderPage();

  //=======================

  function renderPage() {
    document.getElementById("DatasContainer").innerHTML = _renderDatas(dataList);
  }
  //=======================
  function _renderDatas(dataList) {
    return dataList.map( data => CustomParser.item(data) ).join('');
  }
}

