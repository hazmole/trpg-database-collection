export class DataPageCtrl {

  constructor(cfg) {
    // init DOM Elem
    this.elemRef = {};
    this.elemRef.header        = cfg.headerElem;
    this.elemRef.title         = cfg.titleElem;
    this.elemRef.description   = cfg.descElem;
    this.elemRef.customBlock   = cfg.customElem;

    // item Controller
    this.itemCtrl = cfg.itemCtrl;

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
  setCustomBlock(htmlText) {
    this.elemRef.customBlock.innerHTML = htmlText;
    this.elemRef.customBlock.classList.remove("hide");
  }
  
  // ================
  // Tabs
  enableTabs(cfg) {
    // render options
    this.elemRef.header.innerHTML = cfg.options
      .map(opt => `<div id="Tab-${opt.value}" class="itemlist__tab"><a href="javascript:void(0)">${opt.text}</a></div>`)
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
    this.elemRef.header.innerHTML = `<select class="itemlist__tab_dropdown">${elemArr.join('')}</select>`;
    const dropdownElem = this.elemRef.header.querySelector(`.itemlist__tab_dropdown`);

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
      elem_wrapper: document.querySelector(".itemlist__sort_wrapper"),
      elem_selector: document.querySelector(".itemlist__sort_select"),
      ...cfg,
    });
  }
  enableSimpleSearch(cfg) {
    this.itemCtrl.enableSimpleSearch({
      elem_wrapper: document.querySelector(".itemlist__searchbar_wrapper"),
      elem_input: document.querySelector(".itemlist__searchbar_input"),
      ...cfg,
    });
  }
  enableAdvanceSearch(cfg) {
    this.itemCtrl.enableAdvanceSearch({
      elem_btn:     document.querySelector(".itemlist__advsrch_btn"),
      elem_overlay: document.querySelector(".advsrch__overlay"),
      ...cfg,
    });
  }
  getItemContainerDOM() {
    return this.itemCtrl.elemRef.itemContainer;
  }
}