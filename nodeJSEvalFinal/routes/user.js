const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { User } = require('../models');
const { Role } = require('../models');
const {hash, compare} = require("bcrypt");
const setRandomSessionType = require("../utils/sessionType");

function generateToken(id, sessionType) {
    if(sessionType !== 'onBorne') {
        return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '30d'});
    }
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

// Get all users with role
router.get('/', function(req, res){
    try {
        (async() => {
            await User.findAll({
                include: [
                    {
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name']
                    }
                ]
            })
                .then(
                    (users) => {
                        res.json(users);
                        res.status(200);
                    }
                ).catch((error) => {
                    res.status(404);
                    res.send(error);
                });
        })();
    } catch (error) {
        res.status(500);
        res.json('Une erreur est survenue');
    }
});

// Get user by id
router.get('/:id', function(req, res){
    let userId = req.params.id;
    try {
        (async() => {
            await User.findByPk(userId)
                .then(
                    (user) => {
                        if(user) {
                            delete user.password;
                            res.json(user);
                            res.status(200);
                        } else {
                            res.status(404);
                            res.json('Aucun utilisateur trouvé');
                        }
                    }
                ).catch((error) => {
                    res.status(404);
                    res.send(error);
                });
        })();
    } catch (error) {
        res.status(500);
        res.json('Une erreur est survenue');
    }
});

// Create user account
router.post('/signup', function(req, res, next) {
    let data = req.body;
    if(data.password.length > 8) {
        hash(data.password, 12).then(hash => {
            data.password = hash;
            try {
                (async() => {
                    await User.create({
                        email: data.email,
                        password: data.password,
                        display_name: data.display_name,
                        // set default role to Customer
                        RoleId: 4
                    });
                })().then((result) => {
                    delete data.password;
                    res.json('created success');
                    res.status(201);
                });
            } catch (err) {
                res.send(err);
                res.status(500);
            }
        }).catch(error => {
            res.send(error);
            res.status(500);
        });
    } else {
        res.send('Invalid password length');
        res.status(500);
    }
});

// Login user
router.post('/login', function(req, res, next) {
    let data = req.body;
    try {
        if(data) {
            (async() => {
                await User.findOne({
                    where: {
                        email: data.email
                    },
                    limit: 1,
                }).then((user) => {
                    if(user) {
                        compare(data.password, user.password).then(isOk => {
                            if(!isOk) {
                                res.status(400);
                                res.send('Email ou mot de passe incorrect');
                            } else {
                                // GENERATE RANDOM SESSION TYPE
                                let sessionType = setRandomSessionType();
                                if(!sessionType) {
                                    sessionType = 'onBorne';
                                }
                                // GENERATE JWT Token
                                res.status(200);
                                let userToken = generateToken(user.id, sessionType);
                                res.setHeader('Authorization', 'bearer ' + userToken);
                                return res.json( {
                                    "userToken" : userToken,
                                    "user" : {
                                        id : user.id,
                                        name: user.display_name
                                    },
                                    "sessionType" : sessionType,
                                })
                            }
                        })
                    } else {
                        res.status(400);
                        res.json('Email ou mot de passe incorrect');
                    }
                }).catch((error) => {
                    res.status(401);
                    res.json('Email ou mot de passe incorrect');
                });
            })().catch((error) => {
                res.status(500);
                res.json(error);
            });
        } else {
            res.status(400);
            res.send('Email ou mot de passe incorrect');
        }
    } catch(error) {
        res.status(500);
        res.json(error);
    }
});

module.exports = router;