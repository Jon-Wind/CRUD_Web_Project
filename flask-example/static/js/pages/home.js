/**
 * Homepage JavaScript - D&D Character Manager
 * Handles search, sorting, and AJAX functionality with debouncing
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    initializeSearchSuggestions();
});

// Global variables
let debounceTimer;
const DEBOUNCE_DELAY = 300; // ms

/**
 * Initialize homepage functionality
 */
function initializeHomepage() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const orderSelect = document.getElementById('order-select');
    
    // Initialize search functionality with debouncing
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
    }
    
    // Prevent form submission for AJAX search
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }
    
    // Initialize sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSearch);
    }
    
        // Initialize order toggle and buttons
    if (orderSelect) {
        orderSelect.addEventListener('change', handleSearch);
        
        // Add click handlers for sort order buttons
        const orderButtons = document.querySelectorAll('.sort-order-btn');
        orderButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                orderButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Update the hidden input value
                document.getElementById('order-input').value = this.dataset.order;
                
                // Trigger search
                handleSearch();
            });
        });
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        // Update UI based on URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (searchInput) searchInput.value = urlParams.get('search') || '';
        if (sortSelect) sortSelect.value = urlParams.get('sort') || 'name';
        if (orderSelect) orderSelect.value = urlParams.get('order') || 'asc';
        
        // Trigger search with current parameters
        handleSearch();
    });
    
    // Add keyboard navigation support
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            // Escape key clears search
            if (e.key === 'Escape') {
                this.value = '';
                this.blur();
                handleSearch();
            }
        });
    }
}

/**
 * Handle search functionality with AJAX
 * @param {Event} [event] - Optional event object
 */
function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const orderInput = document.getElementById('order-input');
    
    if (!searchInput || !sortSelect || !orderInput) return;
    
    const searchQuery = searchInput.value.trim();
    const sortBy = sortSelect.value;
    const sortOrder = orderInput.value;
    
    // Show loading state
    setLoading(true);
    
    // Build URL with query parameters
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sort', sortBy);
    if (sortOrder) params.set('order', sortOrder);
    
    // Update URL without page reload
    const newUrl = `${url.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    
    // Make AJAX request
    fetch(newUrl, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update the character grid
        updateCharacterGrid(data.characters);
        
        // Update the result count
        updateResultCount(data.characters.length);
        
        // Update URL and title
        document.title = `D&D Characters${searchQuery ? ` - Search: ${searchQuery}` : ''}`;
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Failed to load characters. Please try again.');
    })
    .finally(() => {
        setLoading(false);
    });
}

/**
 * Update the character grid with new results
 * @param {Array} characters - Array of character objects
 */
function updateCharacterGrid(characters) {
    const characterResults = document.getElementById('characters-container');
    if (!characterResults) return;

    // Clear existing content
    characterResults.innerHTML = '';

    if (characters && characters.length > 0) {
        // Create the grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-4-col';

        // Create and append new character cards to the grid
        characters.forEach(character => {
            const characterCard = createCharacterCard(character);
            gridContainer.appendChild(characterCard);
        });

        // Append the grid to the results container
        characterResults.appendChild(gridContainer);

        // Initialize any new content (e.g., tooltips, event listeners)
        initializeNewContent();

        // Announce results to screen readers
        announceToScreenReader(`Found ${characters.length} characters`);
    } else {
        // No results found - use the proper empty state styling
        characterResults.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-dice-d20"></i>
                </div>
                <h2 class="empty-title">No Characters Found</h2>
                <p class="empty-description">
                    No characters match your search. Try different keywords or browse all characters.
                </p>
            </div>
        `;

        announceToScreenReader('No characters found');
    }
}

/**
 * Update the result count display
 * @param {number} count - Number of results
 */
function updateResultCount(count) {
    const resultCountElement = document.getElementById('result-count');
    if (resultCountElement) {
        resultCountElement.textContent = `${count} character${count !== 1 ? 's' : ''} found`;
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
    return function(...args) {
        const context = this;
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
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

/**
 * Create a character card element
 * @param {Object} character - Character data
 * @returns {HTMLElement} - Character card element
 */
function createCharacterCard(character) {
    // Create the article element directly (matching initial HTML structure)
    const card = document.createElement('article');
    card.className = 'character-card';
    card.setAttribute('data-character-id', character.id);

    // Set the image source, with a fallback to placeholder
    let imageSrc = '/static/images/placeholder-character.jpg';
    if (character.image_path) {
        imageSrc = character.image_path.startsWith('http') ?
            character.image_path :
            `/static/${character.image_path}`;
    }

    // Create the card HTML
    card.innerHTML = `
        <a href="/character/${character.id}" class="character-image-container">
            <img src="${imageSrc}"
                 alt="${escapeHtml(character.image_alt || character.name || 'Character')}"
                 class="character-image"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='/static/images/placeholder-character.jpg';">
            <div class="character-level-badge">Level ${character.level || 1}</div>
        </a>
        <div class="character-content">
            <h3 class="character-name">${escapeHtml(character.name || 'Unnamed Character')}</h3>
            <p class="character-class">${escapeHtml(character.character_class || 'Unknown Class')}</p>
            <p class="character-race">${escapeHtml(character.race || 'Unknown Race')} • ${character.alignment || ''}</p>
            ${character.short_description ?
                `<p class="character-description">${truncate(escapeHtml(character.short_description), 100)}</p>` :
                '<p class="character-description">No description available</p>'
            }
            <div class="character-actions">
                <a href="/character/${character.id}" class="character-action-btn btn btn-primary btn-sm">
                    <i class="fas fa-eye"></i>
                    View
                </a>
                <a href="/character/${character.id}/edit" class="character-action-btn btn btn-secondary btn-sm">
                    <i class="fas fa-edit"></i>
                    Edit
                </a>
            </div>
        </div>
    `;

    return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Truncate text to a certain length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Get Bootstrap badge class based on alignment
 * @param {string} alignment - Character alignment
 * @returns {string} - Bootstrap badge class
 */
function getAlignmentBadgeClass(alignment) {
    if (!alignment) return 'bg-secondary';
    
    const alignmentMap = {
        'lawful good': 'bg-success',
        'neutral good': 'bg-success bg-opacity-75',
        'chaotic good': 'bg-success bg-opacity-50',
        'lawful neutral': 'bg-secondary bg-opacity-75',
        'true neutral': 'bg-secondary',
        'chaotic neutral': 'bg-secondary bg-opacity-50',
        'lawful evil': 'bg-danger bg-opacity-75',
        'neutral evil': 'bg-danger',
        'chaotic evil': 'bg-danger bg-opacity-50'
    };
    
    return alignmentMap[alignment.toLowerCase()] || 'bg-secondary';
}

// Export functions for global access
window.updateSortOrder = updateSortOrder;
window.handleSearch = handleSearch;
window.initializeSearchSuggestions = initializeSearchSuggestions;
