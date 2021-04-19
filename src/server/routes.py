import os
import secrets
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import engine
from flask import render_template, url_for, flash, redirect, request, jsonify
from flask.globals import session
from server import app #db, bcrypt

from server.models import *


dbengine: engine
db: SQLAlchemy

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', title='Home')

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/calendar")
def calendar():
    #need to pass in user
    user = {"admin":"true", "username":"test"}

    return render_template('calendar.html', user = user)

@app.route("/calendar/<username>")
def appointmentSignUp(username):
    #get user from db
    return render_template('appointmentSignUp.html', admin="false", user= username);