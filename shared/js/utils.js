
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