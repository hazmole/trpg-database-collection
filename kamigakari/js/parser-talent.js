var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.talent = function(talent) {
  
  const titleModifyStyle = (talent.name.length > 8)? `style="font-size:0.9em;"`: "";
  
  return `
    <div class="ListEntry Talent">
      <div class="TitleCell fixWidth">
        <div class="tag">${getCategoryText()}</div>
        <div class="title"><div ${titleModifyStyle}>${getName()}</div></div>
      </div>
      <div class="blockCell fixWidth">
        <div class="timing"></div><div>${talent.phase.join('/')}</div>
      </div>
      <div class="blockCell fixWidth">
        <div class="range"></div><div>${talent.range}</div>
      </div>
      <div class="blockCell fixWidth">
        <div class="target"></div><div>${getFmtTarget()}</div>
      </div>
      <div class="blockCell fixWidth">
        <div class="cost"></div><div>${talent.cost.join('、')}</div>
      </div>
      <div class="field">${getEffect()}</div>
      ${getInfoIcon()}
    </div>`;
    // ================
    function getCategoryText(){
      const parts = talent.type.split('-');
      switch(parts[0]){
        case "boss":     parts[0]="BOSS"; break;
        case "innate":   parts[0]="潛在特性"; break;
        case "ancestry": parts[0]="種族"; break;
        case "AS":       parts[0]="稱號"; break;
        case "common":
          switch(parts[1]){
            case "ancestry":   parts[0]="共通種族"; parts.length=1; break;
            case "normal":     parts[0]="共通"; parts.length=1; break;
            case "advanced5":  parts[0]="高等"; parts[1]="5等"; break;
            case "advanced10": parts[0]="高等"; parts[1]="10等"; break;
            case "advanced15": parts[0]="高等"; parts[1]="15等"; break;
            case "advanced20": parts[0]="高等"; parts[1]="20等"; break;
          }
          break;
      }
      return `${parts.join('-')}`;
    }
    function getInfoIcon() {
      if (!talent.desc)  return "";
      return `<div class="info-box" data-tooltip="${talent.desc}"></div>`;
    }
    function getName(){
      var prefix = "";

      if(talent.isLimit==1) prefix="●";
      else if(talent.isLimit==2) prefix="◎";
      else if(talent.isDefault==true) prefix="※";
      else prefix="";

      return `<font class="PrefixIcon ${prefix==""? "IndentSpace": ""}">${prefix}</font>` + talent.name;
    }
    function getEffect(){
      return Array.isArray(talent.effect)? talent.effect.join('<br>'): talent.effect.replace(/\n/g, '<br>');
    }
    function getFmtTarget(){
      var arr = talent.target.split(/[（）]/);
      if(arr.length>1){
        return `${arr[0]}<br>（${arr[1]}）`;
      }
      return arr[0];
  }
};
