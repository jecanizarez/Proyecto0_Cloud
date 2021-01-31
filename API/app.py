
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)

ma = Marshmallow(app)

class Evento(db.Model):
    id =  db.Column(db.Integer, primary_key = True)
    nombre = db.Column( db.String(255) )
    categoria = db.Column(db.String(50))
    lugar = db.Column(db.String(255))
    direccion = db.Column(db.String(255))
    fechaInicio = db.Column(db.Date())
    fechaFin = db.Column(db.Date())
    presencial = db.Column(db.Boolean())

class Evento_Schema(ma.Schema):
    class Meta:
        fields= ("id", "nombre","categoria","lugar","direccion", "fechaInicio","fechaFin","presencial")

post_evento = Evento_Schema()
posts_evento = Evento_Schema(many = True)


class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String())
    password = db.Column(db.String())

if __name__ == '__main__':

    app.run(debug=True)





