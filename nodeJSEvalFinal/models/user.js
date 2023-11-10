const sequelize = require('./_database');
const {DataTypes} = require("sequelize");

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    indexes: [
        {'unique': true, 'fields': ['email']}
    ],
})

module.exports = User