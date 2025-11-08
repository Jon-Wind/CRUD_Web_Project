import os
import sqlite3

import click
from flask import current_app, g


def get_db():
    if 'db' not in g:
        database_path = current_app.config['DATABASE']
        g.db = sqlite3.connect(database_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()
    schema_path = current_app.config.get('SCHEMA_PATH', 'schema.sql')
    
    # First, create the table if it doesn't exist
    with current_app.open_resource(schema_path) as f:
        # Split the SQL file into individual statements
        sql_script = f.read().decode('utf-8')
        
        # Execute the table creation part
        create_table_sql = sql_script.split('-- Sample D&D Characters')[0]
        db.executescript(create_table_sql)
        
        # Check if the table is empty
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM dnd_characters")
        count = cursor.fetchone()['count']
        
        # Only insert sample data if the table is empty
        if count == 0 and '-- Sample D&D Characters' in sql_script:
            sample_data_sql = '-- Sample D&D Characters' + sql_script.split('-- Sample D&D Characters')[1]
            db.executescript(sample_data_sql)
    
    db.commit()


def init_app(app):
    app.teardown_appcontext(close_db)

    @app.cli.command('init-db')
    def init_db_command():
        """Clear existing data and create new tables."""
        init_db()
        click.echo('Initialized the database.')


__all__ = ['get_db', 'init_db', 'init_app']
