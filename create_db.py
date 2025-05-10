import sqlite3

def create_tables():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            first_name TEXT,
            birth_year INTEGER,
            total_tokens INTEGER,
            wallet_address TEXT
        )
    """)

    print("✅ Table 'users' created successfully.")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_tables()
