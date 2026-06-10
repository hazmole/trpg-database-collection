var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.enemy = function(itemData) {
  const titleModifyStyle = (itemData.name.length > 8)? `style="font-size:0.9em;"`: "";

	return `
		<div class="ListEntry Enemy">
			<div class="TitleCell fixWidth">
				<div class="title"><div ${titleModifyStyle}>${getNameDOM()}</div></div>
			</div>
		</div>`;
	
    // =================
	function getNameDOM() {
		return itemData.name;
	}
}