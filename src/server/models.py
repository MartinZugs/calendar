from datetime import datetime
from server import db, login_manager
from flask_login import UserMixin
from sqlalchemy import orm

db.Model.metadata.reflect(db.engine)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"


class AppointmentType(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    number_of_allowed_bookings = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"AppointmentType({self.title}')"


class FreeTimeSlot(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    weekday = db.Column(db.String(9), nullable=False)
    appointment_type = db.Column(db.Integer, db.ForeignKey('appointment_type.id'), nullable=False)
    owned_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class RegisteredForTime(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    time_slot_id = db.Column(db.Integer, db.ForeignKey('free_time_slot.id'), nullable=False)
    signup_id = db.Column(db.Integer, nullable=False)
    last_email_sent = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Event(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    owned_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Event({self.title}')"








