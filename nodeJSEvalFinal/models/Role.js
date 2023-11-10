const sequelize = require('./_database');
const {DataTypes} = require("sequelize");

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Role