from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import random
import time
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

DATABASE = "abacus-playground.db"

# Initialize DB
def init_db():
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS player_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id TEXT UNIQUE,
                    total_rounds INTEGER DEFAULT 0,
                    total_numbers_processed INTEGER DEFAULT 0,
                    total_time REAL DEFAULT 0.0
                )
            """)
            conn.commit() 
            logging.info("Created table")
    except sqlite3.Error as e:
          logging.error(f"Database connection failed: {str(e)}")

@app.route("/generate-numbers", methods=["POST"])
def generate_numbers():
    data = request.get_json()
    count = data.get("count", 5)
    numbers = []
    total = 0
    for _ in range(count):
        num = 0
        while num == 0 or (num < 0 and abs(num) > total):
            num = random.randint(-100, 100)

        if num < 0 and abs(num) > total:
            num = -total
        
        total += num
        numbers.append(num)

    return jsonify({"numbers": numbers, "final_result": total})  # Include final result

@app.route("/submit", methods=["POST"])
def receive_stats():
    data = request.get_json()
    player_id = data["playerID"]
    rounds = data["rounds"]
    numbers_processed = data["numbersProcessed"]
    time_taken = data["timeTaken"]

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM player_stats WHERE player_id = ?", (player_id,))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("""
                UPDATE player_stats 
                SET total_rounds = total_rounds + ?, 
                    total_numbers_processed = total_numbers_processed + ?, 
                    total_time = total_time + ? 
                WHERE player_id = ?
            """, (rounds, numbers_processed, time_taken, player_id))
        else:
            cursor.execute("""
                INSERT INTO player_stats (player_id, total_rounds, total_numbers_processed, total_time) 
                VALUES (?, ?, ?, ?)
            """, (player_id, rounds, numbers_processed, time_taken))
        
        conn.commit()

    return jsonify({"message": "Stats saved!"}), 200

@app.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT player_id, total_rounds, total_numbers_processed, total_time 
            FROM player_stats ORDER BY total_rounds DESC LIMIT 10
        """)
        leaderboard = cursor.fetchall()

    return jsonify({"leaderboard": leaderboard}), 200

def check_db_connection():
    logging.info(">>>>> checking connection <<<<<");
    try:
        conn = sqlite3.connect(DATABASE)
        conn.cursor().execute("SELECT 1")  # Simple query to check connection
        conn.close()
        logging.info("Database connection successful!")

        return True
    except sqlite3.Error as e:
        logging.error(f"Database connection failed: {str(e)}")

        return False

if __name__ == "__main__":
    init_db() 
    check_db_connection()
    app.run(debug=True, host="0.0.0.0", port=5000)
