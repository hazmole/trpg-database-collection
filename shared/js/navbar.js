class NavBarCtrl {

	constructor(siteTitle, indexMap) {
		// initialize
		this.SITE_TITLE = siteTitle;
		this.MOBILE_WIDTH = 768;
		this.indexMap = indexMap;
		this.elemColle = {};

		console.log("Navbar Initialized");
	}

	run() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this._run());
		} else {
			this.run();
		}
	}

	_run() {
		// fetch Element from document
		this.elemColle.menuElem        = document.getElementById("Menu");
		this.elemColle.menuToggleBtn   = document.getElementById("MenuToggleBtn");
		this.elemColle.iframeContext   = document.getElementById("ContentMain");

		// Render
		this._initMenuToggleBtn();
		this._renderNavBar();
		this._markElemActive();
	}

	_initMenuToggleBtn() {
		this.elemColle.menuToggleBtn.addEventListener('click', () => {
			this.elemColle.menuElem.classList.toggle('Unfold');
		});
		this.elemColle.iframeContext.addEventListener('click', () => {
			if (window.innerWidth <= this.MOBILE_WIDTH) {
				this.elemColle.menuElem.classList.remove('Unfold');
			}
		});
	}

	_renderNavBar() {
		var elemArr = this.indexMap.map((item) => { return genNavItemElem(item) });
		this.elemColle.menuElem.innerHTML = elemArr.join('');

		// ================
		function genNavItemElem(item) {
			if (!!item.members)
				return genNavGroupElem(item);
			else {
				return genNavLinkElem(item)
			}
		}
		function genNavLinkElem(linkItem) {
			const linkStyle = linkItem.style || "";
			const attr = [
				`onClick="NavBarCtrl.link(this)"`,
				`data-pid="${linkItem.pid}"`,
				`style="${linkStyle}"`,
			];
			return `<div class="NavLink" ${attr.join(' ')}">${linkItem.title}</div>`;
		}
		function genNavGroupElem(groupItem) {
			const groupStyle = groupItem.style || "";
			const memberArr = groupItem.members.map((item) => genNavItemElem(item));
			return `<div class="NavGroupOuter">
				<div class="NavGroupTitle" style="${groupStyle}" onClick="NavBarCtrl.toggleGroup(this)">${groupItem.title}</div>
				<div class="NavGroupInner">${memberArr.join('')}</div>
			</div>`;
		}
	}

	_markElemActive(pid) {
		const elemArr = document.querySelectorAll(`[data-pid="${pid}"]`);
		if (!elemArr || elemArr.length <= 0) return ;
		
		// toggle Active
		const elem = elemArr[0];
		elem.classList.add("Active");
		if (this.elemColle.activePageBtn) {
			this.elemColle.activePageBtn.classList.remove("Active");
		}
		this.elemColle.activePageBtn = elem;
		
		// unfold Parent Group
		let elemPointer = elem;
		while (elemPointer.id !== "Menu") {
			if (elemPointer.classList.contains("NavGroupOuter")) {
				elemPointer.classList.add("Unfold");
			}
			elemPointer = elemPointer.parentElement;
		}
	}
	

	static link(navLinkElem) {
		const pid = navLinkElem.attributes["data-pid"].value;
		const path = window.location.pathname;

		window.history.pushState({ additionalInformation: 'Updated the URL with JS' }, this.SITE_TITLE, path+`?pid=${pid}`);
		window.dispatchEvent(new CustomEvent('route-change'));
	}
	static toggleGroup(elem) {
		this._toggle(elem.parentElement, "Unfold");
	}
	static _toggle(elem, className) {
		if (elem.classList.contains(className)) {
			elem.classList.remove(className);
		} else {
			elem.classList.add(className);
		}	
	}
}
