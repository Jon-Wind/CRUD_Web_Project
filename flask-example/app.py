"""
Dungeons & Dragons Character Manager - Flask Application

This module serves as the main entry point for the D&D Character Manager web application.
It handles HTTP requests, manages character data, and serves the frontend.

Key Features:
- CRUD operations for D&D characters
- Image upload and management
- Search and sort functionality
- Party management for characters
- RESTful API endpoints
"""
import os
import uuid

from flask import Flask, render_template, request, redirect, url_for, current_app, abort, jsonify, flash
from werkzeug.utils import secure_filename

from db import get_db, init_app


# Set of allowed image file extensions for uploads
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_image(filename):
    """
    Check if the given filename has an allowed image extension.
    
    Args:
        filename (str): The name of the file to check
        
    Returns:
        bool: True if the file extension is allowed, False otherwise
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


def create_app():
    """
    Create and configure the Flask application.
    
    This is the application factory function that sets up the Flask app,
    configuration, database, and routes.
    
    Returns:
        Flask: The configured Flask application instance
    """
    # Initialize Flask application
    app = Flask(__name__)
    
    # Configure application settings
    app.config.from_mapping(
        SECRET_KEY='dev',  # In production, this should be a secure, random key
        DATABASE=os.path.join(app.instance_path, 'dnd_characters.db'),
        SCHEMA_PATH='schema.sql',
        UPLOAD_FOLDER=os.path.join(app.static_folder, 'images', 'uploads')
    )

    # Ensure required directories exist
    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize database and register routes
    init_app(app)
    
    # Create database tables and initial data if they don't exist
    with app.app_context():
        from db import init_db
        init_db()

    # Register all application routes
    register_routes(app)

    return app


def register_routes(app):
    """
    Register all application routes and their handlers.
    
    This function contains all the route definitions for the application,
    including API endpoints and page routes.
    
    Args:
        app (Flask): The Flask application instance to register routes on
    """
    @app.route('/')
    def index():
        """
        Render the main character listing page with optional search and sorting.
        
        Handles both regular page loads and AJAX requests for dynamic updates.
        Supports searching by character attributes and sorting by various fields.
        
        Query Parameters:
            search (str): Optional search term to filter characters
            sort (str): Field to sort by (name, level, race, class, alignment, id)
            order (str): Sort order (asc or desc)
            
        Returns:
            Response: Rendered template or JSON response for AJAX requests
        """
        # Get and sanitize request parameters
        search_query = request.args.get('search', '').strip()
        sort_by = request.args.get('sort', 'name').lower()
        sort_order = request.args.get('order', 'asc').lower()
        
        # Define valid sort columns and map them to database columns
        valid_sort_columns = {
            'name': 'name',
            'id': 'id',
            'level': 'level',
            'race': 'race',
            'class': 'character_class',  # 'class' is reserved in Python, using 'character_class' in DB
            'alignment': 'alignment'
        }
        
        sort_column = valid_sort_columns.get(sort_by, 'name')
        sort_order = 'ASC' if sort_order == 'asc' else 'DESC'
        
        db = get_db()
        
        # Build the base query
        query = """
            SELECT id, name, race, character_class, level, short_description, 
                   image_path, alignment, backstory, personality
            FROM dnd_characters 
        """
        
        params = []
        
        # Add search conditions if search query exists
        if search_query:
            search_pattern = f'%{search_query}%'
            query += """
                WHERE name LIKE ? 
                OR race LIKE ? 
                OR character_class LIKE ? 
                OR short_description LIKE ?
                OR backstory LIKE ?
                OR personality LIKE ?
            """
            params.extend([search_pattern] * 6)
        
        # Add sorting
        query += f" ORDER BY {sort_column} {sort_order}, name"
        
        # Execute the query
        rows = db.execute(query, params).fetchall() if params else db.execute(query).fetchall()
        characters = [dict(row) for row in rows]
        
        # Check if it's an AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # Return JSON for AJAX requests
            return jsonify({
                'characters': characters,
                'search_query': search_query,
                'current_sort': sort_by,
                'current_order': sort_order
            })
        
        # For regular page loads, return the full page
        return render_template('index.html', 
                            characters=characters, 
                            active_page='home',
                            search_query=search_query,
                            current_sort=sort_by,
                            current_order=sort_order)

    @app.route('/character/<int:character_id>')
    def character_detail(character_id):
        db = get_db()
        character_row = db.execute('SELECT * FROM dnd_characters WHERE id = ?', (character_id,)).fetchone()

        if character_row is None:
            return "Character not Found", 404

        character = dict(character_row)
        
        # Get party information for this character
        party_info = db.execute('''
            SELECT p.* FROM parties p
            JOIN character_parties cp ON p.id = cp.party_id
            WHERE cp.character_id = ?
        ''', (character_id,)).fetchall()
        
        character_context = {
            'id': character['id'],
            'name': character['name'],
            'alignment': character.get('alignment', ''),
            'race': character.get('race', ''),
            'character_class': character.get('character_class', ''),
            'level': character.get('level', 1),
            'background': character.get('background', ''),
            'short_description': character.get('short_description', ''),
            'backstory': character.get('backstory', ''),
            'personality': character.get('personality', ''),
            'abilities_skills': character.get('abilities_skills', ''),
            'image_path': character.get('image_path', 'images/about.webp'),
            'image_alt': character.get('image_alt', f"Portrait of {character['name']}")
        }

        return render_template('character_detail.html', character=character_context, parties=party_info, active_page='character_detail')

    @app.route('/add-character', methods=['GET', 'POST'])
    def add_character():
        error = None
        if request.method == 'POST':
            name = request.form.get('character-name', '').strip()
            alignment = request.form.get('alignment', '').strip()
            race = request.form.get('race', '').strip()
            character_class = request.form.get('character-class', '').strip()
            level = int(request.form.get('level', 1))
            background = request.form.get('background', '').strip()
            short_description = request.form.get('short-description', '').strip()
            backstory = request.form.get('backstory', '').strip()
            personality = request.form.get('personality', '').strip()
            abilities_skills = request.form.get('abilities-skills', '').strip()
            party_id = request.form.get('party', '').strip()
            image_file = request.files.get('image-upload')

            image_path = 'images/about.webp'
            image_alt = f'{name} plated'

            if image_file and image_file.filename:
                filename = secure_filename(image_file.filename)
                if not allowed_image(filename):
                    error = 'Please upload an image in PNG, JPG, JPEG, WEBP, or GIF format.'
                else:
                    name_root, ext = os.path.splitext(filename)
                    unique_name = f"{name_root}_{uuid.uuid4().hex[:8]}{ext.lower()}"
                    upload_folder = current_app.config['UPLOAD_FOLDER']
                    os.makedirs(upload_folder, exist_ok=True)
                    save_path = os.path.join(upload_folder, unique_name)
                    image_file.save(save_path)
                    image_path = '/'.join(['images', 'uploads', unique_name])

            if not (name and short_description):
                error = 'Please complete all required fields before submitting.'
            if not name:
                error = 'Character name is required.'
            elif not short_description:
                error = 'Short description is required.'
            elif not error:
                try:
                    db = get_db()
                    cursor = db.cursor()
                    cursor.execute(
                        '''
                        INSERT INTO dnd_characters 
                        (name, alignment, race, character_class, level, background, 
                         short_description, backstory, personality, abilities_skills, 
                         image_path, image_alt) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''',
                        (name, alignment, race, character_class, level, background,
                         short_description, backstory, personality, abilities_skills,
                         image_path, image_alt)
                    )
                    character_id = cursor.lastrowid
                    
                    # Add character to party if specified
                    if party_id:
                        cursor.execute(
                            'INSERT INTO character_parties (character_id, party_id) VALUES (?, ?)',
                            (character_id, int(party_id))
                        )
                    
                    db.commit()
                    flash('Character added successfully!', 'success')
                    return redirect(url_for('character_detail', character_id=character_id))
                except db.IntegrityError:
                    error = f"Character '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"
        
        # Get available parties for the form
        db = get_db()
        parties = db.execute('SELECT * FROM parties ORDER BY name').fetchall()
        
        return render_template('add_character.html', active_page='add_character', error=error, parties=parties)

    @app.route('/character/<int:character_id>/edit', methods=['GET', 'POST'])
    def edit_character(character_id):
        db = get_db()
        character = db.execute('SELECT * FROM dnd_characters WHERE id = ?', (character_id,)).fetchone()

        if character is None:
            abort(404)

        character = dict(character)
        error = None

        if request.method == 'POST':
            name = request.form.get('character-name', '').strip()
            alignment = request.form.get('alignment', '').strip()
            race = request.form.get('race', '').strip()
            character_class = request.form.get('character-class', '').strip()
            level = int(request.form.get('level', 1))
            background = request.form.get('background', '').strip()
            short_description = request.form.get('short-description', '').strip()
            backstory = request.form.get('backstory', '').strip()
            personality = request.form.get('personality', '').strip()
            abilities_skills = request.form.get('abilities-skills', '').strip()
            party_id = request.form.get('party', '').strip()
            image_file = request.files.get('image-upload')

            image_path = character.get('image_path', 'images/about.webp')
            image_alt = character.get('image_alt', f"Portrait of {name}")

            if image_file and image_file.filename:
                filename = secure_filename(image_file.filename)
                if not allowed_image(filename):
                    error = 'Please upload an image in PNG, JPG, JPEG, WEBP, or GIF format.'
                else:
                    name_root, ext = os.path.splitext(filename)
                    unique_name = f"{name_root}_{uuid.uuid4().hex[:8]}{ext.lower()}"
                    upload_folder = current_app.config['UPLOAD_FOLDER']
                    os.makedirs(upload_folder, exist_ok=True)
                    save_path = os.path.join(upload_folder, unique_name)
                    image_file.save(save_path)
                    image_path = '/'.join(['images', 'uploads', unique_name])
                    image_alt = f"Portrait of {name}"

            if not name:
                error = 'Character name is required.'
            elif not short_description:
                error = 'Short description is required.'
            elif not error:
                try:
                    db.execute(
                        '''
                        UPDATE dnd_characters
                        SET name = ?, alignment = ?, race = ?, character_class = ?,
                            level = ?, background = ?, short_description = ?,
                            backstory = ?, personality = ?, abilities_skills = ?,
                            image_path = ?, image_alt = ?
                        WHERE id = ?
                        ''',
                        (name, alignment, race, character_class, level, background,
                         short_description, backstory, personality, abilities_skills,
                         image_path, image_alt, character_id)
                    )
                    
                    # Update party assignment
                    # First, remove existing party assignments
                    db.execute('DELETE FROM character_parties WHERE character_id = ?', (character_id,))
                    
                    # Then add new party assignment if specified
                    if party_id:
                        db.execute('INSERT INTO character_parties (character_id, party_id) VALUES (?, ?)',
                                  (character_id, int(party_id)))
                    
                    db.commit()
                    return redirect(url_for('character_detail', character_id=character_id))
                except db.IntegrityError:
                    error = f"Character '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"
        
        # Get available parties and current party assignment
        db = get_db()
        parties = db.execute('SELECT * FROM parties ORDER BY name').fetchall()
        current_party = db.execute('SELECT party_id FROM character_parties WHERE character_id = ?', (character_id,)).fetchone()
        current_party_id = current_party['party_id'] if current_party else None
        
        # Add current party to character data for template
        character['current_party_id'] = current_party_id

        return render_template('edit_character.html', character=character, error=error, active_page='edit_character', parties=parties)

    @app.route('/character/<int:character_id>/delete', methods=['POST'])
    def delete_character(character_id):
        db = get_db()
        db.execute('DELETE FROM dnd_characters WHERE id = ?', (character_id,))
        db.commit()
        flash('Character deleted successfully!', 'success')
        return redirect(url_for('index'))

    # Party Management Routes
    @app.route('/parties')
    def parties():
        db = get_db()
        parties = db.execute('''
            SELECT p.*, COUNT(cp.character_id) as member_count
            FROM parties p
            LEFT JOIN character_parties cp ON p.id = cp.party_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        ''').fetchall()
        return render_template('parties.html', parties=parties, active_page='parties')

    @app.route('/party/<int:party_id>')
    def party_detail(party_id):
        db = get_db()
        party = db.execute('SELECT * FROM parties WHERE id = ?', (party_id,)).fetchone()
        
        if party is None:
            return "Party not found", 404
        
        characters = db.execute('''
            SELECT c.* FROM dnd_characters c
            JOIN character_parties cp ON c.id = cp.character_id
            WHERE cp.party_id = ?
            ORDER BY c.name
        ''', (party_id,)).fetchall()
        
        return render_template('party_detail.html', party=party, characters=characters, active_page='party_detail')

    @app.route('/add-party', methods=['GET', 'POST'])
    def add_party():
        error = None
        if request.method == 'POST':
            name = request.form.get('party-name', '').strip()
            description = request.form.get('description', '').strip()
            background = request.form.get('background', '').strip()
            
            if not name:
                error = 'Party name is required.'
            else:
                try:
                    db = get_db()
                    cursor = db.cursor()
                    cursor.execute(
                        'INSERT INTO parties (name, description, background) VALUES (?, ?, ?)',
                        (name, description, background)
                    )
                    db.commit()
                    flash('Party added successfully!', 'success')
                    return redirect(url_for('party_detail', party_id=cursor.lastrowid))
                except db.IntegrityError:
                    error = f"Party '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"
        
        return render_template('add_party.html', active_page='add_party', error=error)

    @app.route('/party/<int:party_id>/edit', methods=['GET', 'POST'])
    def edit_party(party_id):
        db = get_db()
        party = db.execute('SELECT * FROM parties WHERE id = ?', (party_id,)).fetchone()
        
        if party is None:
            return "Party not found", 404
        
        error = None
        if request.method == 'POST':
            name = request.form.get('party-name', '').strip()
            description = request.form.get('description', '').strip()
            background = request.form.get('background', '').strip()
            
            if not name:
                error = 'Party name is required.'
            else:
                try:
                    db.execute(
                        'UPDATE parties SET name = ?, description = ?, background = ? WHERE id = ?',
                        (name, description, background, party_id)
                    )
                    db.commit()
                    flash('Party updated successfully!', 'success')
                    return redirect(url_for('party_detail', party_id=party_id))
                except db.IntegrityError:
                    error = f"Party '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"
        
        party = {
            'id': party['id'],
            'name': party['name'],
            'description': party['description'],
            'background': party['background']
        }
        
        return render_template('edit_party.html', party=party, error=error, active_page='edit_party')

    @app.route('/party/<int:party_id>/delete', methods=['POST'])
    def delete_party(party_id):
        db = get_db()
        db.execute('DELETE FROM parties WHERE id = ?', (party_id,))
        db.commit()
        flash('Party deleted successfully!', 'success')
        return redirect(url_for('parties'))

    @app.route('/party/<int:party_id>/add-character/<int:character_id>', methods=['POST'])
    def add_character_to_party(party_id, character_id):
        db = get_db()
        try:
            db.execute(
                'INSERT OR IGNORE INTO character_parties (character_id, party_id) VALUES (?, ?)',
                (character_id, party_id)
            )
            db.commit()
            flash('Character added to party successfully!', 'success')
        except Exception as e:
            flash(f'Error adding character to party: {str(e)}', 'error')
        
        return redirect(url_for('party_detail', party_id=party_id))

    @app.route('/party/<int:party_id>/remove-character/<int:character_id>', methods=['POST'])
    def remove_character_from_party(party_id, character_id):
        db = get_db()
        try:
            db.execute(
                'DELETE FROM character_parties WHERE character_id = ? AND party_id = ?',
                (character_id, party_id)
            )
            db.commit()
            flash('Character removed from party successfully!', 'success')
        except Exception as e:
            flash(f'Error removing character from party: {str(e)}', 'error')
        
        return redirect(url_for('party_detail', party_id=party_id))

    @app.route('/api/search-suggestions')
    def search_suggestions():
        query = request.args.get('q', '').strip()
        if not query or len(query) < 2:
            return jsonify([])

        db = get_db()
        # Search across multiple fields and return distinct suggestions
        suggestions = db.execute('''
            SELECT DISTINCT name as text, 'name' as type FROM dnd_characters
            WHERE name LIKE ?
            UNION
            SELECT DISTINCT race as text, 'race' as type FROM dnd_characters
            WHERE race LIKE ?
            UNION
            SELECT DISTINCT character_class as text, 'class' as type FROM dnd_characters
            WHERE character_class LIKE ?
            UNION
            SELECT DISTINCT short_description as text, 'description' as type FROM dnd_characters
            WHERE short_description LIKE ?
            ORDER BY text
            LIMIT 10
        ''', (f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%')).fetchall()

        return jsonify([dict(suggestion) for suggestion in suggestions])

    @app.route('/api/characters/not-in-party/<int:party_id>')
    def characters_not_in_party(party_id):
        db = get_db()
        characters = db.execute('''
            SELECT c.* FROM dnd_characters c
            WHERE c.id NOT IN (
                SELECT cp.character_id FROM character_parties cp WHERE cp.party_id = ?
            )
            ORDER BY c.name
        ''', (party_id,)).fetchall()

        return jsonify([dict(char) for char in characters])

    @app.route('/about')
    def about():
        return render_template('about.html', active_page='about')

    @app.route('/contact')
    def contact():
        return render_template('contact.html', active_page='contact')

    # Error handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
