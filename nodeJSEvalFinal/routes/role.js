const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Role } = require('../models');

// Get all roles
router.get('/', function(req, res){
    try {
        (async() => {
            await Role.findAll()
                .then(
                    (tags) => {
                        res.json(tags);
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

// Get role by id
router.get('/:id', function(req, res){
    let roleId = req.params.id;
    if(!roleId) {
        res.status(404);
        res.json('Aucun tag trouvé');
    }
    try {
        (async() => {
            await Role.findByPk(roleId)
                .then(
                    (role) => {
                        if (role) {
                            res.json(role);
                            res.status(200);
                        } else {
                            res.status(404);
                            res.json('Aucun role trouvé');
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

// Create role
router.post('/', function(req, res){
    const datas = req.body;
    if(datas) {
        try {
            (async() => {
                await Role.create({
                    name: datas.name,
                }).then((result) => {
                    res.status(201);
                    res.json('Creation success');
                }).catch((error) => {
                    res.status(500);
                    res.json(error);
                });
            })();
        } catch (error) {
            res.status(500);
            res.send(error);
        }
    } else {
        res.status(404);
        res.send('le role est vide');
    }
});

// Update role
router.patch('/:id', function(req, res){
    let roleId = req.params.id;
    const datas = req.body;
    try {
        (async() => {
            await Role.update({
                name : datas.name
            }, {
                where: {
                    id: roleId
                }
            }).then((result) => {
                res.status(200);
                res.json('Update success');
            }).catch((error) => {
                res.status(500);
                res.json(error);
            });
        })();
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});

// Delete role
router.delete('/:id', function(req, res){
    let roleId = req.params.id;
    if(roleId) {
        try {
            (async() => {
                await Role.destroy({
                    where: {
                        id: roleId
                    }
                }).then((result) => {
                    res.status(200);
                    res.json('Delete success');
                }).catch((error) => {
                    res.status(500);
                    res.json(error);
                });
            })();
        } catch (error) {
            res.status(500);
            res.send(error);
        }
    } else {
        res.status(404);
        res.send('Role inconnu');
    }
});

module.exports = router;