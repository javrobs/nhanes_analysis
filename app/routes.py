from app import app,db
import app.models as model
from flask import render_template, jsonify, request,redirect, url_for

# Reference dictionary whose key is the column name, the first value is the proper title of the column, and the second value is the SQL foreign key:
reference_d = {'gender': ['Gender', 'gender_table'],
                'age_in_years_at_screening': ['Age', 'age_groups_table'],
                'race_ethnic_origin': ['Ethnicity', 'race_ethnic_origin_table'],
                'served_in_the_us_armed_forces': ['Served in the Army', 'served_in_the_us_armed_forces_table'],
                'country_of_birth': ['Country of birth', 'country_of_birth_table'],
                'citizenship_status': ['Citizenship status', 'citizenship_status_table'],
                'education_level_adults_20': ['Education level (adults)', 'education_level_adults_table'],
                'marital_status': ['Marital status', 'marital_status_table'],
                'total_number_of_people_in_the_household': ['Household size', 'total_number_of_people_table'],
                'total_number_of_people_in_the_family': ['Family size', 'total_number_of_people_table'],
                'annual_household_income': ['Annual household income', 'annual_income_table'],
                'annual_family_income': ['Annual family income', 'annual_income_table'],
                'ratio_of_family_income_to_poverty': ['Ratio of income to poverty', 'ratio_of_family_income_to_poverty_table'],
                'hh_ref_person_gender': ["HH ref person's gender", 'gender_table'],
                'hh_ref_person_age': ["HH ref person's age", 'age_groups_table'],
                'hh_ref_person_education_level': ["HH ref person's education level", 'education_level_adults_table'],
                'hh_ref_person_marital_status': ["HH ref person's marital status", 'marital_status_table'],
                'hh_ref_person_spouse_education_level': ["HH ref person's spouse education level", 'education_level_adults_table']}

# Flask routes:
# 1. Home route:
@app.route("/")
def home():
    # Returns the DOM and the reference dictionary:
    return render_template("index.html", reference_d=reference_d)

# 2. Fetch route (for internal calls only):
@app.route('/queries', methods=['POST'])
def queries():
    # Unpacks JSON from fetch call:
    column = request.json['column']
    previous_filters = request.json['previousFilters']
    selected_year = request.json['selectedYear']
    # Creates an empty dictionary to be populated with the query response:
    response = {'all_data': [], 'nulls': []}
    # Defines cycles and years:
    data_release_cycles=[5,10]
    years=['2007-2008','2017-2018']
    # Defines the year and cycle of the fetch call:
    if selected_year:
        year = years[0]
        cycle = data_release_cycles[0]
    else:
        year = years[1]
        cycle = data_release_cycles[1]
    # Text for SQL query to get all the data to be plotted:
    query_text_1_start=f"""
        SELECT 
            main.{column} as id,
            ref.description as description,
            '{year}' as year,
            ROUND(AVG(money_spent_at_supermarket_grocery_store),2) as groceries,
            ROUND(AVG(money_spent_on_food_at_other_stores),2) as other_stores,
            ROUND(AVG(money_spent_on_eating_out),2) as eating_out,
            ROUND(AVG(money_spent_on_carryout_delivered_foods),2) as delivered,
            ROUND(AVG(money_spent_at_supermarket_grocery_store)*100/
            (AVG(money_spent_at_supermarket_grocery_store)+
            AVG(money_spent_on_food_at_other_stores)+
            AVG(money_spent_on_eating_out)+
            AVG(money_spent_on_carryout_delivered_foods)),2) as groceries_percentage,
            ROUND(AVG(money_spent_on_food_at_other_stores)*100/
            (AVG(money_spent_at_supermarket_grocery_store)+
            AVG(money_spent_on_food_at_other_stores)+
            AVG(money_spent_on_eating_out)+
            AVG(money_spent_on_carryout_delivered_foods)),2) as other_stores_percentage,
            ROUND(AVG(money_spent_on_eating_out)*100/
            (AVG(money_spent_at_supermarket_grocery_store)+
            AVG(money_spent_on_food_at_other_stores)+
            AVG(money_spent_on_eating_out)+
            AVG(money_spent_on_carryout_delivered_foods)),2) as eating_out_percentage,
            ROUND(AVG(money_spent_on_carryout_delivered_foods)*100/
            (AVG(money_spent_at_supermarket_grocery_store)+
            AVG(money_spent_on_food_at_other_stores)+
            AVG(money_spent_on_eating_out)+
            AVG(money_spent_on_carryout_delivered_foods)),2) as delivered_percentage,
            COUNT(*) as count
        FROM main_table main
        INNER JOIN {reference_d[column][1]} ref
        ON main.{column}=ref.id """
    # Enables deeper filtering:
    previous_filter_string = ""
    for key, value in previous_filters.items():
        previous_filter_string += f"""AND main.{key}={value} """
    query_text_1_end=f"""WHERE main.data_release_cycle = {cycle}            
    GROUP BY main.{column}"""
    # Text for SQL query to get the missing values note:
    query_text_2=f"""
        SELECT COUNT(*) as missing,
            '{year}' as year
        FROM main_table main
        WHERE main.data_release_cycle = {cycle} AND main.{column} IS NULL 
        """
    # Connects the engine using 'with' to ensure connection is broken after query:
    with db.engine.connect() as connection:
        # Queries the engine using the text defined above and stores in the results:
        results_1=connection.execute(db.text(query_text_1_start+previous_filter_string+query_text_1_end))
        results_2=connection.execute(db.text(query_text_2+previous_filter_string)).first()
    # For each line in the query results, appends mapping (dictionary-like structure in each row) to response:
    for i in results_1:
        # Transforms mapping object into dictionary and appends it to the response:
        response['all_data'].append(dict(i._mapping))
    # Transforms mapping object into dictionary and appends it to the response:
    response['nulls'].append(dict(results_2._mapping))
    response['selected_column']=column
    # Returns a jsonified dictionary:
    return jsonify(response)