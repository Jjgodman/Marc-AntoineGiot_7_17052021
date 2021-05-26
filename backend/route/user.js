const express = require('../../node_modules/express');
const mysqlConnection = require("../utils/database")
const router = express.Router();
const bcrypt = require('../../node_modules/bcrypt')
const jwt = require('../../node_modules/jsonwebtoken')

//const auth = require('../middleware/user');

const userCtrl = require('../controllers/user')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/getUserProfile', userCtrl.getUserProfile);
router.put('/updateUserProfile', userCtrl.updateUserProfile);
router.delete('/deleteUserProfile', userCtrl.deleteUserProfile);
router.get('/authentifier', userCtrl.authentifier);


module.exports = router;