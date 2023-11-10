// Configuration de express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Lecture du fichier .env
require('dotenv').config()

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

// Importation des routeurs
const indexRouter = require('./routes/index.js');
const productRouter = require('./routes/product.js');
const tagRouter = require('./routes/tag.js');
const roleRouter = require('./routes/role.js');
const userRouter = require('./routes/user.js');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');
const orderRouter = require('./routes/order');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/tag', tagRouter);
app.use('/role', roleRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);

module.exports = app;
