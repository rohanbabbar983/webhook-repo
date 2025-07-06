# app/webhook/routes.py
from flask import Blueprint, request, jsonify
from app.extensions import mongo

webhook = Blueprint('webhook', __name__, url_prefix='/webhook')

@webhook.route('/receiver', methods=["POST"])
def receiver():
    event_type = request.headers.get("X-GitHub-Event")
    payload = request.json

    if not event_type or not payload:
        return {"error": "Invalid payload"}, 400

    document = {
        "request_id": None,
        "author": None,
        "action": None,
        "from_branch": None,
        "to_branch": None,
        "timestamp": None
    }

    if event_type == "push":
        document["request_id"] = payload["head_commit"]["id"]
        document["author"] = payload["head_commit"]["author"]["name"]
        document["action"] = "PUSH"
        document["to_branch"] = payload["ref"].split("/")[-1]
        document["timestamp"] = payload["head_commit"]["timestamp"]
        # from_branch stays None

    elif event_type == "pull_request":
        pr = payload["pull_request"]
        action = payload.get("action")

        if action == "opened":
            document["request_id"] = str(pr["id"])
            document["author"] = pr["user"]["login"]
            document["action"] = "PULL_REQUEST"
            document["from_branch"] = pr["head"]["ref"]
            document["to_branch"] = pr["base"]["ref"]
            document["timestamp"] = pr["created_at"]

        elif action == "closed" and pr.get("merged"):
            document["request_id"] = str(pr["id"])
            document["author"] = pr["user"]["login"]
            document["action"] = "MERGE"
            document["from_branch"] = pr["head"]["ref"]
            document["to_branch"] = pr["base"]["ref"]
            document["timestamp"] = pr["merged_at"]

    # If document is valid, insert
    if document["action"]:
        try:
            mongo.db.events.insert_one(document)
            return jsonify({"status": "stored", "data": document}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"status": "ignored"}), 200

@webhook.route('/api/events', methods=["GET"])
def get_events():
    events = mongo.db.events.find().sort("_id", -1)
    result = []

    for e in events:
        result.append({
            "request_id": e.get("request_id"),
            "author": e.get("author"),
            "action": e.get("action"),
            "from_branch": e.get("from_branch"),
            "to_branch": e.get("to_branch"),
            "timestamp": e.get("timestamp")
        })

    return jsonify(result)


