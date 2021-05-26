const models = require('../../models');
const fs = require("fs");
const imageToBase64  = require('../../node_modules/image-to-base64')
//const dotenv  = require('../../backend/node_modules/dotenv');
//dotenv.config();


const mysqlConnection = require('../utils/database');


exports.addPubli = async (req, res,) => {
    console.log('oui');
    console.log(req.header);
    const idUSERS=req.body.idUSERS
    const titre=req.body.titre
    const image=`${req.protocol}://${req.get('host')}/images/${req.body.image}`
    try{
        console.log('test');
        const publi = await models.Posts.create({
            idUSERS:idUSERS,
            image: image,
            titre:titre
        });
        console.log('test2')
        return res.status(201).json({
            'publi id':publi.id
          })
    }
    
    catch(e){
        console.log('err')
        res.status(400).json({ e: e.message });}
};