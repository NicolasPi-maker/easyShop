const { DataTypes} = require('sequelize');
const sequelizeInstance = require('../utils/sequelize');
const {Task} = require('./task');
const {hash} = require("bcrypt");

const User = sequelizeInstance.define('User', {
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
});

module.exports = User;