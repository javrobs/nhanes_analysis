from app import app,db
import app.models as model
from flask import render_template,jsonify


@app.route("/")
def home():
    return "api-landsite"

@app.route("/test")
def test():
    result=model.data_release_cycle_table.query.first()
    return render_template("index.html",result=result)
@app.route("/endpoint")
def endpoint():
    return render_template("index.html")

@app.route("/columns/<year>")
def columns(year): 
    return list(df[year].columns) 



