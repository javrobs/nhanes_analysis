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

#Table corresponding foreign keys for each column
reference_table={'gender': 'gender_table',
            'age_in_years_at_screening': 'age_groups_table',
            'race_ethnic_origin': 'race_ethnic_origin_table',
            'served_in_the_us_armed_forces': 'served_in_the_us_armed_forces_table',
            'country_of_birth': 'country_of_birth_table',
            'citizenship_status': 'citizenship_status_table',
            'education_level_children_youth_6_19': 'education_level_children_table',
            'education_level_adults_20': 'education_level_adults_table',
            'marital_status': 'marital_status_table',
            'total_number_of_people_in_the_household': 'total_number_of_people_table',
            'total_number_of_people_in_the_family': 'total_number_of_people_table',
            'annual_household_income': 'annual_income_table',
            'annual_family_income': 'annual_income_table',
            'ratio_of_family_income_to_poverty': 'NOJOIN',
            'hh_ref_person_gender': "gender_table",
            'hh_ref_person_age': "age_groups_table",
            'hh_ref_person_education_level': "education_level_adults_table",
            'hh_ref_person_marital_status': "marital_status_table",
            'hh_ref_person_spouse_education_level': "education_level_adults_table"}


@app.route("/")
def home(input="data_release_cycle_table"):
    
    #Return in variables_d all pairs of names/variables
    return render_template("index.html", variables_d=variables_d)

@app.route('/queries', methods=['POST'])
def queries():
    
    if request.method == 'POST':
        #Store column chosen in column variable
        column=request.json['column']
        #Execute query in SQL, choose all columns retrieved, rename them, from main table join
        #with foreign key on ID = column value, grouped by requested column in "column"
        query_1=db.engine.connect().execute(db.text(f"""
            SELECT 
                  main.{column} as value_id,
                  ref.description as desc,
                  AVG(
                    SELECT money_spent_at_supermarket_grocery_store
                    FROM main_table
                    WHERE money_spent_at_supermarket_grocery_store <= 8400
                  ) as groceries,
                  AVG(
                    SELECT money_spent_on_nonfood_items
                    FROM main_table
                    WHERE money_spent_on_nonfood_items <= 8400
                  ) as non_food,
                  AVG(
                    SELECT money_spent_on_food_at_other_stores
                    FROM main_table
                    WHERE money_spent_on_food_at_other_stores <= 8400
                  ) as other_stores,
                  AVG(
                    SELECT money_spent_on_eating_out
                    FROM main_table
                    WHERE money_spent_on_eating_out <= 8400
                  ) as eating_out,
                  AVG(
                    SELECT money_spent_on_carryout_delivered_foods
                    FROM main_table
                    WHERE money_spent_on_carryout_delivered_foods <= 8400
                  ) as delivered
                  COUNT(*) as count
            FROM main_table main
            INNER JOIN {reference_table[column]} ref
            ON main.{column}=ref.id
            WHERE main.data_release_cycle = 5
            GROUP BY main.{column}
            """))
        query_2=db.engine.connect().execute(db.text(f"""
            SELECT 
                  main.{column} as value_id,
                  ref.description as desc,
                  AVG(money_spent_at_supermarket_grocery_store) as groceries,
                  AVG(money_spent_on_nonfood_items) as non_food,
                  AVG(money_spent_on_food_at_other_stores) as other_stores,
                  AVG(money_spent_on_eating_out) as eating_out,
                  AVG(money_spent_on_carryout_delivered_foods) as delivered,
                  COUNT(*) as count
            FROM main_table main
            INNER JOIN {reference_table[column]} ref
            ON main.{column}=ref.id
            WHERE main.data_release_cycle = 10
            GROUP BY main.{column}
            """))
        #return list of dictionaries to fetch call
        #define empty list "response"
        queries = [query_1, query_2]
        years = ['2007-2008', '2017-2018']
        response=[]
        for j, query in enumerate(queries):
            for i in query:
                response.append({"id":i["value_id"],
                                "year": years[j],
                                "description":i["desc"],
                                "groceries":round(i["groceries"],2),
                                "non_food":round(i["non_food"],2),
                                "other_stores":round(i["other_stores"],2),
                                "eating_out":round(i["eating_out"],2),
                                "delivered":round(i["delivered"],2),
                                "count":i["count"]})
        return jsonify(response)
    else:
        return redirect(url_for("home"))


