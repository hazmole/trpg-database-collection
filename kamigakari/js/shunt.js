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
        case "custom": return `${BASE_URL}/${pageItem.params.layout}`;
      }
    }
    function getScriptUrl(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return `${BASE_URL}/pages/article.js`;
        case "custom": return `${BASE_URL}/${pageItem.params.script}`;
      }
    }
    function getParams(pageItem) {
      switch(pageItem.handler) {
        case "docs":   return { url: pageItem.url };
        case "custom": return pageItem.params;
      }
    }
  }
}

