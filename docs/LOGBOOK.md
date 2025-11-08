# Project Logbook

## Project Information
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
