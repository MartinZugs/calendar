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
    def serialize(self):
        return {
            'id':self.id,
            'username':self.username,
            'email': self.email
            }


class AppointmentType(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    number_of_allowed_bookings = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"AppointmentType({self.title}')"
    def serialize(self):
        return {
            'id':self.id,
            'number_of_allowed_bookings':self.number_of_allowed_bookings,
            'title': self.title,
            'description': self.description
            }


class FreeTimeSlot(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    weekday = db.Column(db.String(9), nullable=False)
    appointment_type = db.Column(db.Integer, db.ForeignKey('appointment_type.id'), nullable=False)
    fts_owned_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    def serialize(self):
        return {
            'id':self.id,
            'start_time':self.start_time,
            'end_time': self.end_time,
            'weekday': self.weekday,
            'appointment_type':self.appointment_type,
            'fts_owned_by': self.fts_owned_by
            }

class Event(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    days_active = db.Column(db.String(200), nullable=True)
    timeslot_length = db.Column(db.Integer, nullable=True)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    start_time = db.Column(db.String(20), nullable=True)
    end_time = db.Column(db.String(20), nullable=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    event_owned_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    color = db.Column(db.String(8), nullable=False, default='#00FF00')
    type = db.Column(db.String(50), nullable=False, default='Standard')

    def __repr__(self):
        return f"Event({self.title}')"
    def serialize(self):
        return {
            'id':self.id,
            'start_time':self.start_time,
            'end_time': self.end_time,
            'days_active': self.days_active,
            'timeslot_length':self.timeslot_length,
            'start_date': str(self.start_date) ,
            'end_date': str(self.end_date),
            'title':self.title,
            'description': self.description,
            'event_owned_by':self.event_owned_by,
            'color': self.color,
            'type': self.type
            }

class RegisteredForTime(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)
    # time_slot_id = db.Column(db.Integer, db.ForeignKey('free_time_slot.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    
    last_email_sent = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    def serialize(self):
        return {
            'id':self.id,
            'start_time':self.start_time,
            'end_time': self.end_time,
            'name': self.name,
            'email': self.email,
            'signup_id':self.signup_id,
            'last_email_sent': self.last_email_sent,
            'event_id': self.event_id,
            
            }





