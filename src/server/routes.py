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
    return redirect(url_for('login'))

@app.route("/register", methods=['GET', 'POST'])
def register():

    if current_user.is_authenticated:
        flash('You are already logged in!', 'danger')
        return redirect(url_for('calendar'))

    form = RegistrationForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()

        if user == None:
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user = User(username=form.username.data, email=form.email.data, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            flash('Your account has been created! You are now able to log in', 'success')
            return redirect(url_for('login'))

        else:
            flash('You already have an account! Please log in instead', 'danger')
            return redirect(url_for('login'))

    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    
    if current_user.is_authenticated:
        flash('You are already logged in!', 'danger')
        return redirect(url_for('calendar'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('calendar'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    if not current_user.is_authenticated:
        flash('You are not logged in!', 'danger')
        return redirect(url_for('calendar'))
    else:
        logout_user()
        return redirect(url_for('calendar'))

@app.route("/calendar")
def calendar():
    #need to pass in user
    if not current_user.is_authenticated:
        flash('You need to be logged in!', 'danger')
        return redirect(url_for('login'))
    else:

        current_contact = User.query.filter_by(email=current_user._get_current_object().email).first()
        user = {"admin":"true", "username":current_contact.username}
        evnts = Event.query.filter_by(event_owned_by=current_contact.id).all()
        results = []
        for event in evnts:
            
            item = formatEvent(event.serialize())

            results.append(item)
        

    return render_template('calendar.html', user = user, events = results)

@app.route("/calendar/<username>/addEvent", methods = ['POST'])
def calendar_Add_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    
    current_contact = User.query.filter_by(username=username).first()
    print(data)
    
    event = Event(start_date= data['startDate'], end_date=data['endDate'], start_time=data['startTime'], end_time=data['endTime'], title = data['name'], description = data['description'],event_owned_by=current_contact.id, color=data['color'], type = data['type'], days_active = json.dumps(data['daysActive']), timeslot_length = data['timeSlotLength'] )

    db.session.add(event)
    db.session.commit()
    message = {"message":'The event has been added!',"type": "success"}
    return json.dumps(message)

@app.route("/calendar/<username>/removeEvent", methods = ['POST'])
def calendar_Remove_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    current_contact = User.query.filter_by(username=username).first()
    print(data)
    delevent = Event.query.filter_by(title=data['name'], event_owned_by=current_contact.id).first()
    
    db.session.delete(delevent)
    db.session.commit()
    
    message = {"message":'The event has been removed!',"type": "success"}
    return json.dumps(message)

@app.route("/calendar/<username>/updateEvent", methods = ['POST'])
def calendar_Update_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    event = Event.query.filter_by(title=data['name']).first()
    current_contact = User.query.filter_by(username=username).first()

    event.days_active = json.dumps(data['daysActive'])
    event.timeslot_length = data['timeSlotLength']
    event.start_date = data['startDate']
    event.end_date = data['endDate']
    event.start_time = data['startTime']
    event.end_time = data['endTime']
    event.title = data['name']
    event.description = data['description']
    event.event_owned_by = current_contact.id
    event.color = data['color']
    event.type = data['type']

    db.session.commit()
    #flash ('The Event has been updated!', 'success')
    message = {"message":'The Event has been updated!',"type": "success"}
    return json.dumps(message)

@app.route("/calendar/<username>/shareEvent", methods = ['POST'])
def calendar_Share_Event(username):
    #need to pass in user
    print(username)
    data = json.loads(request.get_data())
    print(data)
    message = {"message":'The Event has been shared!',"type": "success"}
    return json.dumps(message)

@app.route("/calendar/<username>", methods= ["GET"])
def appointmentSignUp(username):

    if request.args.__contains__('event'):
        event = request.args['event']
        
        
        current_contact = User.query.filter_by(username= username).first()
        if current_contact == None:
            flash(f"Account {username} doesn't Exist")
            return render_template('appointmentSignUp.html', admin="false", user= username, events =[])
        else:

        
            event = Event.query.filter_by(title=event,event_owned_by=current_contact.id, type="Standard").first()
            if event is not None:
                event = formatEvent(event.serialize())
                registered = RegisteredForTime.query.filter_by(event_id=event['id']).all()
                results = []
                if registered is not None:

                    for reg in registered:
                        reg = formatSignup(reg.serialize())
                        results.append(reg)
                    event['signups'] = results
                return render_template('appointmentSignUp.html', admin="false", user= username, events = [event])
            else:
                flash("No Events Found")
                return render_template('appointmentSignUp.html', admin="false", user= username, events =[])
    else:
        current_contact = User.query.filter_by(username= username).first()
        if current_contact == None:
            
            flash(f"Account {username} doesn't Exist")
            return render_template('appointmentSignUp.html', admin="false", user= username, events =[])
        else:
            events = Event.query.filter_by(event_owned_by=current_contact.id, type="Standard").all()
            eventResults = []
            if events is not None:
                for event in events:
                
                    item = formatEvent(event.serialize())
                    registered = RegisteredForTime.query.filter_by(event_id=item['id']).all()
                    results = []
                    for reg in registered:
                        reg = formatSignup(reg.serialize())
                        results.append(reg)
                    item['signups'] = results
                    eventResults.append(item)
                return render_template('appointmentSignUp.html', admin="false", user= username, events =eventResults)
            else:
                flash("No Events Found")
                return render_template('appointmentSignUp.html', admin="false", user= username, events =[])
    




@app.route("/calendar/signUp/<username>", methods= ["POST"])
def appointmentSignUpEvent(username):
    #get user from db
    print(username)
    dictionary = json.loads(request.get_data())
    data = dictionary['signUp']
    eventData = dictionary['event']
    event = Event.query.filter_by(title=eventData['name']).first()
    print(data)
    signup = RegisteredForTime(name=data['name'], email=data['email'], start_time = data['startTime'], end_time = data['endTime'], event_id=event.id)
    
    #insert to db
    db.session.add(signup)
    db.session.commit()
    message = {"message":'Congrats you have signed up!',"type": "success"}
    return json.dumps(message)
    
  
    
    
def formatEvent(data):
    

    startDate = data['start_date'].split(' ')[0]
    endDate = data['end_date'].split(' ')[0]
    daysActive = json.loads(data['days_active'])
    event = {
        'id': data['id'],
        'startTime': data['start_time'],
        'endTime': data['end_time'],
        'daysActive': daysActive,
        'timeSlotLength': data['timeslot_length'],
        'startDate': startDate,
        'endDate': endDate,
        'name': data['title'],
        'description': data['description'],
        'event_owned_by': data['event_owned_by'],
        'color': data['color'],
        'type': data['type'],
        'signups':[]
    }
    print(event)
    return event

def formatSignup(data):
    signup = {
        'id':data['id'],
        'startTime':data['start_time'],
        'endTime': data['end_time'],
        'name': data['name'],
        'email': data['email'],
        'last_email_sent': data['last_email_sent'],
        'event_id': data['event_id'],
    }
    return signup