"""
Database Initialization Script

This script initializes the database for the D&D Character Manager application.
It creates all necessary tables and loads initial sample data if the database is empty.

Usage:
    python init_db.py

This script is typically run during initial setup or after database schema changes.
It uses the application factory pattern to ensure all database configurations
are properly loaded before initialization.
"""
from app import create_app
from db import init_db

# Create the Flask application instance using the application factory
app = create_app()

# Initialize the database within the application context
with app.app_context():
    # Call the init_db function to create tables and load sample data
    init_db()
    print("Database initialized successfully!")
