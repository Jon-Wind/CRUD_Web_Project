// Character Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initImageHandling();
    initDeleteConfirmation();
    initPrintFunctionality();
    initAccessibility();
    initTooltips();
    initSmoothScrolling();
});

/**
 * Initialize image handling with error fallbacks
 */
function initImageHandling() {
    const characterImage = document.querySelector('.character-image');
    const imageContainer = document.querySelector('.character-image-container');
    
    if (characterImage) {
        // Handle image loading errors
        characterImage.addEventListener('error', function() {
            if (imageContainer) {
                imageContainer.innerHTML = `
                    <div class="character-image-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                `;
            }
        });
        
        // Add loading state
        characterImage.addEventListener('load', function() {
            characterImage.classList.add('loaded');
        });
    }
}

/**
 * Enhanced delete confirmation with better UX
 */
function initDeleteConfirmation() {
    const deleteForm = document.querySelector('.delete-form');
    const deleteButton = document.querySelector('.btn-delete');
    
    if (deleteForm && deleteButton) {
        deleteForm.addEventListener('submit', function(e) {
            const characterName = document.querySelector('.character-name');
            const nameText = characterName ? characterName.textContent.trim() : 'this character';
            
            const confirmation = confirm(
                `Are you sure you want to delete "${nameText}?\n\n` +
                `This action cannot be undone and will permanently remove ` +
                `the character from the database.`
            );
            
            if (!confirmation) {
                e.preventDefault();
                return false;
            }
            
            // Add loading state to button
            deleteButton.classList.add('loading');
            deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
            deleteButton.disabled = true;
            
            // Reset button if form submission fails
            setTimeout(() => {
                if (!deleteForm.submitted) {
                    deleteButton.classList.remove('loading');
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
                    deleteButton.disabled = false;
                }
            }, 5000);
        });
        
        // Mark form as submitted when actually submitted
        deleteForm.addEventListener('submit', function() {
            deleteForm.submitted = true;
        });
    }
}

/**
 * Initialize print functionality
 */
function initPrintFunctionality() {
    // Add keyboard shortcut for printing (Ctrl+P)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Add print class to body for print-specific styling
            document.body.classList.add('printing');
            
            // Remove print class after printing
            window.addEventListener('afterprint', function() {
                document.body.classList.remove('printing');
            });
        }
    });
    
    // Add print button functionality if needed
    const printButton = document.querySelector('.btn-print');
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add ARIA labels dynamically
    const characterImage = document.querySelector('.character-image');
    if (characterImage && !characterImage.getAttribute('aria-label')) {
        const characterName = document.querySelector('.character-name');
        if (characterName) {
            characterImage.setAttribute('aria-label', `Portrait of ${characterName.textContent.trim()}`);
        }
    }
    
    // Enhance keyboard navigation
    const actionButtons = document.querySelectorAll('.character-actions .btn');
    actionButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Add focus indicators
    actionButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.setAttribute('aria-focused', 'true');
        });
        
        button.addEventListener('blur', function() {
            this.removeAttribute('aria-focused');
        });
    });
}

/**
 * Initialize tooltips for better UX
 */
function initTooltips() {
    // Add tooltips to action buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.getAttribute('title')) {
            const icon = button.querySelector('i');
            const text = button.textContent.trim();
            
            if (icon && text) {
                button.setAttribute('title', text);
            }
        }
    });
    
    // Add tooltip to meta values that might be truncated
    const metaValues = document.querySelectorAll('.meta-value');
    metaValues.forEach(value => {
        if (value.scrollWidth > value.clientWidth) {
            value.setAttribute('title', value.textContent.trim());
        }
    });
}

/**
 * Initialize smooth scrolling for internal links
 */
function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/**
 * Copy character information to clipboard
 */
function copyCharacterInfo() {
    const characterName = document.querySelector('.character-name');
    const metaValues = document.querySelectorAll('.meta-value');
    
    if (characterName && metaValues.length > 0) {
        let info = `Character: ${characterName.textContent.trim()}\n\n`;
        
        const labels = ['Alignment', 'Race', 'Class', 'Level'];
        metaValues.forEach((value, index) => {
            if (labels[index] && value.textContent.trim() !== '—') {
                info += `${labels[index]}: ${value.textContent.trim()}\n`;
            }
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(info).then(() => {
            showNotification('Character information copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy character information', 'error');
        });
    }
}

/**
 * Show notification messages
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#28a745' : 
                       type === 'error' ? '#dc3545' : '#17a2b8'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E: Edit character
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !e.shiftKey) {
        e.preventDefault();
        const editButton = document.querySelector('.btn-edit');
        if (editButton) {
            window.location.href = editButton.href;
        }
    }
    
    // Ctrl/Cmd + Shift + E: Copy character info
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        copyCharacterInfo();
    }
    
    // Escape: Return to home
    if (e.key === 'Escape') {
        const homeButton = document.querySelector('.btn-home');
        if (homeButton) {
            window.location.href = homeButton.href;
        }
    }
});

/**
 * Add loading state management
 */
function setLoadingState(element, loading = true) {
    if (loading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

/**
 * Export functions for global access
 */
window.CharacterDetail = {
    copyCharacterInfo,
    showNotification,
    setLoadingState
};

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .loading {
        opacity: 0.6 !important;
        pointer-events: none !important;
        position: relative;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .character-image.loaded {
        opacity: 1;
    }
    
    .character-image:not(.loaded) {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);
