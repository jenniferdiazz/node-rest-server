const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//schema seria como el cascaron
let Schema = mongoose.Schema;
let rolesValidos = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol válido'
};

//definir las reglas y controles que el usiario schema va a tener, es decir los campos de la coleccion
let usuarioSchema = new Schema({
    nombre:{
        type:String,
        //disparara un mensaje:
        required:[true, 'El nombre es necesario']
    },
    email:{
        type:String,
        required: [true,'El correo es necesario'],
        unique: true,
    },
    password:{
        type:String,
        required:[true,'la Contraseña es necesaria']

    },
    img:{
        type: String,
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos,

    },
    estado:{
        type:Boolean,
        default:true,
    },
    google:{
        type: Boolean,
        default:false,
    }
});
//la contraseña jamas la vamos a regresar ... toJson -> cuando se intente imprimir... con la funcion de flecha no se puede usar el this
usuarioSchema.methods.toJSON= function(){
    let user = this;
    let userObject= user.toObject();
    delete userObject.password;
    return userObject;
    //se retorna el usuario sin la constraseña
}
//mongoose insertara el mensaje de error por nosotros
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})
//usuario es el nombre que tendrá, usuarioSchema es toda la configuracion que traera
module.exports = mongoose.model('Usuario', usuarioSchema)