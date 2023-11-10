const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product, Product_Cart, Cart} = require('../models');
const {authentificationMiddleWare} = require("../middlewares/auth");
const {addProductToCart, updateStock} = require("../utils/Cart/manageCart");
router.use(authentificationMiddleWare);

// Get cart by id and by user owner
router.get('/:id', function(req, res){
    const user = req.user;
    let cartId = req.params.id;
    try {
        (async() => {
            await Cart.findByPk(cartId, {
                where: {
                    UserId : user.id
                },
                include: [
                    {
                        model: Product,
                        attributes: ['title', 'price', 'description', 'image'],
                        through: {
                            attributes: ['quantity']
                        }
                    }
                ]
            })
                .then(
                    (cart) => {
                        if(cart) {
                            res.json(cart);
                            res.status(200);
                        } else {
                            res.status(404);
                            res.json('Aucun panier trouvé');
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

// Create cart and add product to cart
router.post('/', function(req, res){
    const user = req.user;
    const data = req.body;
    try {
        (async() => {
            // Check if user has a cart
            await Cart.findOne({
                where: {
                    UserId: user.id
                },
            }).then((cart) => {
                if(cart) {
                    // add product to cart
                    addProductToCart(cart, data).then((result) => {
                        // Update stock
                        updateStock(data, res);
                    });
                } else {
                    (async () => {
                        // Create cart if user has no cart
                        await Cart.create({
                            UserId: user.id
                        }).then((cart) => {
                            addProductToCart(cart, data).then((result) => {
                                updateStock(data, res);
                            });
                        }).catch((error) => {
                            res.status(500);
                            res.json(error);
                        });
                    })();
                }
            })
        })();
    } catch (error) {
        res.status(500);
        res.json(error);
    }
});

// delete cart
router.delete('/:id', function(req, res){
    let cartId = req.params.id;
    const user = req.user;
    if(cartId && user) {
        try {
            (async() => {
                await Cart.destroy({
                    where: {
                        id: cartId,
                        UserId: user.id
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
        res.send('La référence du panier est inconnu');
    }
});

module.exports = router;