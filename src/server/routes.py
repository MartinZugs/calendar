import os
import secrets
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
    return render_template('caledar.html')