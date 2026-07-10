/**
 * @typedef {function(Object, Object, string): number} CompareFunction
 */
/**
 * @typedef {function(Object, any): boolean} MatchingFunction
 */
/**
 * @typedef {Object} BasicOption
 * @property {string} text - display text
 * @property {string} value - core value
 */
/**
 * @typedef {Object} SortingConfig
 * @property {boolean} enable
 * @property {string} sortKey
 * @property {CompareFunction} cmpFunc
 */
/**
 * @typedef {Object} SimpleSearchConfig
 * @property {boolean} enable
 * @property {string} keyword
 * @property {MatchingFunction} matchFunc
 */
/**
 * @typedef {Object} AdvanceSearchCfgOption
 * @property {string} type
 * @property {any} values
 * @property {MatchingFunction} matchFunc
 */
/**
 * @typedef {Object} AdvanceSearchConfig
 * @property {boolean} enable
 * @property {Record<string, AdvanceSearchCfgOption>} options
 */

export class ItemListCtrl {
  /** @type {Object} */
  elemRef;
  /** @type {Array} */
  items;
  /** @type {SortingConfig} */
  sortCfg;
  /** @type {SimpleSearchConfig} */
  simpleSearchCfg;
  /** @type {AdvanceSearchConfig} */
  advanceSearchCfg;

  constructor(cfg) {
    // define elemRef
    this.elemRef = {};
    this.elemRef.itemContainer = cfg.itemContainerElem;
    this.elemRef.SortBase = null;
    this.elemRef.SortSelector = null;
    this.elemRef.advanceSearchOverlay = null;

    this.items = cfg.items;
    this.parseFunc = cfg.parseFunc;

    // features
    this.sortCfg = {
      enable: false,
      sortKey: '',
      cmpFunc: null,
    };
    this.simpleSearchCfg = {
      enable: false,
      keyword: '',
      matchFunc: null,
    };
    this.advanceSearchCfg = {
      enable: false,
      options: {},
    };

  }

  setItems(newItems) { this.items = newItems; }
  setParseFunc(newFunc) { this.parseFunc = newFunc; }

  display() {
    var dItems = [...this.items];

    // simple-search
    if (this.simpleSearchCfg.enable) {
      dItems = dItems.filter((item) => {
        return this.simpleSearchCfg.matchFunc(
          item, 
          this.simpleSearchCfg.keyword);
      });
    }
    // advance-search
    if (this.advanceSearchCfg.enable) {
      dItems = dItems.filter((item) => {
        return Object.values(this.advanceSearchCfg.options).every(opt => {
          if (opt.type === "selection") {
            if (opt.values.length == 0) return true;
            return opt.matchFunc(item, opt.values);
          }
          if (opt.type === "range") {
            if (opt.values == null) return true;
            return opt.matchFunc(item, opt.values);
          }
          return true;
        });
      });
    }

    // sorting
    if (this.sortCfg.enable) {
      dItems.sort((a, b) => this.sortCfg.cmpFunc(a, b, this.sortCfg.sortKey));
    }

    // render
    this.elemRef.itemContainer.innerHTML = dItems
      .map(item => this.parseFunc(item))
      .join('');
  }

  /**
   * Enable Feature: Sorting
   * @param {Object} cfg
   * @param {string} cfg.elemID           - ID of Sorting DOM 
   * @param {string} cfg.elemID_selector  - ID of Sorting Dropdown DOM
   * @param {BasicOption[]} cfg.options    - options for Sorting
   * @param {CompareFunction} cfg.cmpFunc - compare function
   */
  enableSort(cfg) {
    // fetch DOM Elem
    const featureCfg = this.sortCfg;
    const baseDOM = cfg.elem_wrapper;
    const inputDOM = cfg.elem_selector;
    if (!baseDOM || !inputDOM) {
      console.error(`Cannot find element: ${cfg.elemID_selector}`);
      return ;
    }
    this.elemRef.SortBase = baseDOM;
    this.elemRef.SortSelector = inputDOM;
    
    // render options
    this.#Sort_RenderSeletorElem(cfg.options);
    
    // set config
    featureCfg.enable = true;
    featureCfg.sortKey = inputDOM.value;
    featureCfg.cmpFunc = cfg.cmpFunc;
    // render DOM
    baseDOM.classList.remove("hide");
  }
  reassignSort(cfg) {
    const featureCfg = this.sortCfg;
    if (cfg.options) {
      this.#Sort_RenderSeletorElem(cfg.options);
    }
  }
  #Sort_RenderSeletorElem(options) {
    const featureCfg = this.sortCfg;
    const inputDOM = this.elemRef.SortSelector;
    // render Elements
    inputDOM.innerHTML = options
      .map(opt => this.#DOM_SortOption(opt))
      .join('');
    // add onChange Listener
    inputDOM.addEventListener('change', e => {
      featureCfg.sortKey = e.target.value;
      this.display();
    });
    // set Default Value
    var defaultVal = options[0].value;
    if (featureCfg.sortKey !== null
      && options.map(opt => opt.value).includes(featureCfg.sortKey)) {
        defaultVal = featureCfg.sortKey;
    }
    inputDOM.value = defaultVal;
  }

  /**
   * Enable Feature: Simple-Search
   * @param {Object} cfg
   * @param {string} cfg.elem_wrapper  - DOM of Simple-Search Wrapper
   * @param {string} cfg.elem_input    - DOM of Simple-Search Input
   * @param {string} cfg.placeholder   - placeholder text
   * @param {MatchingFunction} cfg.matchFunc    - isMactch function
   */
  enableSimpleSearch(cfg) {
    // fetch DOM Elem
    const featureCfg = this.simpleSearchCfg;
    const elemDOM = cfg.elem_wrapper;
    const inputDOM = cfg.elem_input;
    if (!elemDOM || !inputDOM) {
      console.error(`Cannot find element`);
      return ;
    }
    
    // add listener
    inputDOM.addEventListener('change', e => {
      featureCfg.keyword = e.target.value;
      this.display();
    });
    if (cfg.placeholder) inputDOM.placeholder = cfg.placeholder;
    
    
    // set config
    featureCfg.enable = true;
    featureCfg.matchFunc = cfg.matchFunc;
    // render DOM
    elemDOM.classList.remove("hide");
  }

  /**
   * @typedef {Object} AdvanceSearchOption
   * @property {string} title
   * @property {string} type
   * @property {MatchingFunction} matchFunc
   * @property {BasicOption[]} list
   */
  /**
  /**
   * Enable Feature: Advance-Search
   * @param {Object} cfg
   * @param {string} cfg.elemID         - ID of Advance-Search DOM 
   * @param {string} cfg.elemID_btn     - ID of Advance-Search Button DOM
   * @param {string} cfg.elemID_overlay - ID of Advance-Search Overlay DOM
   * @param {AdvanceSearchOption[]} cfg.options - options for AdvSearch
   */
  enableAdvanceSearch(cfg) {
    // fetch DOM Elem
    const featureCfg = this.advanceSearchCfg;
    const btnDOM = cfg.elem_btn;
    const overlayDOM = cfg.elem_overlay;
    const overlayBodyDOM = overlayDOM.querySelector(".advsrch__modal-body");
    const overlayCloseBtnDOM = overlayDOM.querySelector(".advsrch__modal-close-btn");
    if (!btnDOM || !overlayDOM) {
      console.error(`Cannot find element: ${cfg.elemID}`);
      return ;
    }
    this.elemRef.advanceSearchOverlay = overlayDOM;

    // add listener
    btnDOM.addEventListener('click', () => { this.openAdvanceSearchOverlay(); });
    overlayDOM.addEventListener('click', (e) => { this.closeAdvanceSearchOverlay(e); });
    overlayCloseBtnDOM.addEventListener('click', () => { this.closeAdvanceSearchOverlay(); });
    
    // render advance options
    overlayBodyDOM.innerHTML = "";
    cfg.options.forEach(opt => {
      // initial config
      const optConfig = {
        type: opt.type,
        matchFunc: opt.matchFunc,
      };
      featureCfg.options[opt.title] = optConfig;
      // draw container
      overlayBodyDOM.insertAdjacentHTML('beforeend', this.#DOM_AdvSearchOptContainer(opt));
      const containerDOM = overlayBodyDOM.querySelector(".advsrch__option-wrapper:last-child").querySelector(".advsrch__option-content");
      // draw contents
      switch(opt.type) {

      case "selection":
        optConfig.values = []; // array
        opt.list.forEach(selectOpt => {
          containerDOM.insertAdjacentHTML('beforeend', this.#DOM_AdvSearchOpt_SelectionBtn(selectOpt));
          const selectItemDOM = containerDOM.querySelector(".select-item:last-child");
          selectItemDOM.addEventListener('click', () => {
            const idx = optConfig.values.indexOf(selectOpt.value);
            if (idx < 0) {
              // add
              optConfig.values.push(selectOpt.value);
              selectItemDOM.classList.add("yes");
            } else {
              // remove
              optConfig.values.splice(idx, 1)
              selectItemDOM.classList.remove("yes");
            }
            this.display();
          });
        });
        break;
      
      case "range":
        optConfig.values = null;
        containerDOM.insertAdjacentHTML('beforeend', this.#DOM_AdvSearchOpt_DualSlider());
        const minValDOM = containerDOM.querySelector(".range-min-value");
        const maxValDOM = containerDOM.querySelector(".range-max-value");
        const sliderDOM = containerDOM.querySelector(".dual-slider");

        var rangeWidth = (opt.max - opt.min +1);
        var density = Math.floor(100 / rangeWidth);

        noUiSlider.create(sliderDOM, {
          start: [opt.min, opt.max],
          connect: true,
          step: 1,
          range: {
            'min': opt.min,
            'max': opt.max,
          },
          pips: {
            mode: 'values',
            values: [1, 5, 10, 15, 20], // 這些數字上會顯示大刻度與數字文字
            density: density,  // 刻度的密集度（百分比），數值越小，小刻度越多
            stepped: true      // 讓小刻度自動對齊你的 step 步長（1等一格）
          }
        });
        sliderDOM.noUiSlider.on('update', (values, handle) => {
          const minVal = Math.round(values[0]);
          const maxVal = Math.round(values[1]);
          if (minVal == opt.min && maxVal == opt.max) {
            optConfig.values = null;
          } else {
            optConfig.values = { min: minVal, max: maxVal };
          }
          minValDOM.textContent  = minVal;
          maxValDOM.textContent  = maxVal;
          this.display();
        });
      }
    });

    // set config
    featureCfg.enable = true;
    featureCfg.matchFunc = cfg.matchFunc;
    // render DOM
    btnDOM.classList.remove("hide");
  }

  // ========================
  // User Trigger Event
  openAdvanceSearchOverlay() {
    this.elemRef.advanceSearchOverlay.classList.add('active');
  }
  closeAdvanceSearchOverlay(evt) {
    if (!evt || evt.target === this.elemRef.advanceSearchOverlay)
      this.elemRef.advanceSearchOverlay.classList.remove('active');
  }

  // ========================
  // DOM render
  #DOM_SortOption(opt) {
    return `<option value="${opt.value}"><span class="label">${opt.text}</span></option>`;
  }
  #DOM_AdvSearchOptContainer(opt) {
    return `<div class="advsrch__option-wrapper">
        <div class="advsrch__option-title">${opt.title}</div>
        <div class="advsrch__option-content" data-search-type="${opt.type}"></div>
      </div>`;
  }
  #DOM_AdvSearchOpt_SelectionBtn(opt) {
    return `<div class="select-item" data-search-value="${opt.value}">${opt.text}</div>`;
  }
  #DOM_AdvSearchOpt_DualSlider() {
    return `
      <div class="dual-slider-text range-min-value"></div>
      <div class="dual-slider custom-nouislider"></div>
      <div class="dual-slider-text range-max-value"></div>`
  }
}