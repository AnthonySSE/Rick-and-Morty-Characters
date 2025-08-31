"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ===== API DE RICK AND MORTY =====
var RickAndMortyAPI =
/*#__PURE__*/
function () {
  function RickAndMortyAPI() {
    _classCallCheck(this, RickAndMortyAPI);

    this.baseURL = 'https://rickandmortyapi.com/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  _createClass(RickAndMortyAPI, [{
    key: "fetchWithCache",
    value: function fetchWithCache(url) {
      var options,
          cacheKey,
          cachedData,
          response,
          data,
          _args = arguments;
      return regeneratorRuntime.async(function fetchWithCache$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              cacheKey = url;
              cachedData = this.cache.get(cacheKey);

              if (!(cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", cachedData.data);

            case 5:
              _context.prev = 5;
              _context.next = 8;
              return regeneratorRuntime.awrap(fetch(url, _objectSpread({}, options)));

            case 8:
              response = _context.sent;

              if (response.ok) {
                _context.next = 11;
                break;
              }

              throw new Error("HTTP Error: ".concat(response.status));

            case 11:
              _context.next = 13;
              return regeneratorRuntime.awrap(response.json());

            case 13:
              data = _context.sent;
              this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
              });
              return _context.abrupt("return", data);

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](5);
              console.error('Error en la petición:', _context.t0);
              throw new Error("Error al conectar con la API: ".concat(_context.t0.message));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[5, 18]]);
    }
  }, {
    key: "getAllEpisodes",
    value: function getAllEpisodes() {
      var cacheKey, cached, allEpisodes, page, hasNextPage, url, response;
      return regeneratorRuntime.async(function getAllEpisodes$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cacheKey = 'all_episodes';
              cached = this.cache.get(cacheKey);

              if (!(cached && Date.now() - cached.timestamp < this.cacheTimeout)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", cached.data);

            case 4:
              allEpisodes = [];
              page = 1;
              hasNextPage = true;

            case 7:
              if (!hasNextPage) {
                _context2.next = 17;
                break;
              }

              url = "".concat(this.baseURL, "/episode?page=").concat(page);
              _context2.next = 11;
              return regeneratorRuntime.awrap(this.fetchWithCache(url));

            case 11:
              response = _context2.sent;
              allEpisodes.push.apply(allEpisodes, _toConsumableArray(response.results));
              hasNextPage = response.info.next !== null;
              page++;
              _context2.next = 7;
              break;

            case 17:
              this.cache.set(cacheKey, {
                data: allEpisodes,
                timestamp: Date.now()
              });
              return _context2.abrupt("return", allEpisodes);

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getCharactersByEpisodeId",
    value: function getCharactersByEpisodeId(episodeId) {
      var episode, characterIds;
      return regeneratorRuntime.async(function getCharactersByEpisodeId$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.fetchWithCache("".concat(this.baseURL, "/episode/").concat(episodeId)));

            case 2:
              episode = _context3.sent;
              characterIds = episode.characters.map(function (url) {
                return Utils.extractIdFromUrl(url);
              }).filter(function (id) {
                return id !== null;
              });
              _context3.next = 6;
              return regeneratorRuntime.awrap(this.getMultipleCharacters(characterIds));

            case 6:
              return _context3.abrupt("return", _context3.sent);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getCharacters",
    value: function getCharacters() {
      var page,
          _args4 = arguments;
      return regeneratorRuntime.async(function getCharacters$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              page = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 1;
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.fetchWithCache("".concat(this.baseURL, "/character?page=").concat(page)));

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "searchCharacters",
    value: function searchCharacters() {
      var filters,
          page,
          params,
          _args5 = arguments;
      return regeneratorRuntime.async(function searchCharacters$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              filters = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {};
              page = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 1;
              params = new URLSearchParams({
                page: page
              });
              if (filters.name) params.append('name', filters.name);
              if (filters.status) params.append('status', filters.status);
              if (filters.species) params.append('species', filters.species);
              _context5.next = 8;
              return regeneratorRuntime.awrap(this.fetchWithCache("".concat(this.baseURL, "/character?").concat(params.toString())));

            case 8:
              return _context5.abrupt("return", _context5.sent);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getMultipleCharacters",
    value: function getMultipleCharacters(ids) {
      var result;
      return regeneratorRuntime.async(function getMultipleCharacters$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(!ids || ids.length === 0)) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return", []);

            case 2:
              _context6.next = 4;
              return regeneratorRuntime.awrap(this.fetchWithCache("".concat(this.baseURL, "/character/").concat(ids.join(','))));

            case 4:
              result = _context6.sent;
              return _context6.abrupt("return", Array.isArray(result) ? result : [result]);

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getMultipleEpisodes",
    value: function getMultipleEpisodes(ids) {
      var result;
      return regeneratorRuntime.async(function getMultipleEpisodes$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(!ids || ids.length === 0)) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt("return", []);

            case 2:
              _context7.next = 4;
              return regeneratorRuntime.awrap(this.fetchWithCache("".concat(this.baseURL, "/episode/").concat(ids.join(','))));

            case 4:
              result = _context7.sent;
              return _context7.abrupt("return", Array.isArray(result) ? result : [result]);

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getAllSpecies",
    value: function getAllSpecies() {
      var cacheKey, cached, species, page, hasNextPage, response, speciesArray;
      return regeneratorRuntime.async(function getAllSpecies$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              cacheKey = 'all_species';
              cached = this.cache.get(cacheKey);

              if (!(cached && Date.now() - cached.timestamp < this.cacheTimeout)) {
                _context8.next = 4;
                break;
              }

              return _context8.abrupt("return", cached.data);

            case 4:
              species = new Set();
              page = 1;
              hasNextPage = true;

            case 7:
              if (!(hasNextPage && page <= 5)) {
                _context8.next = 16;
                break;
              }

              _context8.next = 10;
              return regeneratorRuntime.awrap(this.getCharacters(page));

            case 10:
              response = _context8.sent;
              response.results.forEach(function (c) {
                return c.species && species.add(c.species);
              });
              hasNextPage = response.info.next !== null;
              page++;
              _context8.next = 7;
              break;

            case 16:
              speciesArray = Array.from(species).sort();
              this.cache.set(cacheKey, {
                data: speciesArray,
                timestamp: Date.now()
              });
              return _context8.abrupt("return", speciesArray);

            case 19:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }]);

  return RickAndMortyAPI;
}();

var api = new RickAndMortyAPI();
window.APIHelpers = {
  extractEpisodeIds: function extractEpisodeIds(urls) {
    return urls.map(function (url) {
      return Utils.extractIdFromUrl(url);
    }).filter(function (id) {
      return id !== null;
    });
  },
  formatEpisode: function formatEpisode(ep) {
    return "".concat(ep.episode, " - ").concat(ep.name);
  },
  handleAPIError: function handleAPIError(err) {
    return err.message.includes('404') ? 'No se encontraron resultados.' : 'Ha ocurrido un error inesperado.';
  }
};