const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const Tag = require('./Tag');
const User = require('./User');
const Cart = require('./Cart');
const Role = require('./Role');
const Product_Cart = require('./Product_Cart');
const Order = require('./Order');

// Déclaration des relations

// Many to Many Product <-> Tag
Product.belongsToMany(Tag, {through: 'ProductTag'});
Tag.belongsToMany(Product, {through: 'ProductTag'});

// Many to One Role -> User
Role.hasMany(User);
User.belongsTo(Role);

// Many to One User -> Cart
User.hasMany(Cart);
Cart.belongsTo(User);

// Many to Many Product <-> Cart
Product.belongsToMany(Cart, {through: Product_Cart});
Cart.belongsToMany(Product, {through: Product_Cart});

// Many to One User -> Order
User.hasMany(Order);
Order.belongsTo(User);

// Synchronisation de la base
(async() => {
    await sequelize.sync({alter: true});
})();

module.exports = {
    Product,
    Tag,
    User,
    Cart,
    Role,
    Product_Cart,
    Order
}
