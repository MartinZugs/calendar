from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)

app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'localhost'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://remote_user:4YqlgBGrzQRNxiNmXGAY!@52.136.113.60/calendar'
app.config["TEMPLATES_AUTO_RELOAD"] = True

db = SQLAlchemy(app)#setup db


bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

import sys

sys.path.append('./')
from server import routes
from server import models

models.db.create_all()

