const sequelize = require('./_database');
const {DataTypes} = require("sequelize");

const Order = sequelize.define('Order', {
    user_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
})

module.exports = Order