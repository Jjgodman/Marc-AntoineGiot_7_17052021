const express = require('../../node_modules/express');
const router = express.Router();
const userCtrl = require('../controllers/user')
const multer = require('../middleware/multer-config')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/getUserProfile', userCtrl.getUserProfile);
router.put('/updateUserProfile', userCtrl.updateUserProfile);
router.delete('/deleteUserProfile', userCtrl.deleteUserProfile);
router.get('/authentifier', userCtrl.authentifier);



module.exports = router;