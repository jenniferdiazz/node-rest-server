require('./config/config.js')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
//app.use son middlewares: funciones que se van a disparar cada vez que pasa por ahi el codigo
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/usuario.js'));

// respond with "hello world" when a GET request is made to the homepage
/*app.get('/', function(req, res) {
    res.json('hello world');
});*/


mongoose.connect('mongodb://localhost:27017/cafe', (err, res)=>{
    if(err) throw err;
    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});