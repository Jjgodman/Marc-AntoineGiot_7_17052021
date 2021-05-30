const express = require('../node_modules/express');
const mysql = require('../node_modules/mysql');
const bodyParser = require("../node_modules/body-parser");
const path=require('../node_modules/path')
const helmet=require('../node_modules/helmet')
const rateLimit=require('../node_modules/express-rate-limit')
const dotenv  = require('../backend/node_modules/dotenv');
dotenv.config();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

const publiRoutes = require('./route/publi');
const userRoutes = require('./route/user');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'image')));
app.use('/api/publi', publiRoutes);
app.use('/api/user', userRoutes);


module.exports = app;