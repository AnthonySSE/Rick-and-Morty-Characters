// ===== UTILIDADES GENERALES =====

window.Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    formatStatus(status) {
        const map = { 'alive': 'Vivo', 'dead': 'Muerto', 'unknown': 'Desconocido' };
        return map[status?.toLowerCase()] || status;
    },
    getStatusClass(status) {
        const map = { 'alive': 'status-alive', 'dead': 'status-dead', 'unknown': 'status-unknown' };
        return map[status?.toLowerCase()] || 'status-unknown';
    },
    formatGender(gender) {
        const map = { 'male': 'Masculino', 'female': 'Femenino', 'genderless': 'Sin género', 'unknown': 'Desconocido' };
        return map[gender?.toLowerCase()] || gender;
    },
    extractIdFromUrl(url) {
        if (!url) return null;
        const matches = url.match(/\/(\d+)\/?$/);
        return matches ? parseInt(matches[1], 10) : null;
    },
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') element.className = value;
            else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => element.dataset[dataKey] = dataValue);
            } else element.setAttribute(key, value);
        });
        if (content) element.innerHTML = content;
        return element;
    },
    showError(message) {
        const errorContainer = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        if (errorContainer && errorText) {
            errorText.textContent = message;
            errorContainer.style.display = 'block';
            document.getElementById('charactersGrid').innerHTML = ''; // Clear grid on error
        }
    },
    hideError() {
        const errorContainer = document.getElementById('errorMessage');
        if (errorContainer) errorContainer.style.display = 'none';
    },
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'flex';
    },
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    },
    updateResultsCount(message) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) resultsCount.textContent = message;
    },
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    ThemeManager: class {
        constructor() {
            this.theme = localStorage.getItem('theme') || 'light';
            this.init();
        }
        init() {
            this.applyTheme();
            this.updateToggleIcon();
        }
        toggle() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.applyTheme();
            this.updateToggleIcon();
            localStorage.setItem('theme', this.theme);
        }
        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme);
        }
        updateToggleIcon() {
            const icon = document.querySelector('.theme-icon');
            if (icon) icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    },
    StorageManager: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('Error saving to localStorage', e);
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Error reading from localStorage', e);
                return defaultValue;
            }
        }
    }
};