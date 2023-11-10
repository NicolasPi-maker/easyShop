const jwt = require("jsonwebtoken");
const {User} = require("../models");

async function authentificationMiddleWare(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err) {
                if(err.name === 'TokenExpiredError') {
                    res.send('Expired token');
                    return;
                }
            }
            try {
                (async () => {
                    await User.findByPk(payload.id)
                        .then(
                            (user) => {
                                if (!user) {
                                    res.status(401);
                                    res.send('Unauthorized');
                                    return;
                                }
                                delete user.dataValues.password
                                req.user = user.toJSON();
                                next();
                            }
                        ).catch((error) => {
                            res.status(404);
                            res.send(error);
                        });
                })();
            } catch (err) {
                res.status(401);
                res.send('Access Denied');
            }
        });
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
}

module.exports = { authentificationMiddleWare }