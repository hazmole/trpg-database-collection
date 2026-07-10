
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


const Utils = {};
Utils.getBaseURL = function() {
  const isGitHub = window.location.hostname.includes('github.io');
  const folderName = window.location.pathname.split('/')[1];
  return (isGitHub) ? `/${folderName}/` : '/';
}
Utils.htmlToNode = function(htmlText) {
	const template = document.createElement('template');
	template.innerHTML = htmlText;

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