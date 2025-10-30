# CSS Organization for Flask Projects

This guide explains how to organize CSS files when transitioning from a static HTML website to a Flask web application.

## Current Structure vs. Flask Structure

### Current Structure
```
static-site/
├── styles.css
├── script.js
├── index.html
├── recipe-detail.html
├── add-recipe.html
├── about-this.html
├── contact.html
├── images/
└── audio/
```

### Recommended Flask Structure
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
│   ├── add_recipe.html
│   ├── about.html
│   └── contact.html
└── app.py
```

## Moving CSS to Flask

When converting this project to Flask, follow these steps:

1. **Create the directory structure**:
   ```
   mkdir -p static/css static/js static/images
   ```

2. **Move your CSS and JavaScript files**:
   ```
   mv styles.css static/css/
   mv script.js static/js/
   ```

3. **Update references in HTML templates**:
   ```html
   <!-- Before -->
   <link rel="stylesheet" href="styles.css">
   <script src="script.js"></script>
   
   <!-- After (in Flask templates) -->
   <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
   <script src="{{ url_for('static', filename='js/script.js') }}" defer></script>
   ```

## Why This Structure Works

1. **Flask Convention**: Flask automatically looks for static files in the `static` folder
2. **Clear Separation**: Keeps code (templates) separate from assets (CSS, JS, images)
3. **Browser Caching**: Browsers can cache static assets efficiently
4. **Easy Updates**: Makes it simple to update styles without changing templates

## CSS Best Practices for Beginners

1. **Keep CSS Organized**: 
   - Group related styles together with clear section headers
   - Use consistent indentation and formatting
   - Add helpful comments to explain what styles do

2. **Use Descriptive Class Names**:
   - `.recipe-card` instead of `.card1`
   - `.header-logo` instead of `.logo`
   - Names should describe what the element is, not how it looks

3. **Avoid Inline Styles**:
   - Keep all styles in the CSS file, not in HTML attributes
   - This makes styles easier to maintain and update

4. **Mobile-First Approach**:
   - Start with styles for mobile devices
   - Add media queries to enhance the design for larger screens
   - Use responsive grid techniques like `repeat(auto-fill, minmax(250px, 1fr))` for layouts

5. **Centralize Shared Behaviour**:
   - Store JavaScript such as the navigation toggle in `script.js`
   - Load it once per page via the base template to avoid duplication

## Example: Linking CSS in Flask Templates

In your Flask application, you'll use Jinja2 templates to include CSS files:

**base.html**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Filipino Recipes{% endblock %}</title>
    
    <!-- Link to CSS using Flask's url_for function -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
    
    <!-- Page-specific CSS can be added in templates that extend this one -->
    {% block extra_css %}{% endblock %}
</head>
<body>
    <!-- Header content -->
    <header class="header">
        <!-- ... -->
    </header>
    
    <!-- Main content block that will be replaced in child templates -->
    {% block content %}{% endblock %}
    
    <!-- Footer content -->
    <footer class="footer">
        <!-- ... -->
    </footer>
    
    <!-- JavaScript can be included here -->
    <script src="{{ url_for('static', filename='js/script.js') }}" defer></script>
</body>
</html>
```

**index.html**:
```html
{% extends "base.html" %}

{% block title %}Home - Filipino Recipes{% endblock %}

{% block content %}
<main class="content grid-4-col">
    <!-- Recipe cards would be generated in a loop -->
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
</main>
{% endblock %}
```

## Next Steps for Students

1. Study the improved CSS structure with its clear comments
2. Practice organizing CSS by related components
3. Learn how Flask's `url_for()` function works with static files
4. Experiment with template inheritance in Flask and ensure shared assets (CSS/JS) are loaded from the base template

Remember that good CSS organization makes your code more maintainable and easier to understand, which is especially important when working with Flask templates.
