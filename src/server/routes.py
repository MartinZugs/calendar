import os
import secrets
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import engine
from flask import render_template, url_for, flash, redirect, request, jsonify
from server.forms import RegistrationForm, LoginForm
from flask.globals import session
from flask_login import login_user, current_user, logout_user, login_required
from server import app, db, bcrypt

from server.models import *


dbengine: engine
db: SQLAlchemy
dbengine = db.engine
connection = db.engine.connect()

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', title='Home')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    
    if current_user.is_authenticated:
        flash('You are already logged in!', 'danger')
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('calendar.html', title='Login', form=form)

@app.route("/calendar")
def calendar():
    #need to pass in user
    user = {"admin":"true", "username":"test"}

    return render_template('calendar.html', user = user, events = events)

@app.route("/calendar/<username>/addEvent", methods = ['POST'])
def calendar_Add_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    return "true"

@app.route("/calendar/<username>/removeEvent", methods = ['POST'])
def calendar_Remove_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    return "true"

@app.route("/calendar/<username>/updateEvent", methods = ['POST'])
def calendar_Update_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    return "true"

@app.route("/calendar/<username>/shareEvent", methods = ['POST'])
def calendar_Share_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    return "true"

@app.route("/calendar/<username>", methods= ["GET"])
def appointmentSignUp(username):

    if request.args.__contains__('event'):
        event = request.args['event']
        specificEvents = []
        print(event)
        for e in events:
            if e['name'] == event:
                specificEvents.append(e)
        return render_template('appointmentSignUp.html', admin="false", user= username, events = specificEvents)
    else:
        return render_template('appointmentSignUp.html', admin="false", user= username, events = events)
    

testEvent = {
    "color": "#008000",
    "name": "Test_Event",
    "startDate": "2021-04-26",
    "endDate": "2021-04-28",
    "startTime":"13:00",
    "endTime":"15:00",
    "type": "Standard",
    "daysActive": ["Tuesday"],
    "timeSlotLength": "10",
    "description":"test",
    "signups":[]
}
testEvent2 = {
    "color": "#008000",
    "name": "Test_Event2",
    "startDate": "2021-04-26",
    "endDate": "2021-04-29",
    "startTime":"13:00",
    "endTime":"15:00",
    "type": "Standard",
    "daysActive": ["Wednesday"],
    "timeSlotLength": "10",
    "description":"test",
    "signups":[]
}

events = [testEvent, testEvent2]

@app.route("/calendar/signUp/<username>", methods= ["POST"])
def appointmentSignUpEvent(username):
    #get user from db
    print(username)
    data = json.loads(request.get_data())
    print(data)
    #insert to db
    return "true"
    
  
    
    
