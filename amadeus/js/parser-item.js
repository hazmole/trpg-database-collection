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
        return `<span class="custom__item_tag" data-tooltip="${parts[0]}：${GetTagExplain(parts[0])}">[${mainTag}${attribute}]</span>`;
      }).join('') }</div>`);
      return arr.join('');
    }
    function getInfoIcon() {
      if (!data.desc)  return "";
      return `<div class="itemlist__entry_infobox" data-tooltip="${data.desc}"></div>`;
    }
};


function GetTagExplain(tagText) {
  const n = getLastNumber(tagText)
  if (tagText == ("接近")) return `若同段落的威脅尚未行動，則只能選擇其作為攻擊目標。`;
  if (tagText == ("變幻")) return `擲 1D6 隨機選擇對應段落的威脅作為攻擊目標。若對應段落沒有目標，則改為自由決定。`;
  if (tagText.startsWith("迎擊")) return `攻擊威脅時，傷害 +${n} 點。`;
  if (tagText.startsWith("格擋")) return `攻擊後，該輪期間的防禦判定得到 +${n} 修正。`;
  if (tagText.startsWith("必殺")) return `若攻擊時發生大成功，傷害 +${n}D6 點。`;
  if (tagText.startsWith("精度")) return `攻擊時的命中判定得到 ${ n<0? n: `+${n}` } 修正。`;
  if (tagText.startsWith("安定")) return `決定攻擊傷害時，視作每顆骰都擲出了 ${n}。`;
  if (tagText.startsWith("裝甲")) return `攻擊後，該輪期間受到的傷害減輕 ${n}D6 點。`;
  if (tagText == ("對空A")) return `攻擊飛行狀態的目標時，命中判定得到 +1 修正，威力上升 2D6。`;
  if (tagText == ("對空B")) return `攻擊飛行狀態的目標時，命中判定得到 +1 修正，威力上升 2D6。攻擊後消耗該武器。`;
  if (tagText == ("對潛A")) return `攻擊潛水狀態的目標時，命中判定得到 +1 修正，威力上升 2D6。`;
  if (tagText == ("對潛B")) return `攻擊潛水狀態的目標時，命中判定得到 +1 修正，威力上升 2D6。攻擊後消耗該武器。`;
  if (tagText.startsWith("靈擊")) return `攻擊後，該輪期間的妨礙判定得到 +${n} 修正。`;
  if (tagText.startsWith("華麗")) return `決定攻擊傷害時，可以將 ${n} 顆傷害骰轉化為氛圍骰。(轉化後的骰子不會計入傷害)`;
  if (tagText.startsWith("特攻")) return `對符合標籤的目標攻擊時，威力上升 1D6。這個效果不會疊加。`;
  if (tagText.startsWith("減輕")) return `裝備期間，受到符合標籤的目標的傷害時，使傷害減輕 ${n} 點。這個效果不會疊加。`;
  if (tagText.startsWith("毒")) return `造成傷害後，使攻擊目標獲得 [重傷${n}] 變調。`;
  if (tagText == ("樂器")) return `攻擊時，可以消費 1D6【生命力】，改為用【愛】進行命中判定。`;
  if (tagText.startsWith("騎乘")) return `裝備期間，移動判定得到 +${n} 修正。`;
  if (tagText == ("靈氣")) return `攻擊帶有 [詛咒] 標籤的目標時，攻擊自動命中（達成值視為 6）。此外，若目標未持有 [靈氣] 道具，則無法進行防禦判定。`;
  if (tagText == ("易用")) return `攻擊時，可以改為用【愛】進行命中判定。且命中判定時的能力值階級 D 被視為 C。`;
  if (tagText == ("巨殺")) return `攻擊本體或威脅時，傷害上升等同其等級的數值。`;
  if (tagText == ("咒葬")) return `必須消費 1 個【供品】或放置 1 個黑色因果才能進行攻擊。`;
  if (tagText == ("崩壞")) return `若攻擊時發生大失敗，此武器破壞。`;
  if (tagText.startsWith("維持")) return `結束階段時，若不消費 ${n} 個【神貨】，此武器就會消失。`;
  if (tagText == ("大振")) return `攻擊時的命中判定，選擇骰面 2 作為行動骰也會發生大失敗。`;
  if (tagText == ("野性")) return `此武器的威力上升「自己屬性的覺醒階段-1」D6 點。`;
  return "???";

  function getLastNumber(str) {
    const match = str.match(/[+-]?\d+/);
    return match ? Number(match[0]) : null;
  }
}