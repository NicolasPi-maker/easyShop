const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product, Tag} = require('../models');
const {addTag} = require("../utils/productTagManager");
const {Op, where} = require("sequelize");
const {checkRole} = require("../middlewares/userAuthenticator");

// Get all products
router.get('/', function(req, res){
    const query = req.query;
    try {
        (async() => {
            await Product.count()
                .then(
                    (count) => {
                        let page = (query.pages || 1) - 1 ;
                        let limit = 5;
                        let countPage = Math.round(count / limit);
                        page = page < countPage ? page : 0;
                        Product.findAll({
                            include: [
                                {
                                model: Tag,
                                attributes: ['id', 'name'],
                                    where: {
                                        name: {
                                            [Op.like]: `%${query.tag ? query.tag : ''}%`
                                        }
                                    }
                                },
                            ],
                            limit: limit,
                            offset: limit * page,
                            where: {
                                stock: {
                                    [Op.gt]: 0
                                },
                            }
                        }).then((products) => {
                            res.json({
                                "count": count,
                                "hasPrev": page > 0,
                                "hasNext": limit * (page + 1) < Math.max(count, limit),
                                "results": products
                            });
                        }).catch((error) => {
                            res.status(500);
                            res.json(error);
                        });
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

// Get product by id
router.get('/:id', function(req, res){
    let productId = req.params.id;
    try {
        (async() => {
            await Product.findByPk(productId, {
                include: [{
                    model: Tag,
                    attributes: ['id', 'name']
                }]
            })
                .then(
                    (product) => {
                        if(product) {
                            res.json(product);
                            res.status(200);
                        } else {
                            res.status(404);
                            res.json('Aucun produit trouvé');
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

// Create product
router.post('/', function(req, res){
    const data = req.body;
    if(data) {
        try {
            (async() => {
                await Product.create({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                    image: data.image
                }).then((result) => {
                    // addTag function add tag or array of tags to product
                    addTag(data, result, res);
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
        res.send('le produit est vide');
    }
});

// Update product
router.patch('/:id', function(req, res){
    let productId = req.params.id;
    const datas = req.body;
    try {
        (async() => {
            await Product.update({
                title: datas.title,
                description: datas.description,
                price: datas.price,
                stock: datas.stock,
                image: datas.image
            }, {
                where: {
                    id: productId
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

// Delete product
router.delete('/:id', function(req, res){
    let productId = req.params.id;
    if(productId) {
        try {
            (async() => {
                await Product.destroy({
                    where: {
                        id: productId
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
        res.send('Numéro de produit inconnu');
    }
});

module.exports = router;