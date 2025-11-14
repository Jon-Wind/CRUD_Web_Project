# Project Logbook

## Project Information
- **Project Name**: Character Creator Library
- **Start Date**: 27-10-25
- **Project Lead**: John W
- **Repository**: [Repository URL](https://github.com/Jon-Wind/CRUD_Web_Project)

## Development Log

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
  - [ ] Any challenges faced
  - [ ] Solutions implemented
