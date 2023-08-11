from app import app,db
import app.models as model
from flask import render_template, jsonify, request,redirect,url_for

#Proper names for all columns in main table
variables_d = {'gender': 'Gender',
            'age_in_years_at_screening': 'Age',
            'race_ethnic_origin': 'Ethnicity',
            'served_in_the_us_armed_forces': 'Served in the Army',
            'country_of_birth': 'Country of birth',
            'citizenship_status': 'Citizenship status',
            # 'education_level_children_youth_6_19': 'Education level (children)',
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

#Table corresponding foreign keys for each column
reference_table={'gender': 'gender_table',
            'age_in_years_at_screening': 'age_groups_table',
            'race_ethnic_origin': 'race_ethnic_origin_table',
            'served_in_the_us_armed_forces': 'served_in_the_us_armed_forces_table',
            'country_of_birth': 'country_of_birth_table',
            'citizenship_status': 'citizenship_status_table',
            # 'education_level_children_youth_6_19': 'education_level_children_table',
            'education_level_adults_20': 'education_level_adults_table',
            'marital_status': 'marital_status_table',
            'total_number_of_people_in_the_household': 'total_number_of_people_table',
            'total_number_of_people_in_the_family': 'total_number_of_people_table',
            'ratio_of_family_income_to_poverty':'ratio_of_family_income_to_poverty_table',
            'annual_household_income': 'annual_income_table',
            'annual_family_income': 'annual_income_table',
            'hh_ref_person_gender': "gender_table",
            'hh_ref_person_age': "age_groups_table",
            'hh_ref_person_education_level': "education_level_adults_table",
            'hh_ref_person_marital_status': "marital_status_table",
            'hh_ref_person_spouse_education_level': "education_level_adults_table"}


@app.route("/")
def home(input="data_release_cycle_table"):
    
    #Return in variables_d all pairs of names/variables
    return render_template("index.html", variables_d=variables_d)

@app.route('/queries', methods=['POST','GET'])
def queries():
    if request.method == 'POST':
        #Store column chosen in column variable
        column=request.json['column']
        #Create response list to populate with query response as dictionaries
        response=[]
        #Define cycles and years
        data_release_cycles=[5,10]
        years=['2007-2008','2017-2018']
        "Iterate both as a zip"
        for year,cycle in zip(years,data_release_cycles):
            #Generate text for sql query
            SQL_text=f"""
            SELECT 
                  main.{column} as id,
                  ref.description as description,
                  '{year}' as year,
                  ROUND(AVG(money_spent_at_supermarket_grocery_store),2) as groceries,
                  ROUND(AVG(money_spent_on_nonfood_items),2) as non_food,
                  ROUND(AVG(money_spent_on_food_at_other_stores),2) as other_stores,
                  ROUND(AVG(money_spent_on_eating_out),2) as eating_out,
                  ROUND(AVG(money_spent_on_carryout_delivered_foods),2) as delivered,
                  ROUND(AVG(money_spent_at_supermarket_grocery_store)*100/
                  (AVG(money_spent_at_supermarket_grocery_store)+
                  AVG(money_spent_on_nonfood_items)+
                  AVG(money_spent_on_food_at_other_stores)+
                  AVG(money_spent_on_eating_out)+
                  AVG(money_spent_on_carryout_delivered_foods)),2) as groceries_percentage,
                  ROUND(AVG(money_spent_on_nonfood_items)*100/
                  (AVG(money_spent_at_supermarket_grocery_store)+
                  AVG(money_spent_on_nonfood_items)+
                  AVG(money_spent_on_food_at_other_stores)+
                  AVG(money_spent_on_eating_out)+
                  AVG(money_spent_on_carryout_delivered_foods)),2) as non_food_percentage,
                  ROUND(AVG(money_spent_on_food_at_other_stores)*100/
                  (AVG(money_spent_at_supermarket_grocery_store)+
                  AVG(money_spent_on_nonfood_items)+
                  AVG(money_spent_on_food_at_other_stores)+
                  AVG(money_spent_on_eating_out)+
                  AVG(money_spent_on_carryout_delivered_foods)),2) as other_stores_percentage,
                  ROUND(AVG(money_spent_on_eating_out)*100/
                  (AVG(money_spent_at_supermarket_grocery_store)+
                  AVG(money_spent_on_nonfood_items)+
                  AVG(money_spent_on_food_at_other_stores)+
                  AVG(money_spent_on_eating_out)+
                  AVG(money_spent_on_carryout_delivered_foods)),2) as eating_out_percentage,
                  ROUND(AVG(money_spent_on_carryout_delivered_foods)*100/
                  (AVG(money_spent_at_supermarket_grocery_store)+
                  AVG(money_spent_on_nonfood_items)+
                  AVG(money_spent_on_food_at_other_stores)+
                  AVG(money_spent_on_eating_out)+
                  AVG(money_spent_on_carryout_delivered_foods)),2) as delivered_percentage,
                  COUNT(*) as count
            FROM main_table main
            INNER JOIN {reference_table[column]} ref
            ON main.{column}=ref.id
            WHERE main.data_release_cycle = {cycle}
            GROUP BY main.{column}"""
            #Connect with engine using with to ensure connection is broken after query
            with db.engine.connect() as connection:
                #Query the engine using text defined above and store in results
                results=connection.execute(db.text(SQL_text))
            #For each line in query results append mapping (dictionary like structure in each row) to response
            for i in results:
                #Transform mapping object into dictionary and append
                response.append(dict(i._mapping))
        #Return list of dictionaries
        return jsonify(response)
    #Case where method is not post (i.e. someone writes the address on the browser)
    else:
        return redirect(url_for("home"))


