var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.item = function(data) {
  
  const titleModifyStyle = (data.name.length > 8)? `style="font-size:0.9em;"`: "";
  
  return `
    <div class="itemlist__entry boon">
      <div class="itemlist__entry_titleCell">
        <div class="tag">${getCategoryText()}</div>
        <div class="title"><div ${titleModifyStyle}>${getName()}</div></div>
      </div>
      <div class="itemlist__entry_blockCell" style="width:50px;">
        <div class="type ${data.type}"></div><div>${data.type}</div>
      </div>
      <div class="itemlist__entry_blockCell" style="width:40px; font-family:system-ui;">
        <div class="cost"></div><div>${getCost()}</div>
      </div>
      <div class="itemlist__entry_blockCell" style="width:60px; font-family:system-ui;">
        <div class="power"></div><div>${data.power}</div>
      </div>
      <div class="itemlist__entry_field" style="display:flex; flex-direction: column; gap: .3em;">${getEffect()}</div>
      ${getInfoIcon()}
    </div>`;
    // ================
    function getCategoryText(){
      if (data.category=="body") return `異骸`;
      return data.type;
    }
    function getName() {
      return data.name;
    }
    function getCost() {
      return data.cost == "-"? "無": data.cost; 
    }
    function getEffect(){
      const arr = [];
      if (data.effect.content) arr.push(`<div>${data.effect.content.join('<br>')}</div>`);
      if (data.effect.pros) arr.push(`<div class="body_pros"><b>優點</b>：${data.effect.pros}</div>`);
      if (data.effect.cons) arr.push(`<div class="body_cons"><b>缺點</b>：${data.effect.cons}</div>`);
      if (data.effect.tags) arr.push(`<div class="item_tags">${ data.effect.tags.map(t => {
        const parts = t.split("：");
        const mainTag = `<b>${parts[0]}</b>`;
        const attribute = (parts.length > 1)? `：${parts[1]}`: '';
        return `<span class="custom__item_tag hovertag__base"><div class="hovertag__window">${HoverBuilder.weaponTag(parts[0])}</div>[${mainTag}${attribute}]</span>`;
      }).join('') }</div>`);
      return arr.join('');
    }
    function getInfoIcon() {
      if (!data.desc)  return "";
      return `<div class="itemlist__entry_infobox" data-tooltip="${data.desc}"></div>`;
    }
};


