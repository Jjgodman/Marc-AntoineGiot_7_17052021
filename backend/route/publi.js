const express = require('../../node_modules/express');
const mysqlConnection = require("../utils/database")
const router = express.Router();

const publiCtrl = require('../controllers/publi')

router.post('/signup', publiCtrl.signup);

module.exports = router;