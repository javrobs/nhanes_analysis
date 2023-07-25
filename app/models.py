from app import db

class main_table(db.Model):
    respondent_sequence_number=db.Column(db.Integer,primary_key=True)
    data_release_cycle=db.Column(db.Integer,db.ForeignKey("data_release_cycle_table.id"))
    six_month_time_period=db.Column(db.Integer,db.ForeignKey("six_month_time_period_table.id"))
    gender=db.Column(db.Integer,db.ForeignKey("gender_table.id"))
    age_in_years_at_screening=db.Column(db.Integer,db.ForeignKey("age_groups_table.id"))
    race_ethnic_origin=db.Column(db.Integer,db.ForeignKey("race_ethnic_origin_table.id"))
    served_in_the_us_armed_forces=db.Column(db.Integer,db.ForeignKey("served_in_the_us_armed_forces_table.id"))
    country_of_birth=db.Column(db.Integer,db.ForeignKey("country_of_birth_table.id"))
    citizenship_status=db.Column(db.Integer,db.ForeignKey("citizenship_status_table.id"))
    education_level_children_youth_6_19=db.Column(db.Integer,db.ForeignKey("education_level_children_table.id"))
    education_level_adults_20=db.Column(db.Integer,db.ForeignKey("education_level_adults_table.id"))
    marital_status=db.Column(db.Integer,db.ForeignKey("marital_status_table.id"))
    total_number_of_people_in_the_household=db.Column(db.Integer,db.ForeignKey("total_number_of_people_table.id"))
    total_number_of_people_in_the_family=db.Column(db.Integer,db.ForeignKey("total_number_of_people_table.id"))
    annual_household_income=db.Column(db.Integer,db.ForeignKey("annual_income_table.id"))
    annual_family_income=db.Column(db.Integer,db.ForeignKey("annual_income_table.id"))
    ratio_of_family_income_to_poverty=db.Column(db.Float)
    hh_ref_person_gender=db.Column(db.Integer,db.ForeignKey("gender_table.id"))
    hh_ref_person_age=db.Column(db.Integer,db.ForeignKey("age_groups_table.id"))
    hh_ref_person_education_level=db.Column(db.Integer,db.ForeignKey("education_level_adults_table.id"))
    hh_ref_person_marital_status=db.Column(db.Integer,db.ForeignKey("marital_status_table.id"))
    hh_ref_person_spouse_education_level=db.Column(db.Integer,db.ForeignKey("education_level_adults_table.id"))
    full_sample_2_year_interview_weight=db.Column(db.Float)
    full_sample_2_year_mec_exam_weight=db.Column(db.Float)
    masked_variance_pseudo_psu=db.Column(db.Integer)
    masked_variance_pseudo_stratum=db.Column(db.Integer)
    money_spent_at_supermarket_grocery_store=db.Column(db.Float)
    money_spent_on_nonfood_items=db.Column(db.Float)
    money_spent_on_food_at_other_stores=db.Column(db.Float)
    money_spent_on_eating_out=db.Column(db.Float)
    money_spent_on_carryout_delivered_foods=db.Column(db.Float)
    
class data_release_cycle_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class six_month_time_period_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class gender_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class age_groups_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class race_ethnic_origin_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class served_in_the_us_armed_forces_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class country_of_birth_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class citizenship_status_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class education_level_children_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)   

class education_level_adults_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class marital_status_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class total_number_of_people_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)

class annual_income_table(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String)
    
