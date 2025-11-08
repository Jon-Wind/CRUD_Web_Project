from app import create_app
from db import init_db

app = create_app()

with app.app_context():
    # This will drop all tables and recreate them
    db = init_db()
    print("Database has been reset and reinitialized with sample data.")
    print("Note: This only adds sample data if the table is empty.")
