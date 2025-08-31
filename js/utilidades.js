// ===== UTILIDADES GENERALES =====
window.Utils = {
    debounce: (func, wait) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func(...a), wait); }; },
    throttle: (func, limit) => { let iT; return (...a) => { if (!iT) { func(...a); iT = true; setTimeout(() => iT = false, limit); } }; },
    formatStatus: (s) => ({ 'alive': 'Vivo', 'dead': 'Muerto', 'unknown': 'Desconocido' }[s?.toLowerCase()] || s),
    getStatusClass: (s) => ({ 'alive': 'status-alive', 'dead': 'status-dead', 'unknown': 'status-unknown' }[s?.toLowerCase()] || 'status-unknown'),
    formatGender: (g) => ({ 'male': 'Masculino', 'female': 'Femenino', 'genderless': 'Sin género', 'unknown': 'Desconocido' }[g?.toLowerCase()] || g),
    extractIdFromUrl: (url) => url ? parseInt(url.match(/\/(\d+)\/?$/)?.[1] || null, 10) : null,
    createElement: (tag, attrs = {}, content = '') => { const el = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => { if (k === 'className') el.className = v; else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv); else el.setAttribute(k, v); }); if (content) el.innerHTML = content; return el; },
    showError: (msg) => { const err = document.getElementById('errorMessage'); if (err) { err.querySelector('#errorText').textContent = msg; err.style.display = 'block'; document.getElementById('charactersGrid').innerHTML = ''; } },
    hideError: () => { const err = document.getElementById('errorMessage'); if (err) err.style.display = 'none'; },
    showLoading: () => { const s = document.getElementById('loadingSpinner'); if (s) s.style.display = 'flex'; },
    hideLoading: () => { const s = document.getElementById('loadingSpinner'); if (s) s.style.display = 'none'; },
    updateResultsCount: (msg) => { const rc = document.getElementById('resultsCount'); if (rc) rc.textContent = msg; },
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    ThemeManager: class { constructor() { this.theme = localStorage.getItem('theme') || 'light'; this.init(); } init() { this.applyTheme(); this.updateToggleIcon(); } toggle() { this.theme = this.theme === 'light' ? 'dark' : 'light'; localStorage.setItem('theme', this.theme); this.applyTheme(); this.updateToggleIcon(); } applyTheme() { document.documentElement.setAttribute('data-theme', this.theme); } updateToggleIcon() { const i = document.querySelector('.theme-icon'); if (i) i.textContent = this.theme === 'light' ? '🌙' : '☀️'; } },
    StorageManager: { set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('Error saving to localStorage', e); } }, get(k, d = null) { try { const i = localStorage.getItem(k); return i ? JSON.parse(i) : d; } catch (e) { console.warn('Error reading from localStorage', e); return d; } } }
};