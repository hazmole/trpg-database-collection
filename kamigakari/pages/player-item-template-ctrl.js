export class PlayerItemTemplateCtrl {

  constructor() {
    // init DOM Elem
    this.elemRef = {};
    this.elemRef.header        = document.getElementById("ContextHeader");
    this.elemRef.title         = document.getElementById("Name");
    this.elemRef.description   = document.getElementById("Description");
    this.elemRef.sorterGroup   = document.getElementById("SortingGroup");
    this.elemRef.sorterSelect  = document.getElementById("SortingSelect");
    this.elemRef.searchGroup   = document.getElementById("SearchGroup");
    this.elemRef.searchInput   = document.getElementById("SearchInput");
    this.elemRef.dataContainer = document.getElementById("DataContainer");

    // define config
    this.tabCfg = {
      enable: false,
      tabID: null,
      onChangeFunc: null,
    };
    this.sortCfg = {
      enable: false,
      sortKey: null,
      onChangeFunc: null,
    };

    this.disableSearcher();
    this.searchCfg = {
      enable: false,
      keyword: '',
      onChangeFunc: null,
    };

  }


  // ================
  // Basic Info
  setTitle(titleText) {
    this.elemRef.title.textContent = titleText;
  }
  setDescription(textArr) {
    this.elemRef.description.innerHTML = textArr.join('<br>');
  }
  
  renderDataList(dataList, parserFunc) {
    this.elemRef.dataContainer.innerHTML = dataList
      .map( data => parserFunc(data) )
      .join('');
  }

  // ================
  // Sorter
  enableSorter(cfg) {
    // render options
    this.elemRef.sorterSelect.innerHTML = cfg.options
      .map(opt => `<option value="${opt.value}"><span class="label">${opt.text}</span></option>`)
      .join('');

    // set default value
    var defaultVal = cfg.options[0].value;
    if (this.sortCfg.sortKey !== null
      && cfg.options.map(opt => opt.value).includes(this.sortCfg.sortKey)) {
        defaultVal = this.sortCfg.sortKey;
    }
    this.elemRef.sorterSelect.value = defaultVal;

    // add listener
    this.elemRef.sorterSelect.addEventListener('change', e => {
      this.sortCfg.sortKey = e.target.value;
      this.sortCfg.onChangeFunc(e.target.value);
    });

    // set config
    this.sortCfg.enable = true;
    this.sortCfg.onChangeFunc = cfg.onChangeFunc;
    this.sortCfg.sortKey = defaultVal;
  }

  // ================
  // Tabs
  enableTabs(cfg) {
    // render options
    this.elemRef.header.innerHTML = cfg.options
      .map(opt => `<div id="Tab-${opt.value}" class="TabItem"><a href="javascript:void(0)">${opt.text}</a></div>`)
      .join('');
    
    // set default value
    const urlParams = new URLSearchParams(window.location.search);
    const defaultVal = urlParams.get('tab') || cfg.options[0].value;
    this.elemRef.header.querySelector(`#Tab-${defaultVal}`).classList.add('active');

    // add listener
    cfg.options.forEach( opt => {
      const tabElem = this.elemRef.header.querySelector(`#Tab-${opt.value}`);
      tabElem.addEventListener('click', () => {
        // toggle active
        CoreRouter.setUrlParams('tab', opt.value);
        this.elemRef.header.querySelector(`#Tab-${this.tabCfg.tabID}`).classList.remove('active');
        this.elemRef.header.querySelector(`#Tab-${opt.value}`).classList.add('active');
        this.tabCfg.tabID = opt.value;
        this.tabCfg.onChangeFunc(opt.value);
      });
    });

    // set config
    this.tabCfg.enable = true;
    this.tabCfg.onChangeFunc = cfg.onChangeFunc;
    this.tabCfg.tabID = defaultVal;
  }

  // ================
  // Tabs (dropdown-style)
  enableDropdownTabs(cfg) {
    // render options
    const elemArr = cfg.options
      .map(opt => `<option value="${opt.value}"><span class="label">${opt.text}</span></option>`);
    this.elemRef.header.innerHTML = `<select id="DropdownMenu">${elemArr.join('')}</select>`;
    const dropdownElem = this.elemRef.header.querySelector(`#DropdownMenu`);

    // set default value
    const urlParams = new URLSearchParams(window.location.search);
    const defaultVal = urlParams.get('tab') || cfg.options[0].value;
    dropdownElem.value = defaultVal;

    // add listener
    dropdownElem.addEventListener('change', (e) => {
      // toggle active
      CoreRouter.setUrlParams('tab', e.target.value);
      this.tabCfg.tabID = e.target.value;
      this.tabCfg.onChangeFunc(e.target.value);
    });

    // set config
    this.tabCfg.enable = true;
    this.tabCfg.onChangeFunc = cfg.onChangeFunc;
    this.tabCfg.tabID = defaultVal;
  }

  // ================
  // Searching
  enableSearching(cfg) {
    this.elemRef.searchGroup.style.display = 'inline-flex';

    // add listener
    this.elemRef.searchInput.addEventListener('change', (e) => {
      // toggle active
      this.searchCfg.keyword = e.target.value;
      this.searchCfg.onChangeFunc(e.target.value);
    });

    // set placeholder
    if (cfg.placeholder)
      this.elemRef.searchInput.placeholder = cfg.placeholder;

    // set config
    this.searchCfg.enable = true;
    this.searchCfg.onChangeFunc = cfg.onChangeFunc;
    this.searchCfg.keyword = '';
  }

  // disable functionality
  disableHeader() { this.elemRef.header.style.display = 'none'; }
  disableSorter() { this.elemRef.sorterGroup.style.display = 'none'; }
  disableDescription() { this.elemRef.description.style.display = 'none'; }
  disableSearcher() { this.elemRef.searchGroup.style.display = 'none'; }
}