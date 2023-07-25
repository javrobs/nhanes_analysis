from app import app,db
import app.models as model
from flask import render_template,jsonify



@app.route("/<input>")
def test(input="data_release_cycle_table"):
    dict={"data_release_cycle_table":model.data_release_cycle_table,
          "gender_table":model.gender_table}
    result=dict[input].query.all()
    print(result)
    return render_template("index.html",result=result)




