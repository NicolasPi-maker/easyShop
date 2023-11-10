// Ce fichier contient les middleware relatif à l'authentification
const jwt = require("jsonwebtoken");
const User = require("../models/user");
function authenticateAdmin(req, res, next){
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.send('Expired token');
                    return;
                }
            }
            try {
                User.findByPk(payload.id).then(user => {
                    if (!user.getRole().includes('admin')) {
                        res.status(401);
                        res.send('Unauthorized');
                        return;
                    }
                    req.user = user;
                    next();
                });
            }catch (err) {
                res.status(401);
                res.send('Access Denied');
            }
        });
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
}

function authenticateUser(req, res, next){
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.send('Expired token');
                    return;
                }
            }
            try {
                User.findByPk(payload.id).then(user => {
                    req.user = user;
                    next();
                });
            }catch (err) {
                res.status(401);
                res.send('Access Denied');
            }
        });
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
}

module.exports = {
    authenticateUser,
    authenticateAdmin,
}