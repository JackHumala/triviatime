import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
import datetime

# Load variables from .env file
load_dotenv()

app = Flask(__name__)

# === CORS Setup ===
# Only allow your React dev server origin on /api/* endpoints
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client.triviatime
leaderboard_collection = db.scores
questions_collection = db.questions

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    # Fetch top 50 scores, sorted descending
    scores = list(
        leaderboard_collection
        .find()
        .sort("score", -1)
        .limit(50)
    )

    # Convert ObjectId and datetime to strings
    for score in scores:
        score["_id"] = str(score["_id"])
        if "date" in score and isinstance(score["date"], datetime.datetime):
            score["date"] = score["date"].isoformat()

    return jsonify(scores), 200


@app.route('/api/leaderboard', methods=['POST'])
def add_score():
    data = request.get_json(force=True)
    name = data.get("name")
    score_val = data.get("score")

    if not name or score_val is None:
        return jsonify({"error": "Missing name or score"}), 400

    result = leaderboard_collection.insert_one({
        "name": name,
        "score": score_val,
        "date": datetime.datetime.utcnow()
    })

    return jsonify({"success": True, "id": str(result.inserted_id)}), 201

@app.route('/api/questions', methods=['GET'])
def get_questions():
    #fetch questions from the DB
    all_questions = list(questions_collection.find())

    if not all_questions:
        return jsonify({"error": "No questions found in the database"}), 404

    #format for frontend
    formatted_questions = []
    for q in all_questions:
        formatted_questions.append({
            "question": q.get("Question"),
            "choices": [
                q.get("Choice1"),
                q.get("Choice2"),
                q.get("Choice3")
            ],
            "answer": q.get("Answer"),
            "_id": str(q.get("_id"))
        })

    return jsonify(formatted_questions), 200

if __name__ == '__main__':
    # If you still see other services on 5000, switch to 5001 here and adjust your React proxy
    app.run(port=5000, debug=True)
