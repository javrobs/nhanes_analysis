from flask import Flask, jsonify, render_template

app=Flask(__name__)


@app.route("/")
def home():
    return "api-landsite"

@app.route("/test")
def test():
    return jsonify(["connected to api"])

@app.route("/endpoint")
def endpoint():
    return render_template("index.html")


if __name__=="__main__":
    app.run(debug=True)


