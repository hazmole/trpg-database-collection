export class PlayerItemTemplateCtrl {

  constructor() {
    // init DOM Elem
    this.elemRef = {};
    this.elemRef.header        = document.getElementById("ContextHeader");
    this.elemRef.title         = document.getElementById("Name");
    this.elemRef.description   = document.getElementById("Description");
    this.elemRef.sorterGroup   = document.getElementById("SortingGroup");
    this.elemRef.sorterSelect  = document.getElementById("SortingSelect");
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
  }


  // ================
  // Basic Info
  setTitle(titleText) {
    this.elemRef.title.textContent = titleText;
  }
  setDescription(textArr) {
    this.elemRef.description.innerHTML = textArr.join('<br>');
  }
  setDataList(list) {
    this.dataList = list;
  }
  
  renderDataList(dataList) {
    this.elemRef.dataContainer.innerHTML = dataList
      .map( data => CustomParser.item(data) )
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
    const defaultVal = cfg.options[0].value;
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
    const defaultVal = cfg.options[0].value;
    this.elemRef.header.querySelector(`#Tab-${defaultVal}`).classList.add('active');

    // add listener
    cfg.options.forEach( opt => {
      const tabElem = this.elemRef.header.querySelector(`#Tab-${opt.value}`);
      tabElem.addEventListener('click', () => {
        // toggle active
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


  // disable functionality
  disableHeader() { this.elemRef.header.style.display = 'none'; }
  disableSorter() { this.elemRef.sorterGroup.style.display = 'none'; }


}