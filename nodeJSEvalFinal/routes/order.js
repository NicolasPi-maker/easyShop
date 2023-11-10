const express = require('express');
const router = express.Router();
const {Cart, Product, Role, Order} = require("../models");
const {authentificationMiddleWare} = require("../middlewares/auth");
router.use(authentificationMiddleWare);

router.post('/', function(req, res){
    const user = req.user;
    const data = req.body;
    (async() => {
        Cart.findOne({
            where: {
                UserId: user.id
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
        }).then((cart) => {
            let productsPrice = [];
            for(let product in cart.dataValues.Products) {
                productsPrice.push(product.dataValues.price * product.dataValues.Product_Cart.quantity);
            }
            Order.create({
                UserId: user.id,
                CartId: cart.id,
                user_address: data.address,
                total_amount: productsPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
            }).then((result)=> {
                Cart.destroy({
                    where: {
                        UserId: user.id,
                        CartId: cart.id,
                    }
                }).then((result) => {
                    res.status(200);
                    res.json('Commande créée');
                }).catch((error) => {
                    res.status(500);
                    res.json('Impossible de supprimer le panier');
                })
            }).catch((error) => {
                res.status(500);
                res.json('Impossible de créer la commande');
            });
            res.status(200)
        }).catch((error) => {
            res.status(500);
            res.json('L\'utilisateur n\'a pas de panier');
        });
    })();
});


module.exports = router;