const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Tag } = require('../models');

router.get('/', function(req, res){
    try {
        (async() => {
            await Tag.findAll()
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

router.get('/:id', function(req, res){
    let tagId = req.params.id;
    if(!tagId) {
        res.status(404);
        res.json('Aucun tag trouvé');
    }
    try {
        (async() => {
            await Tag.findByPk(tagId)
                .then(
                    (tag) => {
                        if (tag) {
                            res.json(tag);
                            res.status(200);
                        } else {
                            res.status(404);
                            res.json('Aucun tag trouvé');
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

router.post('/', function(req, res){
    const data = req.body;
    if(data) {
        try {
            (async() => {
                await Tag.create({
                    name: data.name,
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
        res.send('le tag est vide');
    }
});

router.patch('/:id', function(req, res){
    let tagId = req.params.id;
    const datas = req.body;
    try {
        (async() => {
            await Tag.update({
                name : datas.name
            }, {
                where: {
                    id: tagId
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

router.delete('/:id', function(req, res){
    let tagId = req.params.id;
    if(tagId) {
        try {
            (async() => {
                await Tag.destroy({
                    where: {
                        id: tagId
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
        res.send('Numéro de tag inconnu');
    }
});

module.exports = router;