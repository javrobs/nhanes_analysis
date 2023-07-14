from flask import Flask, jsonify, render_template
import pandas as pd

app=Flask(__name__)

df={}
df["07"]=pd.read_csv("resources/table_export_0708.csv")
df["17"]=pd.read_csv("resources/table_export_1718.csv")

@app.route("/")
def home():
    return "api-landsite"

@app.route("/test")
def test():
    return jsonify(["connected to api"])

@app.route("/endpoint")
def endpoint():
    return render_template("index.html")

@app.route("/columns/<year>")
def columns(year): 
    return list(df[year].columns) 

if __name__=="__main__":
    app.run(debug=True)


