const express = require('../node_modules/express');
const mysql = require('../node_modules/mysql');
const bodyParser = require("../node_modules/body-parser");
const path=require('../node_modules/path')


const publiRoutes = require('./route/publi');
const userRoutes = require('./route/user');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/api/publi', publiRoutes);
app.use('/api/user', userRoutes);


module.exports = app;