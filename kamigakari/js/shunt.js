class KamigakariShunt extends ShuntInterface {

  static BASE_URL = 'kamigakari';

  static getLayoutUrl(pageItem) {
		switch(pageItem.handler) {
      case "home": return `${this.BASE_URL}/pages/home.html`;
      case "docs": return `${this.BASE_URL}/pages/article.html`;
    }
	}

  static runHandler(pageItem) {
    switch(pageItem.handler) {
      case "home": return ;
      case "docs": {
        return renderDocHandler(pageItem.params.jsonUrl);
      }
    }
  }
}





async function renderDocHandler(jsonUrl) {
  const parser = new ArticleParser();
  const jsonData = await Fetcher.fetchJSON(jsonUrl);

  parser.build(jsonData);

}