class CoreRouter {

	static SITE_TITLE = "";

	constructor(config) {
		// define baseURL
		const isGitHub = window.location.hostname.includes('github.io');
		const folderName = window.location.pathname.split('/')[1];
		this.baseUrl = (isGitHub) ? `/${folderName}/` : '/';
		this.currentPid = null; // for record

		// define shunt
		this.shuntClass = config.shunt;
		this.PAGE_MAP = config.pageMap;
		CoreRouter.SITE_TITLE = config.title;

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

			const pageInfo = this.PAGE_MAP[pid];
			this.renderSiteTitle(pageInfo.title);
			if (this.shuntClass) {
				const pageHdlr = new this.shuntClass(pageInfo);

				BlockUtils.block();
				await this.renderLayout(pageHdlr.layoutUrl);
				await this.runScript(pageHdlr.scriptUrl, pageHdlr.params);
			}
		} catch (err) {
			this.renderSiteTitle('');
			this.renderMainContainer('<h2 style="margin-left:1em;">404 - 找不到頁面</h2>');
			console.error(err);
		} finally {
			BlockUtils.unblock();
		}
	}

	renderUnknownPage() {
		this.renderSiteTitle();
	}

	renderSiteTitle(titleText) {
		document.title = `${CoreRouter.SITE_TITLE} - ${titleText}`;

		const siteTitleElem = document.getElementById("SiteTitle");
		if (siteTitleElem) {
			if (!titleText) titleText = "???";
			siteTitleElem.textContent = `${CoreRouter.SITE_TITLE} - ${titleText}`;
		}
	}
	renderMainContainer(htmlText) {
		const containerElem = document.getElementById('ContentMain');
		if (containerElem) {
			containerElem.innerHTML = htmlText;
		}
	}

	async renderLayout(layoutUrl) {
		if (!layoutUrl) return ;
		const template = await Fetcher.fetchHTML(`${this.baseUrl}${layoutUrl}`);
		this.renderMainContainer(template);
	}
	async runScript(scriptUrl, scriptParams) {
		if (!scriptUrl) return ;
		const module = await import(`${this.baseUrl}${scriptUrl}`);
		await module.run(scriptParams);
	}


	static setSiteTitle(titleText) {
		document.title = `${CoreRouter.SITE_TITLE} - ${titleText}`;
	}
	static setUrlParams(key, val) {
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set(key, val);

		const path = window.location.pathname;
		window.history.pushState({ additionalInformation: 'Updated the URL with JS' }, '', path+`?${urlParams.toString()}`);
	}
};

class ShuntBase {

	constructor(_pageItem) {
		this.layoutUrl = '';
    this.scriptUrl = '';
    this.params = null;
	}


}