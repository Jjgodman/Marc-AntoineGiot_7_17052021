//imporation des module
const models = require('../../models');
const jwt = require('../../node_modules/jsonwebtoken');
const fs = require("fs");
const dotenv= require('../../node_modules/dotenv')
dotenv.config();

//ajout de publication
exports.addPubli = async (req, res,) => {
    //récuperation des données envoyées
    var headerAuth=req.headers['authorization']
    var userId=getUserId(headerAuth)
    const titre=req.body.titre
    const image=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    try{
        //récuperation des info de l'user
        const user = await models.User.findOne({
            attributes:["id","nom","prenom"],
            where:{id:userId}
        })
        //creation de l'user
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
        res.status(400).json({ e: e.message });}
    //récuperation de l'id de l'user
    function parseAutorization(authorization){
            return (authorization !=null) ? authorization.replace('Bearer ',''):null
    }
    function getUserId(authorization) {
        var userId=-1
        var token = parseAutorization(authorization)
        if(token!=null){
            try {
                var jwtToken = jwt.verify(token, process.env.TOKEN)
                if(jwtToken!=null){
                    userId=jwtToken.userId
                }
            }
            catch(err){}
        }
        return userId
    }
};
//exportation de toute les publication 
exports.getAllPubli = async (req, res) => {
    try {
        //récuperation de toute les publication et de ce qui s'en rapporte( user, commentaire)
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
        res.status(500).json({ e: e.message });}
};
//ajout de commentaire
exports.addCommentaire = async (req, res,next) => {
    //récuperation des info envoyer
    var headerAuth=req.headers['authorization']
    var userId=getUserId(headerAuth)

    try{
        //recuperation des données de l'user
        const user = await models.User.findOne({
            attributes:["id","nom","prenom"],
            where:{id:userId}
        })
        //ajout du commentaire à la bdd
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
        res.status(400).json({ e: e.message });}

    //recuperation de l'id de l'user
    function parseAutorization(authorization){
        return (authorization !=null) ? authorization.replace('Bearer ',''):null
    }
    function getUserId(authorization) {
        var userId=-1
        var token = parseAutorization(authorization)
        if(token!=null){
            try {
                var jwtToken = jwt.verify(token,process.env.TOKEN)
                if(jwtToken!=null){
                    userId=jwtToken.userId
                }
            }
            catch(err){}
        }
        return userId
    }
};
//suppression de publication 
exports.deletePost = async (req, res,next) => {
    //récuperation de l'image
    const image = await models.Post.findOne({
        attributes:["image"],
        where:{id:req.body.publiId}
    })
    //suppression des commentaires de la publication 
    models.Commentaire.destroy({ where: { postId: req.body.publiId } });
    //suppresion de l'image
    try{
        const filename = image.image.split('/images/')[1];
        fs.unlink(`image/${filename}`, () => {
            models.Post.destroy({ where: { id: req.body.publiId } });
            res.status(200).json({ message: "Post supprimé" });
        });
    }
    catch(e){
        return res.status(500).send(e)
    }
}
//suppresion de commentaire
exports.deleteCom = async (req, res,next) => {
    //recuperation des données envoyer
    try{
        //suppression du commentaire
        models.Commentaire.destroy({ where: { id: req.body.comId } });
    }
    catch(e){
        return res.status(500).send(e)
    }
}