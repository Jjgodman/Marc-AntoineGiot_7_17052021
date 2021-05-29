const bcrypt = require('../../node_modules/bcrypt');
const jwt = require('../../node_modules/jsonwebtoken');
const models = require('../../models')
//const dotenv  = require('../../backend/node_modules/dotenv');
//dotenv.config();


const mysqlConnection = require('../utils/database');


exports.signup = (req, res, next) => {
  var email = req.body.email;
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var password = req.body.password;

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
  models.User.findOne({
    attributes: ["email"],
    where: { email: email }
  })
  .then(function(userFound) {
    if(!userFound){
      bcrypt.hash(password, 5, function(err,bcryptedPassword) {
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
          console.log(err);
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

exports.login = (req, res, next) => {
  var email=req.body.email;
  var password=req.body.password;

  if (email == null || password==null) {
    
    return res.status(400).json({'error':'missing parameters'})
  }

  models.User.findOne({
    where: { email: email }
  })
  .then(function(userFound) {
    if(userFound) {
      bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
        if(resBycrypt) {
          return res.status(200).json({
            userId: userFound.id,
              token: jwt.sign(
                { userId: userFound.id },
                'TOKEN',
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

exports.getUserProfile = (req, res, next) => {
  var headerAuth=req.headers['authorization']
  var userId=getUserId(headerAuth)
  console.log(userId);
  if(userId<0){
    return res.status(400).json({'error':'wrong token'})
  }

  models.User.findOne({
    attributes:['id','email','nom','prenom'],
    where:{id:userId}
  })
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

exports.updateUserProfile =async (req, res, next) => {
  var nom = req.body.nom
  var prenom = req.body.prenom
  var email = req.body.email

  if (nom != "" && !/^[A-Za-z-]{3,25}$/.test(nom)) {
    return res.status(401).json({ error: 'bad name' });
  } 

  if (prenom != "" && !/^[A-Za-z-]{3,25}$/.test(prenom)) {
    return res.status(401).json({ error: 'bad prenom' });
  } 

  if (email != "" && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
    return res.status(401).json({ error: 'bad email' });
  } 
  userAT=await models.User.findOne({
    attributes: ["email"],
    where: { email: email }
  })
    if(userAT){
      return res.status(401).json({ error: 'email already take' });
    }
	try {
		var userToFind = await models.User.findOne({
			attributes: ["id", "nom", "prenom", "email"],
			where: { id: req.body.id }
		});

		if (!userToFind) {
			throw new Error("Sorry,we can't find your account");
		}

    if(nom===""){nom+=userToFind.nom}
    if(prenom===""){prenom+=userToFind.prenom}
    if(email===""){email+=userToFind.email}
    
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

exports.deleteUserProfile =async (req, res) => {
  try{
    const userToFind=await models.User.findOne({
      where:{id:req.body.id}
    })
    if (!userToFind) {
			throw new Error("Sorry,we can't find your account");
		}
    userToFind.destroy({ id: req.body.id })
      .then(() => res.status(200).json({ message: 'User delete'}))
      .catch
  }
  catch(error){
    res.status(400).json({error})
  }
}

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
      var jwtToken = jwt.verify(token, 'TOKEN')
      return jwtToken
    }
    catch(error){return error}
  }
}