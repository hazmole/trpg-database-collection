class Fetcher {

  static async fetchHTML(path) {
      const response = await this._fetchFile(path);
      return await response.text();
  }

  static async fetchJSON(path) {
        const response = await this._fetchFile(path);
      return await response.json();
  }

  static async _fetchFile(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  }

};