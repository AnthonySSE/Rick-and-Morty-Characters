// ===== API DE RICK AND MORTY =====

class RickAndMortyAPI {
  constructor() {
    this.baseURL = 'https://rickandmortyapi.com/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  async fetchWithCache(url, options = {}) {
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
      return cachedData.data;
    }
    try {
      const response = await fetch(url, { ...options });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error en la petición:', error);
      throw new Error(`Error al conectar con la API: ${error.message}`);
    }
  }

  async getAllEpisodes() {
    const cacheKey = 'all_episodes';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
    }

    let allEpisodes = [];
    let page = 1;
    let hasNextPage = true;
    while(hasNextPage) {
        const url = `${this.baseURL}/episode?page=${page}`;
        const response = await this.fetchWithCache(url);
        allEpisodes.push(...response.results);
        hasNextPage = response.info.next !== null;
        page++;
    }
    this.cache.set(cacheKey, { data: allEpisodes, timestamp: Date.now() });
    return allEpisodes;
  }

  async getCharactersByEpisodeId(episodeId) {
    const episode = await this.fetchWithCache(`${this.baseURL}/episode/${episodeId}`);
    const characterIds = episode.characters.map(url => Utils.extractIdFromUrl(url)).filter(id => id !== null);
    return await this.getMultipleCharacters(characterIds);
  }

  async getCharacters(page = 1) {
    return await this.fetchWithCache(`${this.baseURL}/character?page=${page}`);
  }

  async searchCharacters(filters = {}, page = 1) {
    const params = new URLSearchParams({ page });
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.species) params.append('species', filters.species);
    return await this.fetchWithCache(`${this.baseURL}/character?${params.toString()}`);
  }

  async getMultipleCharacters(ids) {
    if (!ids || ids.length === 0) return [];
    const result = await this.fetchWithCache(`${this.baseURL}/character/${ids.join(',')}`);
    return Array.isArray(result) ? result : [result];
  }

  async getMultipleEpisodes(ids) {
    if (!ids || ids.length === 0) return [];
    const result = await this.fetchWithCache(`${this.baseURL}/episode/${ids.join(',')}`);
    return Array.isArray(result) ? result : [result];
  }
  
  async getAllSpecies() {
    const cacheKey = 'all_species';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
    }
    const species = new Set();
    let page = 1;
    let hasNextPage = true;
    while (hasNextPage && page <= 5) { // Limit to 5 pages
      const response = await this.getCharacters(page);
      response.results.forEach(c => c.species && species.add(c.species));
      hasNextPage = response.info.next !== null;
      page++;
    }
    const speciesArray = Array.from(species).sort();
    this.cache.set(cacheKey, { data: speciesArray, timestamp: Date.now() });
    return speciesArray;
  }
}

const api = new RickAndMortyAPI();

window.APIHelpers = {
  extractEpisodeIds: (urls) => urls.map(url => Utils.extractIdFromUrl(url)).filter(id => id !== null),
  formatEpisode: (ep) => `${ep.episode} - ${ep.name}`,
  handleAPIError: (err) => err.message.includes('404') ? 'No se encontraron resultados.' : 'Ha ocurrido un error inesperado.',
};