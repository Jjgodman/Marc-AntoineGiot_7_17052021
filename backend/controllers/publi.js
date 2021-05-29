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

exports.getAllPubli = async (req, res,) => {
    models.Post.findAll().then(
        (post) =>{
            const mappedPost = post.map((post) => {
                post.image = req.protocol+'://'+req.get('host')+'/image/'+post.image
                return post
            })
            res.status(200).json(mappedPost)
        }
    )
    .catch((e)=>{
        console.log(e);
        res.status(500).json({e})
    })
    .catch(error => res.status(400).json({ error }));
};

exports.addCommentaire = async (req, res,) => {

    var headerAuth=req.headers['authorization']
    var userId=getUserId(headerAuth)
    publiId=req.body.publiId
    console.log(req.body);
    

    try{

        const user = await models.User.findOne({
            attributes:["id","nom","prenom"],
            where:{id:userId}
        })
        const publiId = await models.Publi.findOne({
            attributes:["id"],
            where:{id:userId}
        })
        const commentaire = await models.Commentaire.create({
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