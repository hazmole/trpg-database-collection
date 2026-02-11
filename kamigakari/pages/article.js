export async function run(params) {
  const parser = new ArticleParser();
  const jsonData = await Fetcher.fetchJSON(params.url);

  parser.build(jsonData);
}