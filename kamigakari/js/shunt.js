class KamigakariShunt extends ShuntBase {

  constructor(pageItem) {
    super();

    const BASE_URL = 'kamigakari';

    this.layoutUrl = getLayoutUrl(pageItem) || '';
    this.scriptUrl = getScriptUrl(pageItem) || '';
    this.params = getParams(pageItem) || null;

    // ==================
    function getLayoutUrl(pageItem) {
      switch(pageItem.handler) {
        case "home":   return `${BASE_URL}/pages/home.html`;
        case "docs":   return `shared/pages/article.html`;
        case "data":   return `shared/pages/item-list.html`;
        case "custom": return pageItem.params.layout? `${BASE_URL}/${pageItem.params.layout}`: null;
      }
    }
    function getScriptUrl(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return `shared/pages/article.js`;
        case "data":   return `shared/pages/item-list.js`;
        case "custom": return pageItem.params.script? `${BASE_URL}/${pageItem.params.script}`: null;
      }
    }
    function getParams(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return { 
          url: pageItem.url,
          depth: pageItem.depth,
        };
        case "data":   return {
          script: `${BASE_URL}/${pageItem.script}`,
        };
        case "custom": return pageItem.params;
      }
    }
  }
}

