var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.faq = function(entryItem) {
  // ReqField: title, reference, Q, A
  return `<div class="faq-entry">
    <div class="faq-title">■ FAQ ${entryItem.title}</div>
    <div class="faq-ref">${entryItem.reference}</div>
    <div class="faq-text"><b>Q: ${entryItem.Q}</b></div>
    <div class="faq-text"><b>A</b>: ${entryItem.A}</div>
  </div>`
}