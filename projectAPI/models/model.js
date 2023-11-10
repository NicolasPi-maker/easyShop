const User = require('./user');
const Task = require('./task');
const sequelizeInstance = require('../utils/sequelize');

User.hasMany(Task);
Task.belongsTo(User);

(async() => {
    await sequelizeInstance.sync({alter:true});
})();

module.exports = {User, Task};