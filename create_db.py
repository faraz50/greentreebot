import sqlite3

DB_FILE = "database.db"

def create_tables():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # ایجاد جدول users
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            birth_year INTEGER NOT NULL,
            total_tokens INTEGER NOT NULL DEFAULT 0,
            wallet_address TEXT DEFAULT NULL
        )
    """)

    # ایجاد جدول token_logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS token_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            tokens INTEGER NOT NULL,
            category TEXT NOT NULL,
            platform TEXT DEFAULT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    create_tables()
