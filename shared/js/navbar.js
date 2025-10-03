const ScreenMinWidthConfig = 640;
var SYSTEM_TITLE, INDEX;

const NavBarCtrl = {

  elemColle: {},
  pageIdxArr: [],

  init: function() {
    // Define Element ID
    this.elemColle.headerTitleElem = document.getElementById("Header-Title");
    this.elemColle.menuElem        = document.getElementById("Menu");
    this.elemColle.iframeContext   = document.getElementById("Context");

    // Render Navigation Menu
    this.renderNavBar();
    this.goToDefaultPage();
  },

  renderNavBar: function() {
    const self = this;
    var elemArr = INDEX.map((item, idx) => { return genNavItemElem(item, idx) });
    this.elemColle.menuElem.innerHTML = elemArr.join('');

    // ================
    function genNavItemElem(item, idx) {
      if (!!item.members)
        return genNavGroupElem(item, idx);
      else {
        self.pageIdxArr.push("" + idx);
        return genNavLinkElem(item, idx)
      }
    }
    function genNavLinkElem(linkItem, idx) {
      const attr = [
        `onClick="link(this)"`,
        `data-idx="${idx}"`
      ];
      return `<div class="NavLink" ${attr.join(' ')}">${linkItem.title}</div>`;
    }
    function genNavGroupElem(groupItem, groupIdx) {
      const idx_prefix = groupIdx + '-';
      const groupStyle = groupItem.style || "";
      const memberArr = groupItem.members.map((item, idx) => genNavItemElem(item, idx_prefix + idx));
      return `<div class="NavGroupOuter">
        <div class="NavGroupTitle" style="${groupStyle}" onClick="toggleGroup(this)">${groupItem.title}</div>
        <div class="NavGroupInner">${memberArr.join('')}</div>
      </div>`;
    }
  },

  goToDefaultPage: function() {
    // Read URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlPageIdx = urlParams.get('p');
    
    if (this.pageIdxArr.includes(urlPageIdx)) {
      this.goToPage(urlPageIdx);
    } else {
      this.goToPage(this.pageIdxArr[0]);
    }
  },

  goToPage: function(indexTicket) {
    const idxArr = indexTicket.split("-");
    let arrPointer = INDEX;
    let pageItem = null;
    for (idx of idxArr) {
      const item = arrPointer[parseInt(idx)];
      if (!!item.members) arrPointer = item.members;
      else {
        pageItem = item;
      }
    }

    // Modify Iframe
    this.elemColle.iframeContext.src = pageItem.url;
    // Modify URL
    const path = window.location.pathname
    window.history.pushState({ additionalInformation: 'Updated the URL with JS' }, SYSTEM_TITLE, path+`?p=${indexTicket}`);
    // Modify Title
    const title = this.getTitleText(pageItem.title);
    document.title = title;
    this.elemColle.headerTitleElem.textContent = title;

    // find & Mark Active
    this.markElemActive(indexTicket);
  },

  markElemActive: function(index) {
    const elemArr = document.querySelectorAll(`[data-idx="${index}"]`);
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
  },

  getTitleText: function(pageTitle) {
    return `${SYSTEM_TITLE} - ${pageTitle}`;
  }
}


/* interactive API for Elements */
function link(elem) {
  if (NavBarCtrl.elemColle.activePageBtn == elem) return ;

  const elemIdx = elem.attributes["data-idx"].value;
  NavBarCtrl.goToPage(elemIdx);
}
function toggleMenu() {
  const navBarElem = document.getElementById("Menu");
  toggle(navBarElem, "Unfold");
}
function toggleGroup(elem) {
  toggle(elem.parentElement, "Unfold");
}
function toggle(elem, className) {
  if (elem.classList.contains(className)) {
    elem.classList.remove(className);
  } else {
    elem.classList.add(className);
  }	
}