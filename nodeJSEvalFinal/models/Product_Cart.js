const sequelize = require('./_database');
const {DataTypes} = require("sequelize");

const Product_Cart = sequelize.define('Product_cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = Product_Cart