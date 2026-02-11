
const BlockUtils = {};

BlockUtils.block = function(){
  if (document.getElementById('BlockUI-background')) return ;
  if (document.getElementById('BlockUI-loading-icon')) return ;

  const bgElem = document.createElement("div");
  bgElem.id = "BlockUI-background";
	
  const iconElem = document.createElement("div");
  iconElem.id = "BlockUI-loading-icon";
  iconElem.innerHTML = `<div class="lds-dual-ring"></div>`;

	document.body.append(bgElem, iconElem);
}
BlockUtils.unblock = function(){
  document.getElementById('BlockUI-background').remove();
  document.getElementById('BlockUI-loading-icon').remove();
}