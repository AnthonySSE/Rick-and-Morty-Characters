// ===== APLICACIÓN PRINCIPAL RICK AND MORTY =====

class RickAndMortyApp {
  constructor() {
    this.currentPage = 1;
    this.currentFilters = { name: '', status: '', species: '', episode: '' };
    this.characters = [];
    this.totalPages = 1;
    this.totalCharacters = 0;
    this.isLoading = false;
    this.isFavoritesView = false;
    this.favorites = Utils.StorageManager.get('favorites', []);
    this.themeManager = new Utils.ThemeManager();
    this.init();
  }

  async init() {
    this.bindElements();
    this.bindEvents();
    await this.loadInitialData();
  }

  bindElements() {
    this.elements = {
      searchInput: document.getElementById('searchInput'),
      episodeInput: document.getElementById('episodeInput'),
      statusFilter: document.getElementById('statusFilter'),
      speciesFilter: document.getElementById('speciesFilter'),
      clearFilters: document.getElementById('clearFilters'),
      favoritesBtn: document.getElementById('favoritesBtn'),
      resultsCount: document.getElementById('resultsCount'),
      charactersGrid: document.getElementById('charactersGrid'),
      loadingSpinner: document.getElementById('loadingSpinner'),
      errorMessage: document.getElementById('errorMessage'),
      retryBtn: document.getElementById('retryBtn'),
      modalOverlay: document.getElementById('modalOverlay'),
      modalContent: document.getElementById('modalContent'),
      modalClose: document.getElementById('modalClose'),
      prevCharacter: document.getElementById('prevCharacter'),
      nextCharacter: document.getElementById('nextCharacter'),
      themeToggle: document.getElementById('themeToggle'),
      backToTop: document.getElementById('backToTop')
    };
  }

  bindEvents() {
    const debouncedSearch = Utils.debounce(() => this.handleSearch(), 500);
    this.elements.searchInput.addEventListener('input', debouncedSearch);
    this.elements.episodeInput.addEventListener('input', debouncedSearch);
    this.elements.statusFilter.addEventListener('change', () => this.handleFilterChange());
    this.elements.speciesFilter.addEventListener('change', () => this.handleFilterChange());
    this.elements.clearFilters.addEventListener('click', () => this.clearAllFilters());
    this.elements.favoritesBtn.addEventListener('click', () => this.toggleFavoritesView());
    this.elements.modalClose.addEventListener('click', () => this.closeModal());
    this.elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.elements.modalOverlay) this.closeModal();
    });
    this.elements.prevCharacter.addEventListener('click', () => this.showPreviousCharacter());
    this.elements.nextCharacter.addEventListener('click', () => this.showNextCharacter());
    this.elements.themeToggle.addEventListener('click', () => this.themeManager.toggle());
    this.elements.retryBtn.addEventListener('click', () => this.loadCharacters());
    this.elements.backToTop.addEventListener('click', () => Utils.scrollToTop());
    
    const throttledScroll = Utils.throttle(() => this.handleScroll(), 200);
    window.addEventListener('scroll', throttledScroll);
  }

  async loadInitialData() {
    Utils.showLoading();
    try {
      await this.loadSpecies();
      await this.loadCharacters();
    } catch (error) {
      Utils.showError(APIHelpers.handleAPIError(error));
    } finally {
      Utils.hideLoading();
    }
  }

  async loadSpecies() {
    try {
      const species = await api.getAllSpecies();
      const speciesFilter = this.elements.speciesFilter;
      species.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        speciesFilter.appendChild(option);
      });
    } catch (error) {
      console.warn('Error al cargar especies:', error);
    }
  }

  async loadCharacters(append = false) {
    if (this.isLoading) return;
    this.isLoading = true;
    Utils.showLoading();
    Utils.hideError();

    try {
        let response;
        if (this.isFavoritesView) {
            let favoriteChars = await api.getMultipleCharacters(this.favorites);
            // Apply other filters on top of favorites
            const { name, status, species } = this.currentFilters;
            if (name) {
                favoriteChars = favoriteChars.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
            }
            if (status) {
                favoriteChars = favoriteChars.filter(c => c.status.toLowerCase() === status.toLowerCase());
            }
            if (species) {
                favoriteChars = favoriteChars.filter(c => c.species.toLowerCase() === species.toLowerCase());
            }
            response = { results: favoriteChars, info: { pages: 1, count: favoriteChars.length } };
        } else if (this.currentFilters.episode) {
            const episodeChars = await api.getCharactersByEpisode(this.currentFilters.episode);
            response = { results: episodeChars, info: { pages: 1, count: episodeChars.length } };
        } else {
            response = await api.searchCharacters(this.currentFilters, this.currentPage);
        }

      if (append) {
        this.characters.push(...response.results);
      } else {
        this.characters = response.results;
      }
      
      this.totalPages = response.info ? response.info.pages : 1;
      this.totalCharacters = response.info ? response.info.count : this.characters.length;

      this.renderCharacters(append);
      this.updateResultsDisplay();
      
    } catch (error) {
      Utils.showError(APIHelpers.handleAPIError(error));
      if (!append) {
          this.characters = [];
          this.renderCharacters();
      }
    } finally {
      this.isLoading = false;
      Utils.hideLoading();
    }
  }

  renderCharacters(append = false) {
    const grid = this.elements.charactersGrid;
    if (!append) {
        grid.innerHTML = '';
    }

    if (this.characters.length === 0) {
      grid.innerHTML = `<div class="no-results text-center"><h3>No se encontraron personajes</h3></div>`;
      return;
    }
    
    const fragment = document.createDocumentFragment();
    const startIndex = append ? grid.children.length : 0;

    this.characters.slice(startIndex).forEach((character, index) => {
      const card = this.createCharacterCard(character, startIndex + index);
      fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
  }

  createCharacterCard(character, index) {
    const card = Utils.createElement('div', {
      className: 'character-card fade-in',
      dataset: { characterId: character.id, index }
    });

    const isFavorite = this.favorites.includes(character.id);
    
    card.innerHTML = `
      <div class="character-image-container">
        <img class="character-image" src="${character.image}" alt="${character.name}" loading="lazy">
      </div>
      <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-character-id="${character.id}">&#9733;</button>
      <div class="character-info">
        <h3 class="character-name">${character.name}</h3>
        <div class="character-details">
          <div class="character-detail">
            <span class="status-indicator ${Utils.getStatusClass(character.status)}"></span>
            <span>${Utils.formatStatus(character.status)}</span>
          </div>
          <div class="character-detail"><strong>Especie:</strong> ${character.species}</div>
          <div class="character-detail"><strong>Origen:</strong> ${character.origin.name}</div>
        </div>
        <button class="detail-btn">Ver Detalles</button>
      </div>
    `;
    
    card.querySelector('.detail-btn').addEventListener('click', () => this.showCharacterModal(character, index));
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(character.id, e.currentTarget);
    });
    
    return card;
  }

  async showCharacterModal(character, index) {
    this.currentCharacterIndex = index;
    this.renderBasicCharacterInfo(character);
    this.openModal();
    await this.loadCharacterDetails(character);
  }
  
  renderBasicCharacterInfo(character) {
    this.elements.modalContent.innerHTML = `
      <div class="modal-character">
        <img class="modal-character-image" src="${character.image}" alt="${character.name}">
        <div class="modal-character-details">
          <div class="modal-character-info">
            <div class="info-group"><div class="info-label">Nombre</div><div class="info-value">${character.name}</div></div>
            <div class="info-group"><div class="info-label">Estado</div><div class="info-value"><span class="status-indicator ${Utils.getStatusClass(character.status)}"></span> ${Utils.formatStatus(character.status)}</div></div>
            <div class="info-group"><div class="info-label">Especie</div><div class="info-value">${character.species}</div></div>
            <div class="info-group"><div class="info-label">Género</div><div class="info-value">${Utils.formatGender(character.gender)}</div></div>
            <div class="info-group"><div class="info-label">Origen</div><div class="info-value">${character.origin.name}</div></div>
            <div class="info-group"><div class="info-label">Ubicación</div><div class="info-value">${character.location.name}</div></div>
          </div>
        </div>
      </div>
      <div class="loading-episodes"><div class="spinner"></div><p>Cargando episodios...</p></div>`;
  }

  async loadCharacterDetails(character) {
    try {
      const episodeIds = APIHelpers.extractEpisodeIds(character.episode).slice(0, 5);
      if (episodeIds.length > 0) {
        const episodes = await api.getMultipleEpisodes(episodeIds);
        this.renderEpisodes(episodes, character.episode.length);
      } else {
        this.renderNoEpisodes();
      }
    } catch (error) {
      this.renderEpisodeError();
    }
  }

  renderEpisodes(episodes, total) {
    const container = this.elements.modalContent.querySelector('.loading-episodes');
    if (!container) return;
    container.className = 'episodes-list';
    container.innerHTML = `<h4 class="episodes-title">Episodios (${total} total, mostrando primeros 5)</h4>
      ${episodes.map(e => `<div class="episode-item">${APIHelpers.formatEpisode(e)}</div>`).join('')}`;
  }
  
  renderNoEpisodes() {
      const container = this.elements.modalContent.querySelector('.loading-episodes');
      if(container) container.innerHTML = '<p>No hay episodios disponibles</p>';
  }
  
  renderEpisodeError() {
      const container = this.elements.modalContent.querySelector('.loading-episodes');
      if(container) container.innerHTML = '<p>Error al cargar episodios</p>';
  }

  openModal() {
    this.elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateModalNavigation();
  }

  closeModal() {
    this.elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  showPreviousCharacter() {
    if (this.currentCharacterIndex > 0) {
      this.showCharacterModal(this.characters[this.currentCharacterIndex - 1], this.currentCharacterIndex - 1);
    }
  }

  showNextCharacter() {
    if (this.currentCharacterIndex < this.characters.length - 1) {
      this.showCharacterModal(this.characters[this.currentCharacterIndex + 1], this.currentCharacterIndex + 1);
    }
  }

  updateModalNavigation() {
    this.elements.prevCharacter.disabled = this.currentCharacterIndex === 0;
    this.elements.nextCharacter.disabled = this.currentCharacterIndex === this.characters.length - 1;
  }
  
  async handleSearch() {
    this.currentFilters.name = this.elements.searchInput.value.trim();
    this.currentFilters.episode = this.elements.episodeInput.value.trim();
    
    // If searching by episode, deactivate favorites view
    if (this.currentFilters.episode) {
        this.isFavoritesView = false;
        this.elements.favoritesBtn.classList.remove('active');
    }
    
    this.currentPage = 1;
    await this.loadCharacters();
  }

  async handleFilterChange() {
    this.currentFilters.status = this.elements.statusFilter.value;
    this.currentFilters.species = this.elements.speciesFilter.value;
    this.currentPage = 1;
    await this.loadCharacters();
  }

  async clearAllFilters() {
    this.elements.searchInput.value = '';
    this.elements.episodeInput.value = '';
    this.elements.statusFilter.value = '';
    this.elements.speciesFilter.value = '';
    this.currentFilters = { name: '', status: '', species: '', episode: '' };
    this.isFavoritesView = false;
    this.elements.favoritesBtn.classList.remove('active');
    this.currentPage = 1;
    await this.loadCharacters();
  }
  
  toggleFavorite(characterId, buttonElement) {
    const index = this.favorites.indexOf(characterId);
    if (index > -1) {
        this.favorites.splice(index, 1);
        buttonElement.classList.remove('is-favorite');
    } else {
        this.favorites.push(characterId);
        buttonElement.classList.add('is-favorite');
    }
    Utils.StorageManager.set('favorites', this.favorites);

    if(this.isFavoritesView) {
        this.loadCharacters();
    }
  }

  async toggleFavoritesView() {
    this.isFavoritesView = !this.isFavoritesView;
    this.elements.favoritesBtn.classList.toggle('active');
    
    // Clear episode filter when activating favorites
    if (this.isFavoritesView) {
        this.elements.episodeInput.value = '';
        this.currentFilters.episode = '';
    }
    
    this.currentPage = 1;
    await this.loadCharacters();
  }
  
  updateResultsDisplay() {
    const count = this.characters.length;
    let msg;

    if (this.isFavoritesView) {
        const totalFavs = this.favorites.length;
        const showing = count === totalFavs ? '' : `${count} de `;
        msg = `Mostrando ${showing}${totalFavs} favoritos`;
    } else if (this.currentFilters.episode) {
        msg = `Encontrados ${count} personajes en este episodio`;
    } else {
        msg = `Mostrando ${this.characters.length} de ${this.totalCharacters} personajes`;
    }
      
    Utils.updateResultsCount(msg);
  }

  handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop > 300) this.elements.backToTop.classList.add('visible');
    else this.elements.backToTop.classList.remove('visible');

    if (clientHeight + scrollTop >= scrollHeight - 800 && !this.isLoading && this.currentPage < this.totalPages && !this.isFavoritesView && !this.currentFilters.episode) {
      this.currentPage++;
      this.loadCharacters(true);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new RickAndMortyApp();
});