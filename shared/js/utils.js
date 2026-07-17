
const BlockUtils = {};

BlockUtils.block = function(){
  if (document.getElementById('BlockUIOverlay')) return ;

  const bgElem = document.createElement("div");
  bgElem.id = "BlockUIOverlay";
  bgElem.classList.add("block-ui__overlay");
	
  const iconElem = document.createElement("div");
  iconElem.classList.add("block-ui__icon");
  iconElem.innerHTML = `<div class="lds-dual-ring"></div>`;

  bgElem.append(iconElem)
	document.body.append(bgElem);
}
BlockUtils.unblock = function(){
  if (document.getElementById('BlockUIOverlay')) {
    document.getElementById('BlockUIOverlay').remove();
  }
}


const ToggleUtils = {};
ToggleUtils.click = function(currentElem) {
  const siblingElem = currentElem.parentNode.querySelector('.ToggleExpandContent');
  currentElem.classList.toggle('active');
  siblingElem.classList.toggle('active');
}

const WindowUtils = {};
WindowUtils.close = function(evt) {
  const layoutDOM = WindowUtils._getLayout();
  if (!evt || evt.target === layoutDOM) {   
    layoutDOM.classList.remove('active');
    WindowUtils.modalDOM.classList = "window__modal";
    WindowUtils.containerDOM.innerHTML = "";
  }
}
WindowUtils.open = function() {
  const layoutDOM = WindowUtils._getLayout();
  setTimeout(() => { layoutDOM.classList.add("active")}, 0);
}
WindowUtils.assignModalClass = function(classArr) {
  const layoutDOM = WindowUtils._getLayout();
  classArr.forEach(classname => {
    WindowUtils.modalDOM.classList.add(classname);
  });
}
WindowUtils.appendElement = function(htmlText) {
  const layoutDOM = WindowUtils._getLayout();
  WindowUtils.containerDOM.insertAdjacentHTML('beforeend', htmlText);
}
WindowUtils._getLayout = function() {
  if (!WindowUtils.layoutDOM) {
    layoutDOM = Utils.htmlToNode(`
      <div class="window__layout">
        <div class="window__modal">
          <button class="window__modal-close-btn">&times;</button>
          <div class="window__modal-container"></div>
        </div>
      </div>`);
    layoutDOM.addEventListener('click', (e) => { WindowUtils.close(e)} );
    layoutDOM.querySelector(".window__modal-close-btn").addEventListener('click', () => { WindowUtils.close()} );
    document.body.append(layoutDOM);

    WindowUtils.layoutDOM = layoutDOM;
    WindowUtils.modalDOM = layoutDOM.querySelector(".window__modal");
    WindowUtils.containerDOM = layoutDOM.querySelector(".window__modal-container");
  }
  return WindowUtils.layoutDOM;
}



const Utils = {};
Utils.getBaseURL = function() {
  const isGitHub = window.location.hostname.includes('github.io');
  const folderName = window.location.pathname.split('/')[1];
  return (isGitHub) ? `/${folderName}/` : '/';
}
Utils.htmlToNode = function(htmlText) {
	const template = document.createElement('template');
	template.innerHTML = htmlText.trim();

	const nNodes = template.content.childNodes.length;
	if (nNodes !== 1) {
		throw new Error(
			`html parameter must represent a single node; got ${nNodes}. ` +
			'Note that leading or trailing spaces around an element in your ' +
			'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
			'the element; call .trim() on your input to avoid this.'
		);
	}
	return template.content.firstChild;
}