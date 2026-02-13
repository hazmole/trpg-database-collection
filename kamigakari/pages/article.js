export async function run(params) {
  const parser = new ArticleParser();
  const jsonData = await Fetcher.fetchJSON(params.url);
  const tocDepth = params.depth || 2;

  parser.build(jsonData, tocDepth);
}