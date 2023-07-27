from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

class Config(object):
    SQLALCHEMY_DATABASE_URI = "sqlite:///../resources/nhanes.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app=Flask(__name__)    
app.config.from_object(Config)
db=SQLAlchemy(app)
# migrate=Migrate(app,db)
