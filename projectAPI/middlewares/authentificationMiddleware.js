const jwt = require("jsonwebtoken");
const sqlQuery = require("../utils/mysql");
const {User} = require("../models/model");

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
            // let query = `SELECT display_name as name, email, id FROM user WHERE id = ${payload.id}`;
            try {
                // sqlQuery(query, (err, results) => {
                //     if(!results.length) {
                //         res.status(401);
                //         res.send('Unauthorized');
                //         return;
                //     }
                //     req.user = results[0];
                //     next();
                // })
                (async () => {
                    await User.findByPk(payload.id)
                        .then(
                            (user) => {
                                if (!user) {
                                    res.status(401);
                                    res.send('Unauthorized');
                                    return;
                                }
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

module.exports = {
    authentificationMiddleWare
}