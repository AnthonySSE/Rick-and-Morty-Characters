"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ===== APLICACIÓN PRINCIPAL RICK AND MORTY =====
var RickAndMortyApp =
/*#__PURE__*/
function () {
  function RickAndMortyApp() {
    _classCallCheck(this, RickAndMortyApp);

    this.currentPage = 1;
    this.currentFilters = {
      name: '',
      status: '',
      species: '',
      episode: ''
    };
    this.characters = [];
    this.totalPages = 1;
    this.isLoading = false;
    this.isFavoritesView = false;
    this.favorites = Utils.StorageManager.get('favorites', []);
    this.themeManager = new Utils.ThemeManager();
    this.init();
  }

  _createClass(RickAndMortyApp, [{
    key: "init",
    value: function init() {
      return regeneratorRuntime.async(function init$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.bindElements();
              this.bindEvents();
              _context.next = 4;
              return regeneratorRuntime.awrap(this.loadInitialData());

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "bindElements",
    value: function bindElements() {
      this.elements = {
        searchInput: document.getElementById('searchInput'),
        episodeFilter: document.getElementById('episodeFilter'),
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
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.elements.searchInput.addEventListener('input', Utils.debounce(function () {
        return _this.handleSearch();
      }, 500));
      this.elements.episodeFilter.addEventListener('change', function () {
        return _this.handleFilterChange();
      });
      this.elements.statusFilter.addEventListener('change', function () {
        return _this.handleFilterChange();
      });
      this.elements.speciesFilter.addEventListener('change', function () {
        return _this.handleFilterChange();
      });
      this.elements.clearFilters.addEventListener('click', function () {
        return _this.clearAllFilters();
      });
      this.elements.favoritesBtn.addEventListener('click', function () {
        return _this.toggleFavoritesView();
      });
      this.elements.modalClose.addEventListener('click', function () {
        return _this.closeModal();
      });
      this.elements.modalOverlay.addEventListener('click', function (e) {
        return e.target === _this.elements.modalOverlay && _this.closeModal();
      });
      this.elements.prevCharacter.addEventListener('click', function () {
        return _this.showPreviousCharacter();
      });
      this.elements.nextCharacter.addEventListener('click', function () {
        return _this.showNextCharacter();
      });
      this.elements.themeToggle.addEventListener('click', function () {
        return _this.themeManager.toggle();
      });
      this.elements.retryBtn.addEventListener('click', function () {
        return _this.loadCharacters();
      });
      this.elements.backToTop.addEventListener('click', function () {
        return Utils.scrollToTop();
      });
      window.addEventListener('scroll', Utils.throttle(function () {
        return _this.handleScroll();
      }, 200));
    }
  }, {
    key: "loadInitialData",
    value: function loadInitialData() {
      return regeneratorRuntime.async(function loadInitialData$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Utils.showLoading();
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(Promise.all([this.loadSpecies(), this.loadEpisodes()]));

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(this.loadCharacters());

            case 6:
              _context2.next = 11;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              Utils.showError(APIHelpers.handleAPIError(_context2.t0));

            case 11:
              _context2.prev = 11;
              Utils.hideLoading();
              return _context2.finish(11);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[1, 8, 11, 14]]);
    }
  }, {
    key: "loadSpecies",
    value: function loadSpecies() {
      var species;
      return regeneratorRuntime.async(function loadSpecies$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(api.getAllSpecies());

            case 3:
              species = _context3.sent;
              this.populateSelect(this.elements.speciesFilter, species);
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              console.warn('Error al cargar especies:', _context3.t0);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "loadEpisodes",
    value: function loadEpisodes() {
      var episodes, options;
      return regeneratorRuntime.async(function loadEpisodes$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(api.getAllEpisodes());

            case 3:
              episodes = _context4.sent;
              options = episodes.map(function (e) {
                return {
                  value: e.id,
                  text: "".concat(e.episode, " - ").concat(e.name)
                };
              });
              this.populateSelect(this.elements.episodeFilter, options, true);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              console.warn('Error al cargar episodios:', _context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[0, 8]]);
    }
  }, {
    key: "populateSelect",
    value: function populateSelect(selectElement, options) {
      var isObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var fragment = document.createDocumentFragment();
      options.forEach(function (option) {
        var opt = document.createElement('option');

        if (isObject) {
          opt.value = option.value;
          opt.textContent = option.text;
        } else {
          opt.value = option;
          opt.textContent = option;
        }

        fragment.appendChild(opt);
      });
      selectElement.appendChild(fragment);
    }
  }, {
    key: "loadCharacters",
    value: function loadCharacters() {
      var append,
          response,
          chars,
          favoriteChars,
          _this$currentFilters,
          name,
          status,
          species,
          _args5 = arguments;

      return regeneratorRuntime.async(function loadCharacters$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              append = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : false;

              if (!this.isLoading) {
                _context5.next = 3;
                break;
              }

              return _context5.abrupt("return");

            case 3:
              this.isLoading = true;
              Utils.showLoading();
              Utils.hideError();
              _context5.prev = 6;

              if (!this.currentFilters.episode) {
                _context5.next = 14;
                break;
              }

              _context5.next = 10;
              return regeneratorRuntime.awrap(api.getCharactersByEpisodeId(this.currentFilters.episode));

            case 10:
              chars = _context5.sent;
              response = {
                results: chars,
                info: null
              };
              _context5.next = 28;
              break;

            case 14:
              if (!this.isFavoritesView) {
                _context5.next = 25;
                break;
              }

              _context5.next = 17;
              return regeneratorRuntime.awrap(api.getMultipleCharacters(this.favorites));

            case 17:
              favoriteChars = _context5.sent;
              _this$currentFilters = this.currentFilters, name = _this$currentFilters.name, status = _this$currentFilters.status, species = _this$currentFilters.species;
              if (name) favoriteChars = favoriteChars.filter(function (c) {
                return c.name.toLowerCase().includes(name.toLowerCase());
              });
              if (status) favoriteChars = favoriteChars.filter(function (c) {
                return c.status.toLowerCase() === status.toLowerCase();
              });
              if (species) favoriteChars = favoriteChars.filter(function (c) {
                return c.species.toLowerCase() === species.toLowerCase();
              });
              response = {
                results: favoriteChars,
                info: null
              };
              _context5.next = 28;
              break;

            case 25:
              _context5.next = 27;
              return regeneratorRuntime.awrap(api.searchCharacters(this.currentFilters, this.currentPage));

            case 27:
              response = _context5.sent;

            case 28:
              this.characters = append ? [].concat(_toConsumableArray(this.characters), _toConsumableArray(response.results)) : response.results;
              this.totalPages = response.info ? response.info.pages : 1;
              this.totalCharacters = response.info ? response.info.count : this.characters.length;
              this.renderCharacters(append);
              this.updateResultsDisplay();
              _context5.next = 39;
              break;

            case 35:
              _context5.prev = 35;
              _context5.t0 = _context5["catch"](6);
              Utils.showError(APIHelpers.handleAPIError(_context5.t0));

              if (!append) {
                this.characters = [];
                this.renderCharacters();
              }

            case 39:
              _context5.prev = 39;
              this.isLoading = false;
              Utils.hideLoading();
              return _context5.finish(39);

            case 43:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[6, 35, 39, 43]]);
    }
  }, {
    key: "renderCharacters",
    value: function renderCharacters() {
      var _this2 = this;

      var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var grid = this.elements.charactersGrid;
      if (!append) grid.innerHTML = '';

      if (this.characters.length === 0) {
        grid.innerHTML = "<div class=\"no-results text-center\"><h3>No se encontraron personajes</h3></div>";
        return;
      }

      var fragment = document.createDocumentFragment();
      var startIndex = append ? grid.children.length : 0;
      this.characters.slice(startIndex).forEach(function (character, index) {
        fragment.appendChild(_this2.createCharacterCard(character, startIndex + index));
      });
      grid.appendChild(fragment);
    }
  }, {
    key: "createCharacterCard",
    value: function createCharacterCard(character, index) {
      var _this3 = this;

      var card = Utils.createElement('div', {
        className: 'character-card fade-in',
        dataset: {
          characterId: character.id,
          index: index
        }
      });
      var isFavorite = this.favorites.includes(character.id);
      card.innerHTML = "\n      <div class=\"character-image-container\"><img class=\"character-image\" src=\"".concat(character.image, "\" alt=\"").concat(character.name, "\" loading=\"lazy\"></div>\n      <button class=\"favorite-btn ").concat(isFavorite ? 'is-favorite' : '', "\">&#9733;</button>\n      <div class=\"character-info\">\n        <h3 class=\"character-name\">").concat(character.name, "</h3>\n        <div class=\"character-details\">\n          <div class=\"character-detail\"><span class=\"status-indicator ").concat(Utils.getStatusClass(character.status), "\"></span><span>").concat(Utils.formatStatus(character.status), "</span></div>\n          <div class=\"character-detail\"><strong>Especie:</strong> ").concat(character.species, "</div>\n          <div class=\"character-detail\"><strong>Origen:</strong> ").concat(character.origin.name, "</div>\n        </div>\n        <button class=\"detail-btn\">Ver Detalles</button>\n      </div>");
      card.querySelector('.detail-btn').addEventListener('click', function () {
        return _this3.showCharacterModal(character, index);
      });
      card.querySelector('.favorite-btn').addEventListener('click', function (e) {
        e.stopPropagation();

        _this3.toggleFavorite(character.id, e.currentTarget);
      });
      return card;
    }
  }, {
    key: "showCharacterModal",
    value: function showCharacterModal(character, index) {
      var episodeIds, episodes;
      return regeneratorRuntime.async(function showCharacterModal$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              this.currentCharacterIndex = index;
              this.renderBasicCharacterInfo(character);
              this.openModal();
              episodeIds = APIHelpers.extractEpisodeIds(character.episode).slice(0, 5);

              if (!(episodeIds.length > 0)) {
                _context6.next = 17;
                break;
              }

              _context6.prev = 5;
              _context6.next = 8;
              return regeneratorRuntime.awrap(api.getMultipleEpisodes(episodeIds));

            case 8:
              episodes = _context6.sent;
              this.renderEpisodes(episodes, character.episode.length);
              _context6.next = 15;
              break;

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](5);
              this.renderEpisodeError();

            case 15:
              _context6.next = 18;
              break;

            case 17:
              this.renderNoEpisodes();

            case 18:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this, [[5, 12]]);
    }
  }, {
    key: "renderBasicCharacterInfo",
    value: function renderBasicCharacterInfo(character) {
      this.elements.modalContent.innerHTML = "\n      <div class=\"modal-character\">\n        <img class=\"modal-character-image\" src=\"".concat(character.image, "\" alt=\"").concat(character.name, "\">\n        <div class=\"modal-character-details\">\n          <div class=\"modal-character-info\">\n            <div class=\"info-group\"><div class=\"info-label\">Nombre</div><div class=\"info-value\">").concat(character.name, "</div></div>\n            <div class=\"info-group\"><div class=\"info-label\">Estado</div><div class=\"info-value\"><span class=\"status-indicator ").concat(Utils.getStatusClass(character.status), "\"></span> ").concat(Utils.formatStatus(character.status), "</div></div>\n            <div class=\"info-group\"><div class=\"info-label\">Especie</div><div class=\"info-value\">").concat(character.species, "</div></div>\n            <div class=\"info-group\"><div class=\"info-label\">G\xE9nero</div><div class=\"info-value\">").concat(Utils.formatGender(character.gender), "</div></div>\n            <div class=\"info-group\"><div class=\"info-label\">Origen</div><div class=\"info-value\">").concat(character.origin.name, "</div></div>\n            <div class=\"info-group\"><div class=\"info-label\">Ubicaci\xF3n</div><div class=\"info-value\">").concat(character.location.name, "</div></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"loading-episodes\"><div class=\"spinner\"></div><p>Cargando episodios...</p></div>");
    }
  }, {
    key: "renderEpisodes",
    value: function renderEpisodes(episodes, total) {
      var container = this.elements.modalContent.querySelector('.loading-episodes');
      if (!container) return;
      container.className = 'episodes-list';
      container.innerHTML = "<h4 class=\"episodes-title\">Episodios (".concat(total, " total, mostrando primeros 5)</h4>\n      ").concat(episodes.map(function (e) {
        return "<div class=\"episode-item\">".concat(APIHelpers.formatEpisode(e), "</div>");
      }).join(''));
    }
  }, {
    key: "renderNoEpisodes",
    value: function renderNoEpisodes() {
      var c = this.elements.modalContent.querySelector('.loading-episodes');
      if (c) c.innerHTML = '<p>No hay episodios.</p>';
    }
  }, {
    key: "renderEpisodeError",
    value: function renderEpisodeError() {
      var c = this.elements.modalContent.querySelector('.loading-episodes');
      if (c) c.innerHTML = '<p>Error al cargar episodios.</p>';
    }
  }, {
    key: "openModal",
    value: function openModal() {
      this.elements.modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.updateModalNavigation();
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.elements.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, {
    key: "showPreviousCharacter",
    value: function showPreviousCharacter() {
      if (this.currentCharacterIndex > 0) this.showCharacterModal(this.characters[this.currentCharacterIndex - 1], this.currentCharacterIndex - 1);
    }
  }, {
    key: "showNextCharacter",
    value: function showNextCharacter() {
      if (this.currentCharacterIndex < this.characters.length - 1) this.showCharacterModal(this.characters[this.currentCharacterIndex + 1], this.currentCharacterIndex + 1);
    }
  }, {
    key: "updateModalNavigation",
    value: function updateModalNavigation() {
      this.elements.prevCharacter.disabled = this.currentCharacterIndex === 0;
      this.elements.nextCharacter.disabled = this.currentCharacterIndex >= this.characters.length - 1;
    }
  }, {
    key: "handleSearch",
    value: function handleSearch() {
      return regeneratorRuntime.async(function handleSearch$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this.currentFilters.name = this.elements.searchInput.value.trim();
              this.currentPage = 1;
              _context7.next = 4;
              return regeneratorRuntime.awrap(this.loadCharacters());

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "handleFilterChange",
    value: function handleFilterChange() {
      return regeneratorRuntime.async(function handleFilterChange$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this.currentFilters.status = this.elements.statusFilter.value;
              this.currentFilters.species = this.elements.speciesFilter.value;
              this.currentFilters.episode = this.elements.episodeFilter.value;

              if (this.currentFilters.episode) {
                this.isFavoritesView = false;
                this.elements.favoritesBtn.classList.remove('active');
                this.elements.searchInput.value = '';
                this.currentFilters.name = '';
                this.elements.statusFilter.value = '';
                this.currentFilters.status = '';
                this.elements.speciesFilter.value = '';
                this.currentFilters.species = '';
              }

              this.currentPage = 1;
              _context8.next = 7;
              return regeneratorRuntime.awrap(this.loadCharacters());

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "clearAllFilters",
    value: function clearAllFilters() {
      var _this4 = this;

      return regeneratorRuntime.async(function clearAllFilters$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              ['searchInput', 'episodeFilter', 'statusFilter', 'speciesFilter'].forEach(function (key) {
                return _this4.elements[key].value = '';
              });
              this.currentFilters = {
                name: '',
                status: '',
                species: '',
                episode: ''
              };
              this.isFavoritesView = false;
              this.elements.favoritesBtn.classList.remove('active');
              this.currentPage = 1;
              _context9.next = 7;
              return regeneratorRuntime.awrap(this.loadCharacters());

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "toggleFavorite",
    value: function toggleFavorite(characterId, buttonElement) {
      var index = this.favorites.indexOf(characterId);
      if (index > -1) this.favorites.splice(index, 1);else this.favorites.push(characterId);
      buttonElement.classList.toggle('is-favorite', index === -1);
      Utils.StorageManager.set('favorites', this.favorites);
      if (this.isFavoritesView) this.loadCharacters();
    }
  }, {
    key: "toggleFavoritesView",
    value: function toggleFavoritesView() {
      return regeneratorRuntime.async(function toggleFavoritesView$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              this.isFavoritesView = !this.isFavoritesView;
              this.elements.favoritesBtn.classList.toggle('active');

              if (this.isFavoritesView) {
                this.elements.episodeFilter.value = '';
                this.currentFilters.episode = '';
              }

              this.currentPage = 1;
              _context10.next = 6;
              return regeneratorRuntime.awrap(this.loadCharacters());

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "updateResultsDisplay",
    value: function updateResultsDisplay() {
      var msg;
      var count = this.characters.length;
      if (this.currentFilters.episode) msg = "Mostrando ".concat(count, " personajes");else if (this.isFavoritesView) msg = "Mostrando ".concat(count, " de ").concat(this.favorites.length, " favoritos");else msg = "Mostrando ".concat(this.characters.length, " de ").concat(this.totalCharacters, " personajes");
      Utils.updateResultsCount(msg);
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      var _document$documentEle = document.documentElement,
          scrollTop = _document$documentEle.scrollTop,
          scrollHeight = _document$documentEle.scrollHeight,
          clientHeight = _document$documentEle.clientHeight;
      if (scrollTop > 300) this.elements.backToTop.classList.add('visible');else this.elements.backToTop.classList.remove('visible');
      var canScroll = !this.isFavoritesView && !this.currentFilters.episode;

      if (canScroll && clientHeight + scrollTop >= scrollHeight - 800 && !this.isLoading && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadCharacters(true);
      }
    }
  }]);

  return RickAndMortyApp;
}();

document.addEventListener('DOMContentLoaded', function () {
  window.app = new RickAndMortyApp();
});