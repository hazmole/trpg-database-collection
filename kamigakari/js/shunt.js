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
        case "docs":   return `${BASE_URL}/pages/article.html`;
        case "custom": return pageItem.params.layout? `${BASE_URL}/${pageItem.params.layout}`: null;
      }
    }
    function getScriptUrl(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return `${BASE_URL}/pages/article.js`;
        case "custom": return pageItem.params.script? `${BASE_URL}/${pageItem.params.script}`: null;
      }
    }
    function getParams(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return { 
          url: pageItem.url,
          depth: pageItem.depth,
        };
        case "custom": return pageItem.params;
      }
    }
  }
}

