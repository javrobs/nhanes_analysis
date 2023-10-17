# Database route:
class Config(object):
    SQLALCHEMY_DATABASE_URI = "sqlite:///../resources/nhanes.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False