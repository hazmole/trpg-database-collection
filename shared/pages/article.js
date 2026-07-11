export async function run(params) {
  const parser = new ArticleParser({
    mainElem:   document.querySelector(".article__colume"),
    tocElem:    document.querySelector(".article__toc-container"),
    tocBtnElem: document.querySelector(".article__toc-toggle-btn"),
  });
  const jsonData = await Fetcher.fetchJSON(params.url);
  const tocDepth = params.depth || 2;
  
  parser.build(jsonData, tocDepth);

  // handle scrollTo page (after rendered)
  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    const elem = document.getElementById(`${decodeURI(id)}`);
    if (elem) elem.scrollIntoView();
  }
}