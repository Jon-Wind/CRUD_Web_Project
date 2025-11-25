// Parties Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePartiesPage();
});

function initializePartiesPage() {
    initializeDeleteConfirmations();
    initializeKeyboardNavigation();
    initializeAccessibility();
    initializeLoadingStates();
    initializeNotifications();
    initializeAnimations();
    initializePrintFunctionality();
    initializeTooltips();
}

// Enhanced Delete Confirmation
function initializeDeleteConfirmations() {
    const deleteForms = document.querySelectorAll('.party-actions form[method="POST"]');
    
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const partyName = this.closest('.party-card').querySelector('h3').textContent;
            const memberCount = this.closest('.party-card').querySelector('.member-count').textContent;
            
            showDeleteConfirmation(partyName, memberCount, () => {
                this.submit();
            });
        });
    });
}

function showDeleteConfirmation(partyName, memberCount, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'delete-title');
    modal.setAttribute('aria-modal', 'true');
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="delete-title">Delete Party</h2>
                <button type="button" class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete <strong>${partyName}</strong>?</p>
                <p>This party has <strong>${memberCount}</strong> members.</p>
                <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline modal-cancel">Cancel</button>
                <button type="button" class="btn btn-danger modal-confirm">Delete Party</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus management
    const confirmBtn = modal.querySelector('.modal-confirm');
    confirmBtn.focus();
    
    // Event handlers
    const closeModal = () => {
        document.body.removeChild(modal);
        document.querySelector('.btn-primary')?.focus();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    
    // Keyboard navigation
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Trap focus
    trapFocus(modal);
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    // Make party cards focusable
    const partyCards = document.querySelectorAll('.party-card');
    
    partyCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const viewBtn = card.querySelector('.btn-primary');
                if (viewBtn) {
                    viewBtn.click();
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextCard = partyCards[index + 1];
                if (nextCard) nextCard.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevCard = partyCards[index - 1];
                if (prevCard) prevCard.focus();
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N: New party
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const newPartyBtn = document.querySelector('.actions-bar .btn-primary');
            if (newPartyBtn) newPartyBtn.click();
        }
        
        // Ctrl/Cmd + P: Print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add ARIA labels to party cards
    const partyCards = document.querySelectorAll('.party-card');
    
    partyCards.forEach(card => {
        const partyName = card.querySelector('h3').textContent;
        const memberCount = card.querySelector('.member-count').textContent;
        const description = card.querySelector('.party-description')?.textContent || '';
        
        card.setAttribute('aria-label', `${partyName}, ${memberCount}. ${description.substring(0, 100)}...`);
    });
    
    // Add live region for notifications
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'notifications-live-region';
    document.body.appendChild(liveRegion);
    
    // Add skip links
    addSkipLinks();
}

function addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#party-grid" class="skip-link">Skip to parties</a>
        <a href="#actions-bar" class="skip-link">Skip to actions</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

// Loading States
function initializeLoadingStates() {
    const buttons = document.querySelectorAll('.party-actions .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-danger')) {
                addLoadingState(this);
            }
        });
    });
}

function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
    
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        element.classList.remove('loading');
        element.disabled = false;
        element.innerHTML = originalContent;
    }, 1000);
}

// Notifications
function initializeNotifications() {
    // Check for flash messages and enhance them
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'alert-close';
        closeBtn.setAttribute('aria-label', 'Close alert');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        closeBtn.addEventListener('click', () => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
        
        alert.appendChild(closeBtn);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'alert-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });
    
    notification.appendChild(closeBtn);
    
    // Add to notifications container or create one
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-dismiss
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Update live region
    const liveRegion = document.getElementById('notifications-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

// Animations
function initializeAnimations() {
    // Staggered animation for party cards
    const partyCards = document.querySelectorAll('.party-card');
    
    partyCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Print Functionality
function initializePrintFunctionality() {
    // Add print button
    const actionsBar = document.querySelector('.actions-bar');
    if (actionsBar && !document.querySelector('.btn-print')) {
        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn-outline btn-print';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print';
        printBtn.setAttribute('aria-label', 'Print parties list');
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        actionsBar.appendChild(printBtn);
    }
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .actions-bar .btn:not(.btn-print),
            .party-actions,
            .alert {
                display: none !important;
            }
            
            .btn-print {
                display: inline-block !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
}

// Tooltips
function initializeTooltips() {
    // Add tooltips to party cards
    const partyCards = document.querySelectorAll('.party-card');
    
    partyCards.forEach(card => {
        const createdDate = card.querySelector('.party-date')?.textContent;
        if (createdDate) {
            card.setAttribute('title', `Created: ${createdDate}`);
        }
    });
    
    // Add tooltips to action buttons
    const actionButtons = document.querySelectorAll('.party-actions .btn');
    
    actionButtons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            const action = button.textContent.trim();
            const partyName = button.closest('.party-card').querySelector('h3').textContent;
            button.setAttribute('title', `${action} ${partyName}`);
        }
    });
}

// Utility Functions
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Search/Filter Functionality (for future enhancement)
function initializeSearch() {
    // This can be implemented when search functionality is added
    const searchInput = document.querySelector('#party-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterParties, 300));
    }
}

function filterParties(searchTerm) {
    const partyCards = document.querySelectorAll('.party-card');
    const term = searchTerm.toLowerCase();
    
    partyCards.forEach(card => {
        const partyName = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.party-description')?.textContent.toLowerCase() || '';
        
        if (partyName.includes(term) || description.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

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

// Export functions for potential use by other scripts
window.PartiesPage = {
    showNotification,
    addLoadingState,
    filterParties
};
