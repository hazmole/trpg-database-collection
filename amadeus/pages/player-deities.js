export async function run() {
  const moduleI = await import(`${Utils.getBaseURL()}shared/js/item-list-controller.js`); 
  const moduleP = await import(`${Utils.getBaseURL()}shared/js/data-page-controller.js`); 
  const elemRef = {
    header:        document.querySelector(".itemlist__header"),
    title:         document.querySelector(".itemlist__title"),
    description:   document.querySelector(".itemlist__description"),
    biasContainer:    document.querySelector(".custom__dieties_bias_container"),
    dietiesContainer: document.querySelector(".custom__dieties_container"),
    itemContainer:    document.querySelector("#DataContainer"),
  };
  const itemCtrl = new moduleI.ItemListCtrl({
    itemContainerElem: elemRef.itemContainer,
  });
  const pageCtrl = new moduleP.DataPageCtrl({
    headerElem: elemRef.header,
    titleElem:  elemRef.title,
    descElem:   elemRef.description,
    customElem: elemRef.customBlock,
    itemCtrl:   itemCtrl,
  });

  
  const clData = await Fetcher.fetchJSON('./data/diety-cluster.json');
  const dtData = await Fetcher.fetchJSON('./data/dieties.json');
  const boonData = await Fetcher.fetchJSON('./data/boons.json');
  const tabs = Object.values(clData).map(cl => {
    return { text: `${cl.name}神群`, value: cl.name };
  });

  pageCtrl.setParseFunc(CustomParser.boon);
  pageCtrl.enableDropdownTabs({
		options: tabs,
		onChangeFunc: () => renderPage(),
  });

  
  renderPage()

  //=======================
  function renderPage() {
    const tabID = pageCtrl.tabCfg.tabID;
    const tabInfo = clData[tabID];

    const clusterBoons = boonData.filter( t => t.category===`dcluster-${tabID}`);
    const clusterDieties = dtData.filter( t => t.category===`diety-${tabID}` );

    pageCtrl.setTitle(`${tabID}神群`);
    pageCtrl.setItems(clusterBoons);
    
    _renderDieties(clusterDieties);
    _renderBias(tabInfo.bias);
    pageCtrl.setDescription([ArticleParser.Parse(tabInfo.desc, 3).join('')]);
    // const newDataList = boonData.filter( t => t.category===`background-${tabID}` );
    // pageCtrl.setItems(newDataList);
    pageCtrl.displayItemList(clusterDieties);
  }

  function _renderBias(data_arr) {
    elemRef.biasContainer.innerHTML = data_arr.map(d => `
      <div class="custom__dieties_bias_entry">
        <div class="custom__dieties_bias_entry_speaker ${d.cluster}">${d.cluster}神群</div>
        <div class="custom__dieties_bias_entry_speechbox">${d.opinion.join('<br>')}</div>
      </div>`).join('');
  }
  function _renderDieties(data_arr) {
    for (let i=0; i<data_arr.length; i++) {
      const data = data_arr[i];
      elemRef.dietiesContainer.insertAdjacentHTML('beforeend', `
        <div class="custom__dieties_diety" onclick="">
          <img src="imgs/head_${data.image}">
          <div class="custom__dieties_diety_name">${data.name}</div>
        </div>`);
      const DOM = elemRef.dietiesContainer.querySelector(".custom__dieties_diety:last-child");
      DOM.addEventListener('click', () => { openDietyInfo(data) });
    }
  }

  function openDietyInfo(dietyInfo) {

    console.log(dietyInfo);
  }
}

