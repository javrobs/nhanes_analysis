from app import app,db
import app.models as model
from flask import render_template, jsonify, request


@app.route("/index.html")
def test(input="data_release_cycle_table"):
    variables_d = {'gender': 'Gender',
                  'age_in_years_at_screening': 'Age',
                  'race_ethnic_origin': 'Ethnicity',
                  'served_in_the_us_armed_forces': 'Served in the Army',
                  'country_of_birth': 'Country of birth',
                  'citizenship_status': 'Citizenship status',
                  'education_level_children_youth_6_19': 'Education level (children)',
                  'education_level_adults_20': 'Education level (adults)',
                  'marital_status': 'Marital status',
                  'total_number_of_people_in_the_household': 'Household size',
                  'total_number_of_people_in_the_family': 'Family size',
                  'annual_household_income': 'Annual household income',
                  'annual_family_income': 'Annual family income',
                  'ratio_of_family_income_to_poverty': 'Ratio of income to poverty',
                  'hh_ref_person_gender': "HH ref person's gender",
                  'hh_ref_person_age': "HH ref person's age",
                  'hh_ref_person_education_level': "HH ref person's education level",
                  'hh_ref_person_marital_status': "HH ref person's marital status",
                  'hh_ref_person_spouse_education_level': "HH ref person's spouse education level"}
    
    dict={"data_release_cycle_table":model.data_release_cycle_table,
          "gender_table":model.gender_table}
    
    result=dict[input].query.all()
    
    print(result)
    
    return render_template("index.html",result=result, variables_d=variables_d)


@app.route('/queries', methods=['POST'])
def queries():
    if request.method == 'POST':
        print(request.json['column'])
    return 'hola'


