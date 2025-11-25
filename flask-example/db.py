"""
Database Module for D&D Character Manager

This module handles all database operations for the application, including:
- Database connection management
- Schema initialization
- Database migration utilities

It uses SQLite as the database engine and Flask's application context
for managing database connections.
"""
import os
import sqlite3

import click
from flask import current_app, g


def get_db():
    """
    Get or create a database connection for the current application context.
    
    This function implements the connection pooling pattern by storing the database
    connection in Flask's application context (g). If no connection exists,
    it creates a new one and configures it to return rows as dictionaries.
    
    Returns:
        sqlite3.Connection: A database connection object
    """
    if 'db' not in g:
        database_path = current_app.config['DATABASE']
        g.db = sqlite3.connect(database_path)
        # Configure the connection to return rows as dictionaries
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    """
    Close the database connection if it exists.
    
    This function is registered to be called when the application context is torn down.
    It ensures that database connections are properly closed to prevent resource leaks.
    
    Args:
        e: Optional exception that triggered the teardown (unused)
    """
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    """
    Initialize the database by creating tables and optionally loading sample data.
    
    This function:
    1. Reads the schema from the SQL file
    2. Creates all necessary tables if they don't exist
    3. Loads sample data if the database is empty
    
    The schema file is split into two parts:
    - Table creation statements (before '-- Sample D&D Characters')
    - Sample data insertion (after '-- Sample D&D Characters')
    
    Note: Sample data is only inserted if the database is empty to prevent
    duplicate entries on subsequent application starts.
    """
    db = get_db()
    schema_path = current_app.config.get('SCHEMA_PATH', 'schema.sql')
    
    # First, create the table if it doesn't exist
    with current_app.open_resource(schema_path) as f:
        # Read and decode the SQL script
        sql_script = f.read().decode('utf-8')
        
        # Execute the table creation part (everything before sample data)
        create_table_sql = sql_script.split('-- Sample D&D Characters')[0]
        db.executescript(create_table_sql)
        
        # Check if the table is empty
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM dnd_characters")
        count = cursor.fetchone()['count']
        
        # Only insert sample data if the table is empty and sample data exists
        if count == 0 and '-- Sample D&D Characters' in sql_script:
            sample_data_sql = '-- Sample D&D Characters' + sql_script.split('-- Sample D&D Characters')[1]
            db.executescript(sample_data_sql)
    
    # Commit all changes to the database
    db.commit()


def init_app(app):
    """
    Register database functions with the Flask application.
    
    This function is called by the application factory to:
    1. Register the close_db function to be called when the application context ends
    2. Add a custom CLI command for database initialization
    
    Args:
        app (Flask): The Flask application instance
    """
    # Register the database cleanup function
    app.teardown_appcontext(close_db)

    # Add a custom CLI command for database initialization
    @app.cli.command('init-db')
    def init_db_command():
        """
        CLI command to initialize the database.
        
        This command can be run from the command line using:
            flask init-db
            
        It will create all necessary tables and load sample data if the database is empty.
        """
        init_db()
        click.echo('Successfully initialized the database.')


__all__ = ['get_db', 'init_db', 'init_app']
