const modeleI = await import(`./item-list-controller.js`); 

export class GeneralDataPageCtrl {

  constructor() {
    // init DOM Elem
    this.elemRef = {};
    this.elemRef.header        = document.getElementById("ContextHeader");
    this.elemRef.title         = document.getElementById("Name");
    this.elemRef.description   = document.getElementById("Description");

    // item Controller
    this.itemCtrl = new modeleI.ItemListCtrl({
      itemContainerID: "DataContainer",
    });

    // define config
    this.tabCfg = {
      enable: false,
      tabID: null,
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

  // disable functionality
  disableHeader() { this.elemRef.header.classList.add('hide'); }
  disableDescription() { this.elemRef.description.classList.add('hide'); }


  // ================
  // Wrap ItemCtrl API
  displayItemList() { this.itemCtrl.display(); }
  setItems(newItems) { this.itemCtrl.setItems(newItems); }
  setParseFunc(newFunc) { this.itemCtrl.setParseFunc(newFunc); }
  reassignSort(cfg) { this.itemCtrl.reassignSort(cfg); }
  enableSort(cfg) {
    this.itemCtrl.enableSort({
      elemID: "SortingGroup",
      elemID_selector: "SortingSelect",
      ...cfg,
    });
  }
  enableSimpleSearch(cfg) {
    this.itemCtrl.enableSimpleSearch({
      elemID: "SearchGroup",
      elemID_input: "SearchInput",
      ...cfg,
    });
  }
  getItemContainerDOM() {
    return this.itemCtrl.elemRef.itemContainer;
  }
}