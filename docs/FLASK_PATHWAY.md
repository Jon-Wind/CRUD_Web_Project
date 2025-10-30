# Flask Pathway: From Static HTML to Dynamic Web Application

This document outlines the educational pathway for Year 12 software engineering students to transform this static HTML website into a dynamic Flask web application with SQL database integration.

## Current Structure: Flat HTML Website

The current project demonstrates fundamental web development concepts:

1. **HTML Structure**: Multiple pages with consistent layout (index, recipe-detail, about-this, contact, add-recipe)
2. **CSS Styling**: Responsive design using flexbox and grid layouts (including the new `grid-4-col` auto-fill behaviour)
3. **Shared JavaScript**: A single `script.js` handles the hamburger navigation toggle with accessibility updates
4. **Asset Management**: Local images and audio files organized in dedicated folders
5. **Form Handling**: Basic form structure in add-recipe.html (currently non-functional)

## Educational Value

This project is valuable for Year 12 students because it:

1. **Demonstrates Clean HTML/CSS**: Shows proper separation of structure and presentation
2. **Illustrates Responsive Design**: Uses media queries to adapt to different screen sizes
3. **Shows Consistent Navigation**: Header and footer patterns across all pages
4. **Presents Form Design**: Input fields, labels, and submission buttons

## Pathway to Flask and SQL

### 1. Flask Integration

- **Start from the existing example**:
  - The repository already includes a starter implementation in `flask-example/`
  - Use `flask-example/app.py`, `flask-example/templates/base.html`, and `flask-example/templates/index.html` as reference points

- **Convert the remaining HTML to templates**:
  - Move the static HTML pages into `flask-example/templates/`
  - Make each page extend `base.html` using `{% extends "base.html" %}` and define `{% block content %}`
  - Keep shared assets in `flask-example/static/` (CSS, JS, images, audio)

- **Template checklist** (align with routes already defined in `flask-example/app.py`):
  - `/` → `templates/index.html` (already provided)
  - `/recipe/<int:recipe_id>` → `templates/recipe_detail.html`
  - `/add-recipe` → `templates/add_recipe.html`
  - `/about` → `templates/about.html`
  - `/contact` → `templates/contact.html`
  > **Tip:** Copy the corresponding static HTML files into `templates/`, update paths with `url_for`, and remove duplicate `<head>` sections because `base.html` supplies them.

- **Create Flask application structure**:
  ```python
  from flask import Flask, render_template
  
  app = Flask(__name__)
  
  @app.route('/')
  def index():
      return render_template('index.html')
  
  @app.route('/recipe/<recipe_id>')
  def recipe_detail(recipe_id):
      # Later will fetch from database
  ```
  > **Teaching tip:** Replace the placeholder `action="submit-recipe.html"` in `add-recipe.html` with this route when you connect the form to Flask.

- **Organize Static Files**:
  - Store styles in `static/css/styles.css`
  - Store JavaScript in `static/js/script.js` (copy the root `script.js` and load it from `base.html`)
  - Keep images and audio inside `static/images/` and `static/audio/`
  - Update references in templates:
    ```html
    <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
    <script src="{{ url_for('static', filename='js/script.js') }}" defer></script>
    ```
  - Remove duplicate inline scripts from individual templates once the shared file is referenced.

### 2. Database Integration

- **Beginner-Friendly Raw SQLite (recommended starting point)**:
  1. Create an `instance/` folder (e.g., run `mkdir flask-example/instance`) so SQLite has a place to store the database file.
  2. Create `flask-example/schema.sql` with a single table:
     ```sql
     CREATE TABLE recipes (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         category TEXT NOT NULL,
         short_description TEXT NOT NULL,
         long_description TEXT,
         ingredients_text TEXT,
         directions_text TEXT,
         image_path TEXT,
         audio_path TEXT,
         prep_time TEXT,
         cook_time TEXT,
         difficulty TEXT
     );
     ```
  3. Add `flask-example/db.py` to manage connections with raw `sqlite3`:
     ```python
     import sqlite3
     from flask import g

     DATABASE = 'instance/recipes.db'

     def get_db():
         if 'db' not in g:
             g.db = sqlite3.connect(DATABASE)
             g.db.row_factory = sqlite3.Row
         return g.db

     @app.teardown_appcontext
     def close_db(error):
         db = g.pop('db', None)
         if db is not None:
             db.close()
     ```
  4. Register a CLI helper in `app.py` so students can initialize (or reset) the database:
     ```python
     @app.cli.command('init-db')
     def init_db():
         with app.app_context():
             db = get_db()
             db.executescript(open('schema.sql').read())
             db.commit()
     ```
  5. Replace the in-memory list with parameterized SQL queries:
     ```python
     db = get_db()
     recipes = db.execute(
         'SELECT id, name, category, short_description FROM recipes'
     ).fetchall()
     recipe = db.execute(
         'SELECT * FROM recipes WHERE id = ?', (recipe_id,)
     ).fetchone()
     ```
  6. Pass full recipe data to the detail template, splitting text areas into lists inside the view so templates stay simple:
     ```python
     recipe = db.execute(
         'SELECT * FROM recipes WHERE id = ?', (recipe_id,)
     ).fetchone()
     ingredients = (recipe['ingredients_text'] or '').splitlines()
     directions = (recipe['directions_text'] or '').splitlines()
     return render_template(
         'recipe_detail.html',
         recipe=recipe,
         ingredients=[line for line in ingredients if line.strip()],
         directions=[line for line in directions if line.strip()]
     )
     ```
  7. Handle form submissions for `/add-recipe` using raw POST data, then commit and redirect:
     ```python
     @app.route('/add-recipe', methods=['GET', 'POST'])
     def add_recipe():
         if request.method == 'POST':
             name = request.form.get('recipe-name', '').strip()
             category = request.form.get('recipe-category', '').strip()
             short_desc = request.form.get('recipe-desc', '').strip()
             long_desc = request.form.get('directions', '').strip()
             ingredients_text = request.form.get('ingredients', '')
             directions_text = request.form.get('directions', '')

- **Create Database Models (when ready for SQLAlchemy)**:
  ```python
  from flask_sqlalchemy import SQLAlchemy
  
  db = SQLAlchemy(app)
  
  class Recipe(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), nullable=False)
      description = db.Column(db.Text, nullable=False)
      ingredients = db.Column(db.Text, nullable=False)
      directions = db.Column(db.Text, nullable=False)
      category = db.Column(db.String(50), nullable=False)
      image_path = db.Column(db.String(255))
  ```

- **Populate Templates with Data**:
  ```python
  @app.route('/')
  def index():
      recipes = Recipe.query.all()
      return render_template('index.html', recipes=recipes)
  ```

- **In Templates**:
  ```html
  {% for recipe in recipes %}
  <article class="card" data-category="{{ recipe.category }}" data-recipe-id="{{ recipe.id }}">
      <header class="card-header">
          <p class="category">{{ recipe.category }}</p>
          <h3><a href="{{ url_for('recipe_detail', recipe_id=recipe.id) }}" class="recipe-link">{{ recipe.name }}</a></h3>
      </header>
      <div class="card-body">
          <p class="recipe-short-des">{{ recipe.description }}</p>
      </div>
  </article>
  {% endfor %}
  ```

### 3. Form Processing

- **Create Form Classes with Flask-WTF**:
  ```python
  from flask_wtf import FlaskForm
  from wtforms import StringField, TextAreaField, FileField, SubmitField
  from wtforms.validators import DataRequired
  
  class RecipeForm(FlaskForm):
      name = StringField('Recipe Name', validators=[DataRequired()])
      description = StringField('Description', validators=[DataRequired()])
      ingredients = TextAreaField('Ingredients', validators=[DataRequired()])
      directions = TextAreaField('Directions', validators=[DataRequired()])
      image = FileField('Upload Image')
      submit = SubmitField('Add')
  ```

- **Handle Form Submission**:
  ```python
  @app.route('/add-recipe', methods=['GET', 'POST'])
  def add_recipe():
      form = RecipeForm()
      if form.validate_on_submit():
          # Process form data and save to database
          new_recipe = Recipe(
              name=form.name.data,
              description=form.description.data,
              ingredients=form.ingredients.data,
              directions=form.directions.data
          )
          db.session.add(new_recipe)
          db.session.commit()
          return redirect(url_for('index'))
      return render_template('add_recipe.html', form=form)
  ```

### 4. Additional Features

- **User Authentication**:
  - Implement login/registration with Flask-Login
  - Add user relationships to recipes

- **Search Functionality**:
  - Create search forms and queries
  - Implement filtering by category

- **API Development**:
  - Create RESTful endpoints for recipe data
  - Enable AJAX interactions

## Recommended Flask Project Structure

```
flask-app/
├── static/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   ├── images/
│   └── audio/
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── recipe_detail.html
│   ├── about.html
│   ├── contact.html
│   └── add_recipe.html
├── models.py      # Database models
├── routes.py      # Route handlers
├── forms.py       # Form classes
├── app.py         # Application setup
└── instance/
    └── database.db
```

## Learning Progression

1. **Week 1**: Flask basics, templates, and static files
2. **Week 2**: Database setup and models
3. **Week 3**: Forms and data validation
4. **Week 4**: User authentication
5. **Week 5**: Advanced features (search, API)

This pathway provides a structured approach to transforming a static website into a fully functional web application, introducing students to important concepts in modern web development including server-side programming, databases, and user authentication.
