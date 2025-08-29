// ===== API DE RICK AND MORTY =====

/**
 * Clase para manejar todas las peticiones a la API de Rick and Morty
 */
class RickAndMortyAPI {
  constructor() {
    this.baseURL = 'https://rickandmortyapi.com/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Realiza una petición HTTP con manejo de errores y caché
   * @param {string} url - URL de la petición
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Object>} Respuesta de la API
   */
  async fetchWithCache(url, options = {}) {
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
      return cachedData.data;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error en la petición:', error);
      throw new Error(`Error al conectar con la API: ${error.message}`);
    }
  }
  
  async getCharactersByEpisode(episodeName) {
    const episodeUrl = `${this.baseURL}/episode?name=${encodeURIComponent(episodeName)}`;
    const episodeResponse = await this.fetchWithCache(episodeUrl);

    if (episodeResponse.results.length === 0) {
        return [];
    }

    const characterUrls = episodeResponse.results.flatMap(episode => episode.characters);
    const characterIds = [...new Set(characterUrls)].map(url => Utils.extractIdFromUrl(url));
    
    return await this.getMultipleCharacters(characterIds);
  }

  /**
   * Obtiene todos los personajes con paginación
   * @param {number} page - Número de página
   * @returns {Promise<Object>} Datos de personajes
   */
  async getCharacters(page = 1) {
    const url = `${this.baseURL}/character?page=${page}`;
    return await this.fetchWithCache(url);
  }

  /**
   * Obtiene un personaje específico por ID
   * @param {number} id - ID del personaje
   * @returns {Promise<Object>} Datos del personaje
   */
  async getCharacter(id) {
    const url = `${this.baseURL}/character/${id}`;
    return await this.fetchWithCache(url);
  }

  /**
   * Búsqueda avanzada con múltiples filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {number} page - Número de página
   * @returns {Promise<Object>} Resultados filtrados
   */
  async searchCharacters(filters = {}, page = 1) {
    const params = new URLSearchParams();
    
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.species) params.append('species', filters.species);
    if (filters.gender) params.append('gender', filters.gender);
    
    params.append('page', page);
    
    const url = `${this.baseURL}/character?${params.toString()}`;
    return await this.fetchWithCache(url);
  }

  /**
   * Obtiene múltiples personajes por sus IDs
   * @param {Array<number>} ids - Array de IDs
   * @returns {Promise<Array>} Array de personajes
   */
  async getMultipleCharacters(ids) {
    if (!ids || ids.length === 0) {
      return [];
    }
    
    const url = `${this.baseURL}/character/${ids.join(',')}`;
    const result = await this.fetchWithCache(url);
    
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Obtiene múltiples episodios por sus IDs
   * @param {Array<number>} ids - Array de IDs de episodios
   * @returns {Promise<Array>} Array de episodios
   */
  async getMultipleEpisodes(ids) {
    if (!ids || ids.length === 0) {
      return [];
    }
    
    const url = `${this.baseURL}/episode/${ids.join(',')}`;
    const result = await this.fetchWithCache(url);
    
    return Array.isArray(result) ? result : [result];
  }
  
  /**
   * Obtiene todas las especies únicas de los personajes
   * @returns {Promise<Array<string>>} Array de especies
   */
  async getAllSpecies() {
    try {
      const cacheKey = 'all_species';
      const cachedSpecies = this.cache.get(cacheKey);
      
      if (cachedSpecies && Date.now() - cachedSpecies.timestamp < this.cacheTimeout) {
        return cachedSpecies.data;
      }

      const species = new Set();
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          const response = await this.getCharacters(page);
          
          response.results.forEach(character => {
            if (character.species) {
              species.add(character.species);
            }
          });

          hasNextPage = response.info.next !== null;
          page++;
          
          if (page > 5) {
            break;
          }
        } catch (error) {
          console.warn(`Error al obtener página ${page}:`, error);
          break;
        }
      }

      const speciesArray = Array.from(species).sort();
      
      this.cache.set(cacheKey, {
        data: speciesArray,
        timestamp: Date.now()
      });

      return speciesArray;
    } catch (error) {
      console.error('Error al obtener especies:', error);
      return [];
    }
  }
}

const api = new RickAndMortyAPI();

window.APIHelpers = {
  extractEpisodeIds(episodeUrls) {
    return episodeUrls.map(url => Utils.extractIdFromUrl(url)).filter(id => id !== null);
  },
  formatEpisode(episode) {
    return `${episode.episode} - ${episode.name}`;
  },
  handleAPIError(error) {
    if (error.message.includes('404')) {
      return 'No se encontraron resultados para tu búsqueda.';
    }
    return 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';
  }
};
