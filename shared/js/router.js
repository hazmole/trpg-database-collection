class CoreRouter {
	constructor(config) {
		// define baseURL
		const isGitHub = window.location.hostname.includes('github.io');
		const folderName = window.location.pathname.split('/')[1];
		this.baseUrl = (isGitHub) ? `/${folderName}/` : '/';
		this.currentPid = null; // for record

		// define shunt
		this.shunt = config.shunt;
		this.SITE_TITLE = config.title;
		this.PAGE_MAP = config.pageMap;

		console.log("Router Initialized");
	}

	async run() {
		// Listen URL change
		window.addEventListener('popstate', () => this.loadPage());
		window.addEventListener('route-change', () => this.loadPage());
		
		// First loading
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.loadPage());
		} else {
			this.loadPage();
		}
	}

	async loadPage() {
		const urlParams = new URLSearchParams(window.location.search);
		const pid = urlParams.get('pid') || 'home';
		if (this.currentPid === pid) return ;

		try {
			this.currentPid = pid;

			const pageItem = this.PAGE_MAP[pid];
			this.renderSiteTitle(pageItem.title);
			if (this.shunt) {
				this.renderLayout(this.shunt.getLayoutUrl(pageItem));
				this.shunt.runHandler(pageItem);
			}
		} catch (error) {
			this.renderSiteTitle('');
			this.renderMainContainer('<h2 style="margin-left:1em;">404 - 找不到頁面</h2>');
		}
	}

	renderUnknownPage() {
		this.renderSiteTitle();
	}

	renderSiteTitle(titleText) {
		document.title = `${this.SITE_TITLE} - ${titleText}`;

		const siteTitleElem = document.getElementById("SiteTitle");
		if (siteTitleElem) {
			if (!titleText) titleText = "???";
			siteTitleElem.textContent = `${this.SITE_TITLE} - ${titleText}`;
		}
	}
	renderMainContainer(htmlText) {
		const containerElem = document.getElementById('ContentMain');
		if (containerElem) {
			containerElem.innerHTML = htmlText;
		}
	}

	async renderLayout(layoutUrl) {
		const template = await Fetcher.fetchHTML(`${this.baseUrl}${layoutUrl}`);
		this.renderMainContainer(template);
	}
};

class ShuntInterface {

	static getLayoutUrl(pageItem) {
		throw new Error("ShuntInterface must be implemented.");
	}

	static runHandler(pageItem) {
    throw new Error("ShuntInterface must be implemented.");
  }

}