from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

mongo = PyMongo()

def init_mongo(app):
    load_dotenv()
    uri = os.getenv("MONGO_URI")

    if not uri:
        raise Exception("MONGO_URI not found in .env")

    app.config["MONGO_URI"] = uri
    mongo.init_app(app)
