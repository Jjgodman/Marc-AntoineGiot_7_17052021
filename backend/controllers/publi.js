const models = require('../../models');
const jwt = require('../../node_modules/jsonwebtoken');
const fs = require("fs");
const mysqlConnection = require('../utils/database');


exports.addPubli = async (req, res,) => {

    var headerAuth=req.headers['authorization']
    var userId=getUserId(headerAuth)
    
    const titre=req.body.titre
    const image=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    try{

        const user = await models.User.findOne({
            where:{id:userId},
            attributes:["id"]
        })
        console.log(user.id);
        const publi = await models.Posts.create({
            image: image,
            titre:titre,
            UserId : user.id,
        });
        console.log('test2')
        return res.status(201).json({
            'publi id':publi.id
          })
    }
    
    catch(e){
        console.log('err')
        res.status(400).json({ e: e.message });}

    function parseAutorization(authorization){
            return (authorization !=null) ? authorization.replace('Bearer ',''):null
    }
    function getUserId(authorization) {
        var userId=-1
        var token = parseAutorization(authorization)
        if(token!=null){
            try {
                var jwtToken = jwt.verify(token, 'TOKEN')
                if(jwtToken!=null){
                    userId=jwtToken.userId
                }
            }
            catch(err){}
        }
        return userId
    }

};