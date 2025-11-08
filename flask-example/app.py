import os
import uuid

from flask import Flask, render_template, request, redirect, url_for, current_app, abort
from werkzeug.utils import secure_filename

from db import get_db, init_app


ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}


def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'dnd_characters.db'),
        SCHEMA_PATH='schema.sql',
        UPLOAD_FOLDER=os.path.join(app.static_folder, 'images', 'uploads')
    )

    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize the database
    init_app(app)
    
    # Create database tables if they don't exist
    with app.app_context():
        from db import init_db
        init_db()

    register_routes(app)

    return app


def register_routes(app):
    @app.route('/')
    def index():
        search_query = request.args.get('search', '').strip()
        db = get_db()
        
        if search_query:
            query = """
                SELECT id, name, race, character_class, level, short_description, image_path, alignment 
                FROM dnd_characters 
                WHERE name LIKE ? OR race LIKE ? OR character_class LIKE ? OR short_description LIKE ?
                ORDER BY name
            """
            search_pattern = f'%{search_query}%'
            rows = db.execute(query, (search_pattern, search_pattern, search_pattern, search_pattern)).fetchall()
        else:
            rows = db.execute(
                'SELECT id, name, race, character_class, level, short_description, image_path, alignment '
                'FROM dnd_characters ORDER BY name'
            ).fetchall()
            
        characters = [dict(row) for row in rows]
        return render_template('index.html', 
                            characters=characters, 
                            active_page='home',
                            search_query=search_query)

    @app.route('/character/<int:character_id>')
    def character_detail(character_id):
        db = get_db()
        character_row = db.execute('SELECT * FROM dnd_characters WHERE id = ?', (character_id,)).fetchone()

        if character_row is None:
            return "Character not Found", 404

        character = dict(character_row)
        
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

        return render_template('character_detail.html', character=character_context, active_page='character_detail')

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
                    image_alt = name or filename

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
                    db.commit()
                    new_id = cursor.lastrowid
                    return redirect(url_for('character_detail', character_id=new_id))
                except db.IntegrityError:
                    error = f"Character '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"

        return render_template('add_character.html', active_page='add_character', error=error)

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
                    db.commit()
                    return redirect(url_for('character_detail', character_id=character_id))
                except db.IntegrityError:
                    error = f"Character '{name}' already exists."
                except Exception as e:
                    error = f"An error occurred: {str(e)}"

            character = {
                'name': name,
                'alignment': alignment,
                'race': race,
                'character_class': character_class,
                'level': level,
                'background': background,
                'short_description': short_description,
                'backstory': backstory,
                'personality': personality,
                'abilities_skills': abilities_skills,
                'image_path': image_path,
                'image_alt': image_alt
            }

        return render_template('edit_character.html', character=character, error=error, active_page='edit_character')

    @app.route('/character/<int:character_id>/delete', methods=['POST'])
    def delete_character(character_id):
        db = get_db()
        db.execute('DELETE FROM dnd_characters WHERE id = ?', (character_id,))
        db.commit()
        return redirect(url_for('index'))

    @app.route('/about')
    def about():
        return render_template('about.html', active_page='about')

    @app.route('/contact')
    def contact():
        return render_template('contact.html', active_page='contact')


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
