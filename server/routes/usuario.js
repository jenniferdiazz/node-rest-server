const express = require('express');
const app = express();

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});
app.post('/usuario', function(req, res) {
    //body-parser permite procesar toda la informacion que venga y la serializa en un objeto json para que sea facil trabajarla en el post
    let body = req.body;
    /*res.json({
        body
    });*/
    //si necesito info para crear un registro?
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
    //el body aparece cuando el body-parser procese cualquier paydlon(parametro) que reciba las peticiones
    //res.json('post Usuario');
});
app.put('/usuario/:id', function(req, res) {
    //retorna lo que sea que yo mande en el URL
    let id = req.params.id;
    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

module.exports = app;