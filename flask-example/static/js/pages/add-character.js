/**
 * Add Character Page JavaScript - D&D Character Manager
 * Handles form validation, character preview, and interactive elements
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAddCharacterPage();
});

/**
 * Initialize add character page functionality
 */
function initializeAddCharacterPage() {
    initializeFormValidation();
    initializeCharacterPreview();
    initializeAlignmentGrid();
    initializeFileUpload();
    initializeStatsInputs();
    initializeProgressIndicator();
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const form = document.querySelector('form[method="POST"]');
    if (!form) return;

    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => validateField(field));
        
        // Validate on input if field has error
        field.addEventListener('input', () => {
            if (field.classList.contains('has-error')) {
                validateField(field);
            }
            updateProgress();
        });
        
        // Validate on change for select elements
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', () => validateField(field));
        }
        
        // Add character counter for textareas
        if (field.tagName === 'TEXTAREA') {
            addCharacterCounter(field);
        }
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Add form reset handler
    const resetButton = form.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Clear all validation states
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-error', 'has-success');
                removeErrorMessage(group);
            });
            
            // Reset progress
            updateProgress();
            
            // Reset character preview
            updateCharacterPreview();
        });
    }
}

/**
 * Add character counter to textarea
 * @param {HTMLElement} textarea - Textarea element
 */
function addCharacterCounter(textarea) {
    const maxLength = textarea.getAttribute('maxlength') || 500;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.setAttribute('aria-live', 'polite');
    
    const formGroup = textarea.closest('.form-group');
    formGroup.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;
        counter.className = 'character-counter';
        
        if (remaining < 10) {
            counter.classList.add('warning');
        }
        if (remaining < 0) {
            counter.classList.add('error');
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Form field to validate
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';

    // Remove existing error states
    formGroup.classList.remove('has-error');
    removeErrorMessage(formGroup);

    // Validation rules
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'url') {
        try {
            if (field.value) {
                new URL(field.value);
            }
        } catch (e) {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    } else if (field.type === 'tel') {
        const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
        if (field.value && !phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.type === 'number') {
        const min = parseInt(field.getAttribute('min'));
        const max = parseInt(field.getAttribute('max'));
        const value = parseInt(field.value);

        if (isNaN(value)) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be a valid number`;
        } else if (min !== undefined && value < min) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be at least ${min}`;
        } else if (max !== undefined && value > max) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be no more than ${max}`;
        }
    } else if (field.id === 'character-name') {
        const name = field.value.trim();
        if (name.length < 2) {
            isValid = false;
            errorMessage = 'Character name must be at least 2 characters';
        } else if (name.length > 50) {
            isValid = false;
            errorMessage = 'Character name must be less than 50 characters';
        } else if (!/^[a-zA-Z0-9\s\'\-]+$/.test(name)) {
            isValid = false;
            errorMessage = 'Character name can only contain letters, numbers, spaces, hyphens, and apostrophes';
        }
    } else if (field.id === 'character-class' || field.id === 'race') {
        const value = field.value.trim();
        if (value && value.length < 2) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be at least 2 characters`;
        } else if (value.length > 30) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be less than 30 characters`;
        }
    } else if (field.type === 'textarea') {
        const value = field.value.trim();
        const maxLength = field.getAttribute('maxlength') || 500;
        if (value.length > parseInt(maxLength)) {
            isValid = false;
            errorMessage = `Description must be less than ${maxLength} characters`;
        }
    }

    // Show error or success state
    if (!isValid) {
        formGroup.classList.add('has-error');
        showErrorMessage(formGroup, errorMessage);
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}-error`);
        
        // Add shake animation for better feedback
        formGroup.classList.add('shake');
        setTimeout(() => formGroup.classList.remove('shake'), 500);
    } else {
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        
        // Add success state for required fields
        if (field.hasAttribute('required') && field.value.trim()) {
            formGroup.classList.add('has-success');
            setTimeout(() => formGroup.classList.remove('has-success'), 2000);
        }
    }

    return isValid;
}

/**
 * Get field label for error messages
 * @param {HTMLElement} field - Form field
 * @returns {string} - Field label
 */
function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

/**
 * Show error message for field
 * @param {HTMLElement} formGroup - Form group element
 * @param {string} message - Error message
 */
function showErrorMessage(formGroup, message) {
    removeErrorMessage(formGroup);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.id = `error-${Date.now()}`;
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');

    formGroup.appendChild(errorDiv);
}

/**
 * Remove error message from form group
 * @param {HTMLElement} formGroup - Form group element
 */
function removeErrorMessage(formGroup) {
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Initialize character preview functionality
 */
function initializeCharacterPreview() {
    const nameField = document.getElementById('character-name');
    const classField = document.getElementById('character-class');
    const raceField = document.getElementById('race');
    const levelField = document.getElementById('level');
    const alignmentField = document.getElementById('alignment-display');

    const fields = [nameField, classField, raceField, levelField, alignmentField];
    fields.forEach(field => {
        if (field) {
            field.addEventListener('input', updateCharacterPreview);
            field.addEventListener('change', updateCharacterPreview);
        }
    });

    // Initial preview update
    updateCharacterPreview();
}

/**
 * Update character preview display
 */
function updateCharacterPreview() {
    const preview = document.querySelector('.character-preview');
    if (!preview) return;

    const name = document.getElementById('character-name')?.value || 'Unnamed Character';
    const characterClass = document.getElementById('character-class')?.value || 'Unknown Class';
    const race = document.getElementById('race')?.value || 'Unknown Race';
    const level = document.getElementById('level')?.value || '1';
    const alignment = document.getElementById('alignment-display')?.value || 'Unknown Alignment';

    // Update preview elements
    const previewName = preview.querySelector('.preview-name');
    const previewInfo = preview.querySelector('.preview-info');

    if (previewName) {
        previewName.textContent = name;
    }

    if (previewInfo) {
        previewInfo.innerHTML = `
            <strong>Class:</strong> ${characterClass}<br>
            <strong>Race:</strong> ${race}<br>
            <strong>Level:</strong> ${level}<br>
            <strong>Alignment:</strong> ${alignment}
        `;
    }
}

/**
 * Initialize alignment grid functionality
 */
function initializeAlignmentGrid() {
    const alignmentRadios = document.querySelectorAll('.alignment-radio');
    const displayField = document.getElementById('alignment-display');

    alignmentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                displayField.value = this.value;
                updateCharacterPreview();
                
                // Add visual feedback
                const cells = document.querySelectorAll('.alignment-cell');
                cells.forEach(cell => cell.classList.remove('selected'));
                const selectedCell = document.querySelector(`label[for="${this.id}"]`);
                if (selectedCell) {
                    selectedCell.classList.add('selected');
                }
            }
        });

        // Add keyboard navigation
        radio.addEventListener('keydown', function(e) {
            const radios = Array.from(alignmentRadios);
            const currentIndex = radios.indexOf(this);
            let newIndex = currentIndex;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    newIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1;
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    newIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            radios[newIndex].checked = true;
            radios[newIndex].focus();
            radios[newIndex].dispatchEvent(new Event('change'));
        });
    });
}

/**
 * Initialize file upload functionality
 */
function initializeFileUpload() {
    const fileInput = document.querySelector('input[type="file"]');
    const uploadLabel = document.querySelector('.file-upload-label');
    const filenameDisplay = document.querySelector('.file-upload-filename');

    if (!fileInput || !uploadLabel) return;

    uploadLabel.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
                this.value = '';
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                showNotification('Image file must be smaller than 5MB', 'error');
                this.value = '';
                return;
            }

            // Update UI
            uploadLabel.classList.add('has-file');
            uploadLabel.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Image Selected</span>
            `;

            if (filenameDisplay) {
                filenameDisplay.textContent = `(${file.name})`;
            }

            // Show preview if supported
            showImagePreview(file);
        } else {
            uploadLabel.classList.remove('has-file');
            uploadLabel.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Choose Image</span>
            `;

            if (filenameDisplay) {
                filenameDisplay.textContent = '';
            }
        }
    });
}

/**
 * Show image preview
 * @param {File} file - Image file
 */
function showImagePreview(file) {
    const reader = new FileReader();
    const previewImage = document.querySelector('.preview-image');

    if (previewImage) {
        reader.onload = function(e) {
            previewImage.innerHTML = `<img src="${e.target.result}" alt="Character preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);">`;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Initialize stats inputs with validation
 */
function initializeStatsInputs() {
    const statInputs = document.querySelectorAll('.stat-input');

    statInputs.forEach(input => {
        // Ensure numeric input
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Clamp to valid range (1-20 for D&D stats)
            const value = parseInt(this.value) || 0;
            if (value < 1) this.value = 1;
            if (value > 20) this.value = 20;
            
            updateProgress();
        });

        // Add keyboard navigation
        input.addEventListener('keydown', function(e) {
            const inputs = Array.from(statInputs);
            const currentIndex = inputs.indexOf(this);
            let newIndex = currentIndex;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    newIndex = currentIndex > 0 ? currentIndex - 1 : inputs.length - 1;
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    newIndex = currentIndex < inputs.length - 1 ? currentIndex + 1 : 0;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            inputs[newIndex].focus();
            inputs[newIndex].select();
        });
    });
}

/**
 * Initialize progress indicator
 */
function initializeProgressIndicator() {
    updateProgress();
}

/**
 * Update form progress indicator
 */
function updateProgress() {
    const progressBar = document.querySelector('.form-progress-bar');
    if (!progressBar) return;

    const form = document.querySelector('form[method="POST"]');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');

    const progress = (filledFields.length / requiredFields.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    progressBar.setAttribute('aria-valuemin', 0);
    progressBar.setAttribute('aria-valuemax', 100);
}

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Validate all required fields
    let isValid = true;
    const validationPromises = [];
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
        
        // Add async validation for fields that need it
        if (field.id === 'character-name') {
            validationPromises.push(validateCharacterName(field));
        }
    });
    
    // Wait for async validations
    try {
        const asyncResults = await Promise.all(validationPromises);
        if (asyncResults.some(result => !result)) {
            isValid = false;
        }
    } catch (error) {
        console.error('Async validation error:', error);
        isValid = false;
    }

    if (!isValid) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstInvalid) {
            firstInvalid.focus();
        }

        showNotification('Please correct the errors before submitting', 'error');
        
        // Announce errors to screen readers
        const errorCount = form.querySelectorAll('.has-error').length;
        announceToScreenReader(`Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and correct.`);
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Character...';
    
    // Disable all form fields during submission
    const allFields = form.querySelectorAll('input, select, textarea, button');
    allFields.forEach(field => {
        if (field !== submitButton) {
            field.disabled = true;
        }
    });
    
    try {
        // Submit form normally (could be enhanced with AJAX)
        form.submit();
    } catch (error) {
        console.error('Submission error:', error);
        showNotification('An error occurred while creating the character', 'error');
        
        // Restore form state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        allFields.forEach(field => {
            field.disabled = false;
        });
    }
}

/**
 * Validate character name asynchronously (check for duplicates)
 * @param {HTMLElement} field - Name field
 * @returns {Promise<boolean>} - Validation result
 */
async function validateCharacterName(field) {
    const name = field.value.trim();
    if (name.length < 2) return true; // Skip if basic validation already failed
    
    try {
        const response = await fetch(`/api/check-character-name?name=${encodeURIComponent(name)}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.exists) {
                const formGroup = field.closest('.form-group');
                formGroup.classList.add('has-error');
                showErrorMessage(formGroup, 'A character with this name already exists');
                field.setAttribute('aria-invalid', 'true');
                field.setAttribute('aria-describedby', `${field.id}-error`);
                return false;
            }
        }
    } catch (error) {
        console.error('Name validation error:', error);
        // Don't fail submission if name check fails
    }
    
    return true;
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Show notification message
 * @param {string} message - Message text
 * @param {string} type - Message type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        default:
            icon = 'ℹ️';
    }

    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-remove after 5 seconds
    const removeTimeout = setTimeout(() => removeNotification(notification), 5000);

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            removeNotification(notification);
        });
    }
}

/**
 * Remove notification element
 * @param {HTMLElement} notification - Notification element
 */
function removeNotification(notification) {
    notification.classList.add('removing');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Export functions for global access
window.validateField = validateField;
window.updateCharacterPreview = updateCharacterPreview;
window.showNotification = showNotification;
window.validateCharacterName = validateCharacterName;
window.announceToScreenReader = announceToScreenReader;
