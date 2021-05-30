const express = require('../../node_modules/express');
const mysqlConnection = require("../utils/database")
const router = express.Router();
const multer = require('../middleware/multer-config')
const publiCtrl = require('../controllers/publi');
const auth=require('../middleware/auth')

router.post('/addPubli', multer, publiCtrl.addPubli);
router.get('/getAllPubli', multer, publiCtrl.getAllPubli);
router.post('/addCommentaire', publiCtrl.addCommentaire);
router.delete('/deletePost', publiCtrl.deletePost);
router.delete('/deleteCom', publiCtrl.deleteCom);

module.exports = router;