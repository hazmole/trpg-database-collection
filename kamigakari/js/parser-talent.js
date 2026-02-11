var Parser;
if(!Parser) Parser = {};

Parser.talent = function(talent) {
  
  const titleModifyStyle = (talent.name.length > 8)? `style="font-size:0.9em;"`: "";
  
  return `
    <div class="ListEntry Talent">
      <div class="TitleCell fixWidth">
        <div class="tag">${getCategoryText()}</div>
        <div class="title"><div ${titleModifyStyle}>${getName()}</div></div>
      </div>
      <div class="blockCell fixWidth">
        <div class="timing"><div>${talent.phase.join('/')}</div></div>
      </div>
      <div class="blockCell fixWidth">
        <div class="range"><div>${talent.range}</div></div>
      </div>
      <div class="blockCell fixWidth">
        <div class="target"><div>${getFmtTarget()}</div></div>
      </div>
      <div class="blockCell fixWidth">
        <div class="cost"><div>${talent.cost.join('、')}</div></div>
      </div>
      <div class="field">${getEffect()}</div>
    </div>`;
    // ================
    function getCategoryText(){
      var arr = talent.type.split('-');
      switch(arr[0]){
        case "ancestry": arr[0]="種族"; break;
        case "AS":       arr[0]="稱號"; break;
        case "common":
          switch(arr[1]){
            case "ancestry":   arr[0]="共通種族"; arr.length=1; break;
            case "normal":     arr[0]="共通"; arr.length=1; break;
            case "advanced5":  arr[0]="高等"; arr[1]="5等"; break;
            case "advanced10": arr[0]="高等"; arr[1]="10等"; break;
            case "advanced15": arr[0]="高等"; arr[1]="15等"; break;
            case "advanced20": arr[0]="高等"; arr[1]="20等"; break;
          }
          break;
      }
      return `${arr.join('-')}`;
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
