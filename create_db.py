import sqlite3

DB_FILE = "airdrop_bot.db"

def create_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # ✅ ایجاد جدول کاربران فقط در صورتی که وجود نداشته باشد
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            first_name TEXT,
            birth_year INTEGER,
            total_tokens INTEGER DEFAULT 0,
            wallet_address TEXT DEFAULT NULL
        )
    """)

    # ✅ ایجاد جدول لاگ‌های امتیازات
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS token_logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            tokens INTEGER,
            category TEXT CHECK(category IN ('invite', 'social', 'purchase', 'birth_year')),
            platform TEXT DEFAULT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)

    # ✅ ایجاد جدول تراکنش‌ها
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount INTEGER,
            status TEXT CHECK(status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)

    # ✅ ایجاد جدول مجموع کل ایردراپ
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS global_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_airdrop_tokens INTEGER DEFAULT 0
        )
    """)

    # مقداردهی اولیه برای global_stats فقط اگر مقداردهی نشده باشد
    cursor.execute("INSERT INTO global_stats (total_airdrop_tokens) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM global_stats)")

    conn.commit()
    conn.close()
    print("✅ پایگاه داده به‌روز شد!")

# اجرای تابع ایجاد پایگاه داده
create_db()
