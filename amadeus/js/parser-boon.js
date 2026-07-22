var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.boon = function(data) {
  
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
      <div class="itemlist__entry_blockCell" style="width:100px;">
        <div class="factor"></div><div>${getFactor()}</div>
      </div>
      <div class="itemlist__entry_blockCell" style="width:50px;">
        <div class="check"></div><div>${data.check}</div>
      </div>
      <div class="itemlist__entry_blockCell" style="width:120px;">
        <div class="tags"></div><div>${data.tags.map(t => `[${t}]`).join('')}</div>
      </div>
      <div class="itemlist__entry_field">${getEffect()}</div>
      ${getInfoIcon()}
    </div>`;
    // ================
    function getCategoryText(){
      const parts = data.category.split('-');
      switch(parts[0]){
        case "background": return `背景-${parts[1]}`;
        case "diety":      return `親神-${parts[1]}`;
        case "dcluster":   return `${parts[1]}神群`;
      }
      return `${parts.join('-')}`;
    }
    function getInfoIcon() {
      if (!data.desc)  return "";
      return `<div class="itemlist__entry_infobox" data-tooltip="${data.desc}"></div>`;
    }
    function getName(){
      return data.name;
    }
    function getFactor(){
      return [...data.factor].map(f => {
        var className = "";
        switch (f) {
        case "紅": className = "red"; break;
        case "藍": className = "blu"; break;
        case "綠": className = "grn"; break;
        case "白": className = "wht"; break;
        case "黑": className = "blk"; break;
        }
        return `<span class="factor-${className}">${f}</span>`;
      }).join('');
    }
    function getEffect(){
      return Array.isArray(data.effect)? data.effect.join('<br>'): data.effect.replace(/\n/g, '<br>');
    }
};
