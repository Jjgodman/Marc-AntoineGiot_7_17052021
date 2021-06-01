//imporation des module
const bcrypt = require('../../node_modules/bcrypt');
const jwt = require('../../node_modules/jsonwebtoken');
const models = require('../../models')
const dotenv= require('../../node_modules/dotenv')
const fs = require("fs");
dotenv.config();

//inscription d'un user
exports.signup = (req, res, next) => {
	//récuperation des données d'inscription 
	var email = req.body.email;
	var nom = req.body.nom;
	var prenom = req.body.prenom;
	var password = req.body.password;
	//verification des entrées de l'utilisateur
	if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/.test(password)) {   
		return res.status(401).json({ error: 'weak password' });
	}

	if (!/^[A-Za-z-]{3,25}$/.test(nom)) {
		return res.status(401).json({ error: 'bad name' });
	} 

	if (!/^[A-Za-z-]{3,25}$/.test(prenom)) {
		return res.status(401).json({ error: 'bad prenom' });
	} 

	if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
		return res.status(401).json({ error: 'bad email' });
	} 

	if (email == null || nom==null||prenom==null||password==null) {
		return res.status(400).json({'error':'missing parameters'})
	}
	//vérification que l'user n'existe pas encore
	models.User.findOne({
		attributes: ["email"],
		where: { email: email }
	})

	//ajout de l'user
	.then(function(userFound) {
		if(!userFound){
			//cryptage du mdp
			bcrypt.hash(password, 5, function(err,bcryptedPassword) {
				//creation de l'user
				var newUser=models.User.create({
				email:email,
				nom:nom,
				prenom:prenom,
				password:bcryptedPassword
			})
			.then(function(newUser) {
				return res.status(201).json({
					'userId':newUser.id
				})
			})
			.catch(function(err) {
				return res.status(500).json({'error':'cannot add user'})
			})
		})
		}
		else {
			return res.status(409).json({'error':'user already exist'})
		}
	})
	.catch(function(err) {
		return res.status(500).json({'error':err});
	});
};
//connexion de l'user
exports.login = (req, res, next) => {
	//recuparation des information de connexion
	var email=req.body.email;
	var password=req.body.password;

	if (email == null || password==null) {
		return res.status(400).json({'error':'missing parameters'})
	}
	//recherche de l'user dans la bdd
	models.User.findOne({
		where: { email: email }
	})
	//vérification du mdp et attribution d'un token
	.then(function(userFound) {
		if(userFound) {
			bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
				if(resBycrypt) {
					return res.status(200).json({
						userId: userFound.id,
						token: jwt.sign(
							{ userId: userFound.id},
							process.env.TOKEN,
							{ expiresIn: '1h' }
						)
					});
				}
				else {
					return res.status(403).json({'error':'invalide password'})
				}
			})
		}
		else {
			return res.status(404).json({'error':'user not exist in DB'})
		}
	})
	.catch(function(err) {
		return res.status(500).json({'error':'unable to verify user'});
	});
};
//récuperation des information de l'utilisateur
exports.getUserProfile = (req, res, next) => {
	//récuperation des données de la requette
	var headerAuth=req.headers['authorization']
	var userId=getUserId(headerAuth)
	if(userId<0){
		return res.status(400).json({'error':'wrong token'})
	}
	//recherche de l'user dans la bdd
	models.User.findOne({
		attributes:['id','email','nom','prenom','admin'],
		where:{id:userId}
	})
	//renvoie des données
	.then(function(user) {
		if(user) {
			res.status(201).json(user)
		}
		else{
			res.status(404).json({'error':'user not found'});
		}
	})
	.catch(function (err){
		res.status(500).json({'error':'cannot fetch user'});
	})
	//verification de l'authenticité du token
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
//modification du profile
exports.updateUserProfile =async (req, res, next) => {
	//récuperation des données de la requette
	var nom = req.body.nom
	var prenom = req.body.prenom
	var email = req.body.email
	//vérification des données entrées
	if (nom != "" && !/^[A-Za-z-]{3,25}$/.test(nom)) {
		return res.status(401).json({ error: 'bad name' });
	} 

	if (prenom != "" && !/^[A-Za-z-]{3,25}$/.test(prenom)) {
		return res.status(401).json({ error: 'bad prenom' });
	} 

	if (email != "" && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
		return res.status(401).json({ error: 'bad email' });
	}
	//vérification de l'email est libre
	userAT=await models.User.findOne({
		attributes: ["email"],
		where: { email: email }
	})
	if(userAT){
		return res.status(401).json({ error: 'email already take' });
	}
	//récuperation des données actuel de l'user
	try {
		var userToFind = await models.User.findOne({
			attributes: ["id", "nom", "prenom", "email"],
			where: { id: req.body.id }
		});
		if (!userToFind) {
			throw new Error("Sorry,we can't find your account");
		}
		//on garde les info actuel si elle ne change pas
		if(nom===""){nom+=userToFind.nom}
		if(prenom===""){prenom+=userToFind.prenom}
		if(email===""){email+=userToFind.email}
		//update de l'user
		var userToUpdate = await models.User.update(
			{
				nom: nom,
				prenom: prenom,
				email: email
			},
			{
				where: { id: req.body.id }
			}
		);

		if (!userToUpdate) {
			throw new Error("Sorry,something gone wrong,please try again later");
		}
		res.status(200).json({
			message: "Your account has been update"
		});
	} 
	catch (error) {
		res.status(400).json({ error: error.message });
	}
};
//suppression du profile
exports.deleteUserProfile =async (req, res) => {
	try{
		//recherche de l'user
		const userToFind=await models.User.findOne({
			where:{id:req.body.id}
		})
		const image = await models.Post.findAll({
			attributes:["image"],
			where:{userId:req.body.id}
		})
		if (!userToFind) {
				throw new Error("Sorry,we can't find your account");
		}
		//suppression des commentaires et des publication de l'user 
		models.Commentaire.destroy({ where: { userId: req.body.id } });
		for (i of image){
			const filename = i.image.split('/images/')[1];
        	fs.unlink(`image/${filename}`, () => {
            	models.Post.destroy({ where: { userId: req.body.id } });
        	});
		}
		//suppression des commentaires de la publication 
		models.Post.destroy({ where: { userId: req.body.id } });
		//suppression de l'user
		userToFind.destroy({ id: req.body.id })
		.then(() => res.status(200).json({ message: 'User delete'}))
		.catch(e=>{console.log(e)})
	}
	catch(error){
		console.log(error);
		res.status(400).json({error})
	}
}
//vérification de l'authenticité du token
exports.authentifier =async (req, res) => {
	try{
		var token= req.headers['authorization']
		var respo= getToken(token)
		res.status(200).json({ respo})
	}
	catch(error){
		res.status(400).json({error})
	}

	function getToken(token) {
		try {
			var jwtToken = jwt.verify(token, process.env.TOKEN)
			return jwtToken
		}
		catch(error){return error}
	}
}