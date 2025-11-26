A# Project Logbook

## Project Information
- **Project Name**: Character Creator Library
- **Start Date**: 27-10-25
- **Project Lead**: John W
- **Repository**: [Repository URL](https://github.com/Jon-Wind/CRUD_Web_Project)

## Development Log

### 2025-12-02 - Fixed Character Card Layout Consistency After AJAX Updates
- **Author**: BLACKBOXAI
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Fixed character cards expanding to full width after AJAX searches by ensuring proper CSS grid structure
  - Modified `updateCharacterGrid` function to create `.grid-4-col` container div for consistent 3-per-row layout
  - Updated `createCharacterCard` to return `<article>` elements directly instead of Bootstrap-wrapped divs
  - Replaced Bootstrap alert styling in "no results" state with proper `.empty-state` CSS class
  - Corrected edit button URL from `/edit-character/${character.id}` to `/character/${character.id}/edit`
- **Files Modified**:
  - `flask-example/static/js/pages/home.js` - Updated character grid and card creation logic
- **Notes/Challenges**:
  - [x] Identified that AJAX updates were using Bootstrap grid classes instead of CSS grid structure
  - [x] Ensured consistent layout before and after searches/refreshes
  - [x] Maintained proper semantic HTML structure with `<article>` elements
  - [x] Fixed URL routing for edit functionality

### 2025-11-27 - Mobile Responsiveness Improvements for Add Character Page
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Made the add character form fully responsive for mobile devices
  - Implemented a single-column layout for mobile screens (< 768px)
  - Improved form controls and touch targets for better mobile interaction
  - Enhanced character preview section for mobile viewing
  - Added responsive spacing and padding adjustments
  - Ensured form actions are properly stacked on mobile
- **Files Modified**:
  - `flask-example/templates/add_character.html` - Updated CSS with responsive design
- **Notes/Challenges**:
  - [x] Ensured all form elements are properly sized for touch interaction
  - [x] Maintained functionality while improving mobile layout
  - [x] Verified appearance across different screen sizes
  - [x] Added appropriate media queries for responsive behavior

### 2025-11-26 - Character Preview and Form Styling Updates
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Removed stats and ability scores from the character preview for a cleaner design
  - Fixed the level circle positioning and styling in the character preview
  - Updated the character preview to properly display character information with icons
  - Fixed JavaScript errors in the character preview update function
  - Improved the overall layout and responsiveness of the character preview
- **Files Modified**:
  - `flask-example/static/js/pages/add-character.js` - Updated preview update logic
  - `flask-example/templates/add_character.html` - Modified preview HTML and CSS
- **Notes/Challenges**:
  - [x] Fixed syntax errors in the JavaScript update function
  - [x] Ensured proper icon display for class, race, and alignment
  - [x] Added debug logging for troubleshooting preview updates
  - [x] Verified all form fields update the preview in real-time

### 2025-11-20 - Website Crash Fix: Added Missing Route Handlers
- **Author**: BLACKBOXAI
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Added missing route handlers for 'about' and 'contact' pages to resolve BuildError
  - Fixed Flask application crash caused by undefined routes in navigation
  - Ensured header navigation buttons are properly positioned on the right side using CSS flexbox
- **Files Modified**:
  - `flask-example/app.py` - Added @app.route('/about') and @app.route('/contact') handlers
- **Notes/Challenges**:
  - [x] Identified BuildError from missing route definitions
  - [x] Added route handlers to prevent application crashes
  - [x] Verified website runs without errors and navigation works correctly

### 2025-11-11 - Added Custom Styled Delete Confirmation Modal
- **Author**: BLACKBOXAI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Replaced native browser confirm dialog for delete action on character detail page with a custom styled modal dialog
  - Removed inline `onsubmit` confirm attribute from delete form in `character_detail.html`
  - Added modal dialog HTML markup for delete confirmation in `character_detail.html`
  - Updated `initDeleteConfirmation` function in `character-detail.js` to show/hide modal and handle confirm/cancel actions
  - Added modal dialog CSS styles to `character-detail.css` for consistent look and feel with website theme
- **Files Modified**:
  - `flask-example/templates/character_detail.html` - Removed inline confirm and added modal HTML
  - `flask-example/static/js/pages/character-detail.js` - Updated delete confirmation logic
  - `flask-example/static/css/pages/character-detail.css` - Added modal dialog styles
- **Notes/Challenges**:
  - [x] Improved user experience by integrating confirmation prompt into site style
  - [x] Ensured accessibility with aria attributes and keyboard support (Escape key to close)
  - [x] Maintained existing loading states and form submission logic
  - [x] Tested modal dialog appearance and functionality on character detail page


### 2025-11-20 - Alignment Selection & Preview Fixes
- **Author**: Cascade AI
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Restored execution of page-specific JavaScript by rendering the `extra_js` block in `base.html`
  - Added visible "Selected alignment" indicator on the add character page
  - Synced alignment grid selections with hidden field, display text, and character preview
- **Files Modified**:
  - `flask-example/templates/base.html` - Rendered `{% block extra_js %}` before legacy scripts block
  - `flask-example/templates/add_character.html` - Added alignment selection display section
  - `flask-example/static/js/pages/add-character.js` - Centralized alignment selection UI updates and initialization
- **Notes/Challenges**:
  - [x] Identified missing script block that prevented page JS from running
  - [x] Ensured alignment selection text updates alongside preview
  - [x] Preserved keyboard navigation and accessibility in the grid

### 2025-11-19 - Sort Bar Fixes and UI Refinements
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Removed "Character Library" header and subtitle from search section
  - Enhanced D&D Character Manager title contrast with text shadows and stroke
  - Changed hero title color to brighter blue (#5DADE2) for better visibility
  - Improved sort bar styling with background, borders, padding, and hover effects
  - Added responsive design for sort bar on tablets and mobile devices
  - Fixed ascending/descending sort arrow buttons functionality
  - Attempted AJAX implementation for seamless sorting without page refresh
  - Reverted to reliable form submission approach after AJAX complications
- **Files Modified**:
  - `flask-example/templates/index.html` - Removed headers, fixed sort buttons
  - `flask-example/static/css/pages/home.css` - Enhanced title contrast and sort bar styling
  - `flask-example/static/js/pages/home.js` - Modified and reverted AJAX functionality
  - `flask-example/app.py` - Modified and reverted AJAX response handling
- **Notes/Challenges**:
  - [x] Successfully removed redundant Character Library headers
  - [x] Enhanced title visibility against gradient background
  - [x] Implemented responsive sort bar design
  - [x] Fixed sort arrow button functionality
  - [-] AJAX implementation faced complexity with template rendering
  - [x] Reverted to stable form submission approach for reliability

### 2025-11-19 - JavaScript Enhancement and UI Fixes
- **Author**: Cascade AI
- **Time Spent**: 2 hours
- **Changes Made**:
  - Enhanced `home.js` with advanced search suggestions including autocomplete functionality
  - Added debounced API calls for efficient search suggestions with keyboard navigation
  - Enhanced `add-character.js` with comprehensive form validation (email, URL, phone, regex patterns)
  - Added async duplicate character name checking via API endpoint
  - Implemented character counters for textareas with visual warnings
  - Added screen reader announcements for better accessibility
  - Created new CSS components: `search-suggestions.css` and `form-validation.css`
  - Fixed parties page template error with datetime formatting
  - Resolved character card layout issues preventing content overflow
  - Fixed button positioning within character cards to prevent cutoff
  - Reduced hero section padding and enhanced button contrast on home page
  - Fixed CSS syntax errors in home.css
  - Removed ability scores section from add character page
  - Made alignment grid more responsive with clamp() functions
  - Added "Character Library" header above search bar on home page
  - Further decreased hero section padding for better spacing
- **Files Modified**:
  - `flask-example/static/js/pages/home.js` - Added search suggestions functionality
  - `flask-example/static/js/pages/add-character.js` - Enhanced validation and UX
  - `flask-example/static/css/components/search-suggestions.css` - New component styles
  - `flask-example/static/css/components/form-validation.css` - New component styles
  - `flask-example/static/css/styles.css` - Added component imports
  - `flask-example/templates/parties.html` - Fixed datetime formatting issue
  - `flask-example/static/css/pages/home.css` - Fixed card layout and hero section
  - `flask-example/templates/add_character.html` - Removed ability scores section
  - `flask-example/static/css/pages/add-character.css` - Made alignment grid responsive
  - `flask-example/templates/index.html` - Added Character Library header
- **Notes/Challenges**:
  - [x] Implemented accessible autocomplete with keyboard navigation
  - [x] Added comprehensive real-time form validation
  - [x] Fixed character card responsive layout issues
  - [x] Enhanced button contrast and visibility on gradient backgrounds
  - [x] Resolved template syntax errors preventing page loads
  - [x] Successfully removed unused ability scores functionality
  - [x] Improved alignment grid responsiveness across device sizes

### 2025-11-18 - Button Styling and Template Bug Fixes
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Fixed button text color issues where text was same color as button background
  - Added proper CSS classes for btn-primary, btn-outline, btn-danger, and btn-sm variants
  - Removed conflicting generic .btn styles that were overriding specific button classes
  - Fixed TypeError in parties template where string concatenation failed with integers
  - Resolved Jinja2 strftime error by handling string datetime objects from SQLite
  - Fixed button alignment issues for delete/remove buttons across all templates
  - Added flash function import to Flask app to resolve undefined flash errors
- **Files Modified**:
  - `flask-example/static/css/styles.css` - Added proper button variant styles and removed conflicts
  - `flask-example/templates/parties.html` - Fixed string concatenation and strftime issues
  - `flask-example/templates/party_detail.html` - Fixed delete and remove button alignment
  - `flask-example/app.py` - Added flash import from Flask
- **Notes/Challenges**:
  - [x] Resolved button text visibility issues with proper CSS hierarchy
  - [x] Fixed template syntax errors preventing page loads
  - [x] Ensured consistent button alignment across all forms
  - [x] Handled SQLite datetime string formatting properly
  - [x] Added missing Flask imports for proper functionality

### 2025-11-18 - Party Management System Implementation
- **Author**: Cascade AI
- **Time Spent**: 2 hours
- **Changes Made**:
  - Implemented complete party management system with full CRUD operations
  - Created database tables for parties and character-party relationships
  - Added party creation, editing, deletion, and detail viewing functionality
  - Integrated party assignment into character creation and editing workflows
  - Added visual themes for party cards based on member count (6 different color schemes)
  - Updated character detail page to display assigned parties with links
  - Added "Parties" button to main navigation bar
  - Fixed indentation issues that prevented Flask application from starting
  - Resolved missing route errors by removing non-existent navigation links
- **Files Modified/Added**:
  - `flask-example/app.py` - Added all party management routes and character-party integration
  - `flask-example/schema.sql` - Added parties and character_parties tables
  - `flask-example/templates/parties.html` - Party list with visual themes
  - `flask-example/templates/party_detail.html` - Party detail view with character list
  - `flask-example/templates/add_party.html` - Party creation form
  - `flask-example/templates/edit_party.html` - Party editing form
  - `flask-example/templates/add_character.html` - Added party assignment dropdown
  - `flask-example/templates/edit_character.html` - Added party assignment dropdown
  - `flask-example/templates/character_detail.html` - Added party membership display
  - `flask-example/templates/base.html` - Added Parties navigation link, removed broken links
- **Notes/Challenges**:
  - [x] Successfully implemented all party CRUD operations
  - [x] Integrated party assignment into character workflows
  - [x] Added visual themes and styling for better UX
  - [x] Fixed indentation issues that caused Flask startup errors
  - [x] Resolved navigation errors by removing non-existent routes
  - [x] Ensured all database operations work correctly
  - [x] Added proper error handling and user feedback

### 2025-11-18 - Fixed Alignment Grid Functionality
- **Author**: Cascade AI
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Fixed alignment grid click functionality that was not working properly
  - Resolved issue where visual selection would only work once and couldn't be changed
  - Replaced complex CSS selectors with JavaScript-based visual feedback
  - Simplified radio button positioning to prevent interference with click events
  - Added proper initialization for visual selection state on page load
- **Files Modified**:
  - `flask-example/templates/add_character.html` - Fixed alignment grid JavaScript and CSS
- **Notes/Challenges**:
  - [x] Identified that radio inputs were blocking cell click events
  - [x] Implemented JavaScript-based visual selection instead of CSS-only approach
  - [x] Ensured alignment grid works for multiple selections and changes
  - [x] Maintained form functionality while fixing visual feedback

### 2025-11-14 - Enhanced D&D Alignment Selector
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Replaced the standard dropdown with an interactive D&D alignment grid
  - Added visual feedback for selected alignments
  - Implemented color-coding for different alignment types (Good, Neutral, Evil)
  - Improved mobile responsiveness of the alignment selector
  - Added hover effects and transitions for better user experience
- **Files Modified/Added**:
  - `flask-example/templates/add_character.html` - Updated alignment selection UI
  - `flask-example/static/css/styles.css` - Added styles for the alignment grid
- **Notes/Challenges**:
  - [x] Ensured the grid is fully accessible
  - [x] Maintained backward compatibility with existing character data
  - [x] Added visual indicators for the selected alignment
  - [x] Optimized for both desktop and mobile views

### 2025-11-14 - Added Contact Page and Error Handling
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Transformed the contact page into a fully functional contact form
  - Added server-side form validation for required fields and email format
  - Created custom 404 (Not Found) and 500 (Internal Server Error) error pages
  - Implemented flash messages for user feedback
  - Added responsive styling for all new components
- **Files Modified/Added**:
  - `flask-example/templates/contact.html` - Completely redesigned with a contact form
  - `flask-example/templates/errors/404.html` - New custom 404 error page
  - `flask-example/templates/errors/500.html` - New custom 500 error page
  - `flask-example/app.py` - Added contact form handling and error handlers
- **Notes/Challenges**:
  - [x] Implemented client-side and server-side form validation
  - [x] Created user-friendly error pages with consistent styling
  - [x] Added proper error handling for form submissions
  - [x] Ensured responsive design works on all device sizes
  - [x] Added visual feedback for form interactions

### 2025-11-13 - Fixed Duplicate Character Cards
- **Author**: Cascade AI
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Fixed an issue where character cards were being displayed twice on the home page
  - Removed duplicate character grid section from index.html
  - Fixed template syntax errors that were causing 500 server errors
  - Ensured proper HTML structure and template inheritance
- **Files Modified**:
  - `flask-example/templates/index.html` - Removed duplicate grid and fixed template structure
- **Notes/Challenges**:
  - [x] Identified and removed redundant character grid section
  - [x] Fixed template syntax errors
  - [x] Verified proper card display in all view modes
  - [x] Ensured all interactive features (search, sort) continue to work correctly

### 2025-11-11 - Added Character Sorting Functionality
- **Author**: Cascade AI
- **Time Spent**: 1 hour
- **Changes Made**:
  - Added sorting controls to the character listing page
  - Implemented sorting by multiple fields: Name, ID, Level, Race, Class, and Alignment
  - Added toggle for ascending/descending sort order
  - Ensured sort state persists with search functionality
  - Improved UI with responsive design and visual feedback
- **Files Modified**:
  - `flask-example/app.py` - Added sort parameters and updated database queries
  - `flask-example/templates/index.html` - Added sort controls and styles
- **Notes/Challenges**:
  - [x] Implemented server-side sorting for better performance
  - [x] Ensured sort works in combination with search
  - [x] Added visual indicators for current sort order
  - [x] Made controls accessible with proper ARIA labels

### 2025-11-08 - UI Color Scheme Update
- **Project Name**: Character Creator Library
- **Start Date**: 27-10-25
- **Project Lead**: John W
- **Repository**: [Repository URL](https://github.com/Jon-Wind/CRUD_Web_Project)

## Development Log

### 2025-11-08 - UI Color Scheme Update
- **Author**: John W
- **Time Spent**: 0.5 hours
- **Changes Made**:
  - Updated the color scheme to a cohesive blue theme across all pages
  - Changed header and footer to a rich navy blue (#1e40af)
  - Improved button and link hover states with smooth transitions
  - Enhanced form controls with consistent styling
  - Added subtle shadows and depth to interactive elements
- **Files Modified/Added**:
  - `flask-example/static/css/styles.css` - Updated color variables and component styles
  - `flask-example/templates/add_character.html` - Updated form styling
- **Notes/Challenges**:
  - [x] Ensured sufficient color contrast for accessibility
  - [x] Maintained consistent styling across all pages
  - [x] Improved visual hierarchy with the new color scheme
  - [x] Added smooth transitions for interactive elements

### 2025-11-06 - Search Functionality Implementation
- **Author**: John W
- **Time Spent**: 0.1 hours
- **Changes Made**:
  - Added server-side search functionality to the character list
  - Implemented search across multiple fields (name, race, class, description)
  - Created a responsive search bar with real-time results count
  - Added clear search functionality
  - Improved user feedback for search results
- **Files Modified/Added**:
  - `flask-example/app.py` - Added search query handling to index route
  - `flask-example/templates/index.html` - Added search form and results display
  - `static/css/style.css` - Added search bar styles (if using separate CSS)
- **Notes/Challenges**:
  - [x] Implemented case-insensitive partial matching
  - [x] Added search persistence in URL
  - [x] Ensured mobile responsiveness
  - [x] Added accessibility features

### 2025-11-06 - Character Detail Page Redesign
- **Author**: John W
- **Time Spent**: 0.1 hours
- **Changes Made**:
  - Redesigned character detail page with two-column layout
  - Improved character card display with better image handling
  - Added detailed sections for character attributes
  - Implemented responsive design for all screen sizes
  - Enhanced UI with consistent styling and better typography
  - Added action buttons for character management

### 2025-11-06 - Database and Template Updates
- **Author**: John W
- **Time Spent**: 3 hours (windsurf is lying lol)
- **Changes Made**:
  - Fixed database initialization to properly create `dnd_characters` table
  - Updated all HTML templates for D&D character management:
    - Base template with D&D theme
    - Character list view with cards
    - Detailed character view
    - Add/Edit character forms
    - About page with D&D theme
  - Added image upload and preview functionality
  - Implemented responsive design for all screen sizes
- **Files Modified/Added**:
  - `flask-example/app.py` - Updated routes and database handling
  - `flask-example/schema.sql` - Added sample D&D characters
  - `flask-example/init_db.py` - Created for database initialization
  - `flask-example/templates/base.html` - Updated base template
  - `flask-example/templates/index.html` - Character list view
  - `flask-example/templates/character_detail.html` - Completely redesigned detailed character view
  - `flask-example/templates/add_character.html` - Add character form
  - `flask-example/templates/edit_character.html` - Edit character form
  - `flask-example/templates/about.html` - Updated about page
  - `docs/LOGBOOK.md` - Updated log entries
- **Notes/Challenges**:
  - [x] Fixed database initialization issue with custom script
  - [x] Implemented image upload and preview functionality
  - [x] Ensured all templates are responsive and user-friendly
  - [x] Added proper form validation and error handling
  - [x] Redesigned character detail page for better usability
  - [ ] Need to add more character customization options

### 2025-10-27 - Initial Project Setup
- **Author**: John
- **Time Spent**: 2 hours
- **Changes Made**:
  - Added a log book
  - Deleted the old files and cleaned up for further changes on the project
- **Files Modified**:
  - `LOGBOOK.md`
  - `about-this.html`
  - `add-recipe.html`
  - `contact.html`
  - `index.html`
  - `recipe-detail.html`
- **Notes/Challenges**:
  - [x] Faced challenges in identifying which old files to delete without losing important project data
  - [x] Ensured proper cleanup by reviewing file contents and using version control to track deletions
  - [x] Implemented solutions by creating backups of critical files before deletion and documenting the cleanup process in the new logbook
