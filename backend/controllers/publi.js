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
            attributes:["id","nom","prenom"],
            where:{id:userId}
        })
        const publi = await models.Post.create({
            image: image,
            titre:titre,
            nomAuteur:user.nom,
            prenomAuteur:user.prenom,
            UserId  : user.id,
        });
        return res.status(201).json({
            'publi id':publi.id
        })
    }
    
    catch(e){
        console.log('err',e)
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

exports.getAllPubli = async (req, res) => {
    try {
        const posts = await models.Post.findAll({
            attributes: ["id", "titre", "image", "createdAt"],
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: models.User,
                    attributes: ["nom", "prenom", "id"],
                },
                {
                    model: models.Commentaire,
                    attributes: ["message", "nom","prenom", "userId", "id"],
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: models.User,
                            attributes: ["nom", "prenom"],
                        },
                    ],
                }
            ],
        });
        res.status(200).send(posts);
    } 
    catch(e){
        console.log('err',e)
        res.status(500).json({ e: e.message });}
    };

exports.addCommentaire = async (req, res,next) => {
    var headerAuth=req.headers['authorization']
    var userId=getUserId(headerAuth)

    try{
        const user = await models.User.findOne({
            attributes:["id","nom","prenom"],
            where:{id:userId}
        })
        
        const commentaire = await models.Commentaire.create({
            message:req.body.message,
            PostId:req.body.publiId,
            UserId:user.id,
            nom:user.nom,
            prenom:user.prenom
        });
        return res.status(201).json({
            'commentaire ':commentaire
        })
    }
    
    catch(e){
        console.log('err',e)
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