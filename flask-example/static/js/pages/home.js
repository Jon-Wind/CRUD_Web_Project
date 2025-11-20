/**
 * Homepage JavaScript - D&D Character Manager
 * Handles search, sorting, and AJAX functionality
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
});

/**
 * Initialize homepage functionality
 */
function initializeHomepage() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Initialize search functionality
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Initialize sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            if (searchForm) {
                searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        });
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        location.reload();
    });
    
    // Add keyboard navigation support
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            // Escape key clears search
            if (e.key === 'Escape') {
                this.value = '';
                this.blur();
            }
        });
    }
}

/**
 * Handle search form submission with AJAX
 * @param {Event} event - Form submission event
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const url = form.action;
    const loadingIndicator = document.getElementById('loading-indicator');
    const characterResults = document.getElementById('character-results');
    
    try {
        // Show loading state
        setLoading(true);
        
        // Make AJAX request
        const response = await fetch(`${url}?${new URLSearchParams(formData).toString()}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/html,application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Update character grid with new results
        updateCharacterGrid(data);
        
        // Update URL without page reload
        updateURL(formData);
        
    } catch (error) {
        console.error('Search error:', error);
        
        // Fallback to normal form submission if AJAX fails
        showErrorMessage('Search failed. Please try again.');
        setTimeout(() => {
            form.submit();
        }, 2000);
        
    } finally {
        setLoading(false);
    }
}

/**
 * Update the character grid with new results
 * @param {Object} data - JSON response from server
 */
function updateCharacterGrid(data) {
    try {
        // Update search query display
        updateSearchHeader(data.search_query);

        // Update sort controls
        updateSortControls(data.current_sort, data.current_order);

        // Update character grid
        const currentResults = document.getElementById('character-results');
        if (currentResults) {
            currentResults.innerHTML = generateCharacterGridHTML(data.characters);
        }

        // Re-initialize any event listeners for new content
        initializeNewContent();

        // Announce to screen readers
        announceToScreenReader('Search results updated');

    } catch (error) {
        console.error('Error updating character grid:', error);
        throw error;
    }
}

/**
 * Update browser URL without page reload
 * @param {FormData} formData - Form data to create URL params from
 */
function updateURL(formData) {
    try {
        const url = new URL(window.location);
        const params = new URLSearchParams(formData);
        
        // Update URL
        window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
        
    } catch (error) {
        console.error('Error updating URL:', error);
    }
}

/**
 * Update sort order
 * @param {string} order - Sort order ('asc' or 'desc')
 */
function updateSortOrder(order) {
    const sortOrderInput = document.getElementById('sort-order-input');
    const searchForm = document.getElementById('search-form');
    
    if (sortOrderInput) {
        sortOrderInput.value = order;
        
        // Update button states
        updateSortButtons(order);
        
        // Trigger search
        if (searchForm) {
            searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }
}

/**
 * Update sort button visual states
 * @param {string} activeOrder - Currently active sort order
 */
function updateSortButtons(activeOrder) {
    const sortButtons = document.querySelectorAll('.sort-order-btn');
    
    sortButtons.forEach(button => {
        const buttonOrder = button.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        
        if (buttonOrder === activeOrder) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        }
    });
}

/**
 * Show/hide loading indicator
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoading(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    const searchInput = document.getElementById('search-input');
    
    if (loadingIndicator) {
        if (isLoading) {
            loadingIndicator.style.display = 'block';
            loadingIndicator.setAttribute('aria-hidden', 'false');
        } else {
            loadingIndicator.style.display = 'none';
            loadingIndicator.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Disable search input during loading
    if (searchInput) {
        searchInput.disabled = isLoading;
        searchInput.setAttribute('aria-busy', isLoading.toString());
    }
}

/**
 * Initialize event listeners for dynamically loaded content
 */
function initializeNewContent() {
    // Add hover effects to character cards
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.setAttribute('aria-expanded', 'true');
        });
        
        card.addEventListener('mouseleave', function() {
            this.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Add keyboard navigation to character cards
    characterCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.character-image-container');
                if (link) link.click();
            }
        });
    });
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Create error alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error alert-dismissible';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <span class="alert-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </span>
        <span class="alert-message">${message}</span>
        <button type="button" class="alert-close" aria-label="Close alert">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Insert at top of main content
    const mainContent = document.querySelector('.grid-container');
    if (mainContent) {
        mainContent.insertBefore(errorDiv, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
        
        // Add close button functionality
        const closeButton = errorDiv.querySelector('.alert-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                errorDiv.parentNode.removeChild(errorDiv);
            });
        }
    }
}

/**
 * Announce content changes to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    // Create or use existing live region
    let liveRegion = document.getElementById('screen-reader-announcements');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'screen-reader-announcements';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    // Update announcement
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add search suggestions (future enhancement)
 * This function provides autocomplete suggestions for character search
 */
function initializeSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.setAttribute('role', 'listbox');
    suggestionsContainer.setAttribute('aria-label', 'Search suggestions');
    
    if (searchInput) {
        // Position suggestions container
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(suggestionsContainer);
        
        // Add debounced search for suggestions
        const debouncedSearch = debounce(async function(query) {
            if (query.length >= 2) {
                try {
                    // Fetch search suggestions from API
                    const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const suggestions = await response.json();
                        displaySearchSuggestions(suggestions, query);
                    }
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                clearSearchSuggestions();
            }
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                clearSearchSuggestions();
            }
        });
        
        // Keyboard navigation for suggestions
        searchInput.addEventListener('keydown', function(e) {
            const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
            const currentIndex = Array.from(suggestions).findIndex(item => item.classList.contains('selected'));
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < suggestions.length - 1) {
                        updateSuggestionSelection(currentIndex, currentIndex + 1);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        updateSuggestionSelection(currentIndex, currentIndex - 1);
                    }
                    break;
                case 'Enter':
                    if (currentIndex >= 0 && suggestions[currentIndex]) {
                        e.preventDefault();
                        selectSuggestion(suggestions[currentIndex]);
                    }
                    break;
                case 'Escape':
                    clearSearchSuggestions();
                    break;
            }
        });
    }
}

/**
 * Display search suggestions
 * @param {Array} suggestions - Array of suggestion objects
 * @param {string} query - Current search query
 */
function displaySearchSuggestions(suggestions, query) {
    const container = document.querySelector('.search-suggestions');
    if (!container) return;
    
    clearSearchSuggestions();
    
    if (suggestions.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'suggestion-item no-results';
        noResults.textContent = 'No suggestions found';
        noResults.setAttribute('role', 'option');
        container.appendChild(noResults);
        return;
    }
    
    suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-value', suggestion.name);
        item.setAttribute('data-id', suggestion.id);
        item.setAttribute('data-type', suggestion.type);
        item.setAttribute('aria-selected', 'false');
        
        // Highlight matching text
        const highlightedName = suggestion.name.replace(
            new RegExp(query, 'gi'),
            match => `<mark>${match}</mark>`
        );
        
        item.innerHTML = `
            <div class="suggestion-content">
                <div class="suggestion-name">${highlightedName}</div>
                <div class="suggestion-details">${suggestion.type} - ${suggestion.class || ''}</div>
            </div>
        `;
        
        item.addEventListener('click', () => selectSuggestion(item));
        container.appendChild(item);
    });
    
    container.classList.add('show');
}

/**
 * Clear search suggestions
 */
function clearSearchSuggestions() {
    const container = document.querySelector('.search-suggestions');
    if (container) {
        container.innerHTML = '';
        container.classList.remove('show');
    }
}

/**
 * Update suggestion selection
 * @param {number} currentIndex - Currently selected index
 * @param {number} newIndex - New selected index
 */
function updateSuggestionSelection(currentIndex, newIndex) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (currentIndex >= 0 && suggestions[currentIndex]) {
        suggestions[currentIndex].classList.remove('selected');
        suggestions[currentIndex].setAttribute('aria-selected', 'false');
    }
    
    if (newIndex >= 0 && suggestions[newIndex]) {
        suggestions[newIndex].classList.add('selected');
        suggestions[newIndex].setAttribute('aria-selected', 'true');
        suggestions[newIndex].scrollIntoView({ block: 'nearest' });
    }
}

/**
 * Select a search suggestion
 * @param {HTMLElement} suggestion - Suggestion element
 */
function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('search-input');
    if (searchInput && suggestion) {
        searchInput.value = suggestion.getAttribute('data-value');
        clearSearchSuggestions();
        searchInput.focus();
        
        // Trigger search
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }
}

// Export functions for global access
window.updateSortOrder = updateSortOrder;
window.handleSearch = handleSearch;
window.initializeSearchSuggestions = initializeSearchSuggestions;
