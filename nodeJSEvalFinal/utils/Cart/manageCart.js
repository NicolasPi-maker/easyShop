const {Product, Product_Cart} = require("../../models");

async function addProductToCart(cart, data, res) {
    Product.findByPk(data.ProductId).then((product) => {
        if(product.dataValues.stock < data.quantity) {
            res.status(500);
            res.json('Le stock est insuffisant');
        } else {
            Product_Cart.create({
                quantity: data.quantity ? data.quantity : 1,
                ProductId: product.dataValues.id,
                CartId: cart.id,
            });
        }
    })
}

async function updateStock(data, res) {
    Product.findByPk(data.ProductId)
        .then((product) => {
            product.update({
                stock: product.dataValues.stock - data.quantity
            })
            res.status(201);
            res.json('product added');
        }).catch((error) => {
        res.status(500);
        res.json('le produit n\'a pas pu être ajouté');
    })
}

module.exports = { addProductToCart, updateStock };