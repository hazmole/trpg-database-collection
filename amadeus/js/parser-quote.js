var CustomParser;
if(!CustomParser) CustomParser = {};

CustomParser.quote = function(data) {
  return `<div class="custom__article_quote_wrapper">
    <div class="custom__article_quote_content">${data.comment.join('<br>')}</div>
    <div class="custom__article_quote_author">—— ${data.author}</div>
  </div>`
}