from datetime import datetime as dt
from flask import Flask, request, jsonify,make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

app.config['SECRET_KEY'] = 'super-secret'

app.config['PROPAGATE_EXCEPTIONS'] = True

db = SQLAlchemy(app)

ma = Marshmallow(app)

bcrypt = Bcrypt(app)

jwt = JWTManager(app)

CORS(app)

api = Api(app)

#Se crea el modelo para un Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String())
    events = db.relationship("Evento")


##Creamos el modelo de un evento
class Evento(db.Model):
    id =  db.Column(db.Integer, primary_key = True)
    nombre = db.Column( db.String(255) )
    categoria = db.Column(db.String(50))
    lugar = db.Column(db.String(255))
    direccion = db.Column(db.String(255))
    fechaInicio = db.Column(db.Date())
    fechaFin = db.Column(db.Date())
    presencial = db.Column(db.Boolean())
    user = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)

##Se cre un esquema para que se pueda retornar la información como JSON
class Evento_Schema(ma.Schema):
    class Meta:
        fields= ("id", "nombre","categoria","lugar","direccion", "fechaInicio","fechaFin","presencial")

post_evento = Evento_Schema()
posts_evento = Evento_Schema(many = True)


#Se crea el modelo para el usuario
class User_Schema(ma.Schema):
    class Meta:
        fields = ("id","email","password")

post_user = User_Schema()
posts_user = User_Schema(many = True)


class RecursoListarEventos(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        eventos = Evento.query.filter_by(user = user_id).all()
        return posts_evento.dump(eventos)

    @jwt_required
    def post(self):
        user_id = get_jwt_identity()
        nuevo_evento = Evento(
            nombre = request.json['nombre'],
            categoria = request.json['categoria'],
            lugar =request.json['lugar'],
            direccion = request.json['direccion'],
            fechaInicio = dt.strptime(request.json['fechaInicio'], '%Y-%m-%d'),
            fechaFin = dt.strptime(request.json['fechaFin'],'%Y-%m-%d'),
            presencial = request.json['presencial'] in ["True"],
            user = user_id
        )
        db.session.add(nuevo_evento)
        db.session.commit()
        return post_evento.dump(nuevo_evento)

class RecursoUnEvento(Resource):
    @jwt_required
    def put(self, id_evento):
        user_id = get_jwt_identity()
        evento  = Evento.query.filter_by(id = id_evento, user = user_id).first()
        if not evento:
            return make_response(jsonify({"msg":"Resource doesn't exist"}), 404)
        if 'nombre' in request.json:
            evento.nombre = request.json['nombre']
        if 'categoria' in request.json:
            evento.categoria = request.json['categoria']
        if 'lugar' in request.json:
            evento.lugar = request.json['lugar']
        if 'direccion' in request.json:
            evento.direccion = request.json['direccion']
        if 'fechaInicio' in request.json:
            evento.fechaInicio = dt.strptime(request.json['fechaInicio'], '%Y-%m-%d')
        if 'fechaFin' in request.json:
            evento.fechaFin = dt.strptime(request.json['fechaFin'],'%Y-%m-%d')
        if 'presencial' in request.json:
            evento.presencial = request.json['presencial'] in ["True","Si","si"]
        db.session.commit()
        return post_user.dump(evento)

    @jwt_required
    def delete(self,id_evento):
        user_id = get_jwt_identity()
        evento = Evento.query.filter_by(id=id_evento, user=user_id).first()
        if not evento:
            return make_response(jsonify({"msg": "Resource doesn't exist"}), 404)
        db.session.delete(evento)
        db.session.commit()
        return '',204

api.add_resource(RecursoListarEventos, "/eventos")

api.add_resource(RecursoUnEvento, "/eventos/<int:id_evento>")

class RecursoUsuarios(Resource):
    def get(self):
        usuarios = User.query.all()
        return posts_user.dump(usuarios)
    def post(self):
        nuevo_usuario = User(
            email = request.json['email'],
            password  = bcrypt.generate_password_hash(request.json['password']).decode('UTF-8')
        )
        db.session.add(nuevo_usuario)
        db.session.commit()
        return post_user.dump(nuevo_usuario)

api.add_resource(RecursoUsuarios, "/usuarios")

class Login(Resource):
    def post(self):
        email = request.json['email']
        user = User.query.filter_by(email=email).first()
        if not user:
            return make_response(jsonify({"msg":"Wrong email or User doesn't exist"}), 400)
        if not bcrypt.check_password_hash(user.password, request.json['password']):
            return make_response(jsonify({"msg":"Wrong password"}), 400)
        access_token = create_access_token(identity=user.email)
        return make_response(jsonify(access_token=access_token), 200)

api.add_resource(Login, "/login")





if __name__ == '__main__':

    app.run(debug=True)





