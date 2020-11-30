const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
//la U mayuscula es porque sera un nuevo objeto
const Usuario = require('../models/usuario.js');

const app = express();

app.get('/usuario', function(req, res) {
    //res.json('get Usuario');
    //get de base de datos, exec ejecuta el find 
    //paginacion si viene usala si no parte de la pag 0
    let desde = req.query.desde || 0;
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //lo que es adentro del find sera el filtro
    Usuario.find({estado:true},'nombre email role estado google img')
        .skip(desde)
        //me devolvera solo 5 registros de la bd, skip da saltos de 5 en 5
       .limit(limite)
        .exec((err, usuarios)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    err
                });
            }
            Usuario.countDocuments({estado:true}, (err,conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    cuantos:conteo
                });
    
            });
        })
});
app.post('/usuario', function(req, res) {
    //body-parser permite procesar toda la informacion que venga y la serializa en un objeto json para que sea facil trabajarla en el post
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //el segundo argumento es el numero de veces que quiero aplicarle el hash
        password : bcrypt.hashSync(body.password,10),
        role: body.role
    });
    //para guardarlo en la base de datos:
    usuario.save((err,usuarioDB)=>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }
        //status 200 esta implicito
        res.json({
            ok:true,
            usuario:usuarioDB
        });
    })
    /*res.json({
        body
    });*/
    //si necesito info para crear un registro?
    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
    //el body aparece cuando el body-parser procese cualquier paydlon(parametro) que reciba las peticiones
    //res.json('post Usuario');
});
//_.pick me permite filtrar  en este caso sacaremos password y google
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});
app.delete('/usuario/:id', function(req, res) {
    //res.json('delete Usuario');
    let id = req.params.id
    let cambiaEstado={
        estado:false
    }
   //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id,cambiaEstado, {new:true}, (err, usuarioBorrado)=>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            });

        };
        //si el usuario esta borrado....
        if(!usuarioBorrado ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'usuario no encontrado'
                }
            });
        }
        //referencia al usuario borrado
        res.json({
            ok:true,
            usuario: usuarioBorrado,
        })

    })

});

module.exports = app;