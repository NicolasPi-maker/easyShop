const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const {log} = require("debug");
const sqlQuery = require('../utils/mysql');
const {User} = require("../models/model");

function generateToken(id) {
  return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  let data = req.body;
  if(data.password.length > 8) {
    bcrypt.hash(data.password, 12).then(hash => {
      data.password = hash;
      // let query = `INSERT INTO user (email, password, display_name) VALUES ('${data.email}', '${data.password}', '${data.display_name}')`;
      try {
        // sqlQuery(query, (err, result) => {
        //   delete data.password;
        //   res.json(data);
        //   res.status(200);
        // })
        (async() => {
          await User.create({
            email: data.email,
            password: data.password,
            display_name: data.display_name
          });
        })().then((result) => {
          delete data.password;
          res.json(data);
          res.status(201);
        });
      } catch (err) {
        res.send(err);
        res.status(500);
      }
    }).catch(error => {
      res.send(error);
      res.status(500);
    });
  } else {
    res.send('Invalid password length');
    res.status(500);
  }
});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let data = req.body;
    try {
      if(data) {
        (async() => {
          await User.findOne({
            where: {
              email: data.email
            },
            limit: 1,
          }).then((user) => {
              if(user) {
                bcrypt.compare(data.password, user.password).then(isOk => {
                  if(!isOk) {
                    res.status(400);
                    res.send('Invalid credentials');
                  } else {
                    // GENERATE JWT Token
                    res.status(200);
                    let userToken = generateToken(user.id);
                    res.setHeader('Authorization', 'bearer ' + userToken);
                    return res.json( {
                      "userToken" : userToken,
                      "user" : {
                        id : user.id,
                        name: user.display_name
                      }
                    })
                  }
                })
              } else {
                res.status(400);
                res.json('Invalid credentials');
              }
          }).catch((error) => {
            res.status(401);
            res.json('Invalid password or email');
          });
        })().catch((error) => {
            res.status(500);
            res.json(error);
        });
      } else {
        res.status(400);
        res.send('Invalid credentials');
      }
    } catch(error) {
      res.status(500);
    }
});

// /* GET users listing. */
// router.get('/token-test', function(req, res, next) {
//   const headers = req.headers;
//   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     let token = headers.authorization.replace('Bearer', '').trim();
//     jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//       if(err) {
//         res.status(401);
//         if(err.name === 'TokenExpiredError') {
//           res.send('Expired token');
//         }
//       }
//       let query = `SELECT display_name as name FROM user WHERE id = ${payload.id}`;
//       try {
//         sqlQuery(query, (err, results) => {
//           if(!results.length) {
//             res.status(401);
//             res.send('Unauthorized');
//             return;
//           }
//           res.json(results);
//           res.status(200);
//         })
//       } catch (err) {
//         res.status(401);
//         res.send('Access Denied');
//       }
//     });
//   } else {
//     res.status(500);
//     res.send('Unauthorized');
//   }
// });

module.exports = router;
