from flask import Flask
from app.extensions import init_mongo
from app.webhook.routes import webhook
from flask_cors import CORS


# Creating our flask app
def create_app():

    app = Flask(__name__)

    # Enable CORS
    CORS(app, origins=["http://localhost:5173"])

    # Setup Mongo
    init_mongo(app)
    
    
    # registering all the blueprints
    app.register_blueprint(webhook)
    
    return app
