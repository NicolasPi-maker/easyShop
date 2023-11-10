const sequelize = require('./_database');
const {DataTypes} = require("sequelize");

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Tag