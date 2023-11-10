const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const sqlQuery = require('../utils/mysql');
const {log} = require("debug");
const {json} = require("express");
const middlewares = require("../middlewares/authentificationMiddleware");
const {Task} = require("../models/model");

router.use(middlewares.authentificationMiddleWare);

/* Liste des todo */
router.get('/', function(req, res, next) {
  const { id } = req.user;
  // sqlQuery(`SELECT * FROM tasks`, (err, results) => {
  //   const count = results[0].count;
  //   let page = (req.query.pages || 1) - 1 ;
  //   let limit = 5;
  //   const whereClause = {
  //     title : (value) => value,
  //   }
  //   let countPage = Math.round(count / limit);
  //   let isDone = req.query.done;
  //   let searchTitle = req.query.search;
  //   page = page < countPage ? page : 0;
  //   let query = `SELECT id, title, due_date, done, user_id FROM tasks`;
  //   ${isDone ? 'AND done=1'  : 'AND done=0'} ${searchTitle ? `AND title Like '%${searchTitle}%'` : ''} LIMIT ${limit} OFFSET ${limit * page}
  //   try {
  //     sqlQuery(query, (error, results) => {
  //       res.json({
  //         "count": count,
  //         "hasPrev": page > 0,
  //         "hasNext": limit * (page + 1) < Math.max(count, limit),
  //         "results": results
  //       });
  //     })
  //   } catch (error) {
  //     res.writeHead(500);
  //     throw new Error(error);
  //   }
  // })
  try {
    (async () => {
      await Task.findAll({
        where: {
            user_id: id
        }
      })
      .then(
          (tasks) => {
            res.json(tasks);
            res.status(200);
          }
      ).catch((error) => {
        console.log(error);
        res.status(404);
      });
    })();
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

/* Détail d'un todo */
router.get('/:id', function(req, res, next) {
  let taskId = req.params.id;
  // const user = req.user;
  // let query = `SELECT * FROM tasks WHERE id = ${taskId} AND user_id = ${user.id}`;
  // try {
  //   sqlQuery(query, (error, results) => {
  //     res.json(results);
  //   })
  // } catch (error) {
  //   res.status(500);
  //   throw new Error(error);
  // }
    try {
        (async () => {
        await Task.findByPk(taskId)
            .then(
                (task) => {
                    res.status(200);
                    res.json(task);
                }
            ).catch((error) => {
                res.status(404);
                console.log(error);
            });
        })();
    } catch (error) {
        res.status(500);
        console.log(error);
    }
});

/* Création d'un todo */
router.post('/', function(req, res, next) {
  const data = req.body;
  if(!data) {
    res.status(404);
    throw new Error('le produit est vide');
  }
  try {
    // let query =
    //     `
    //       INSERT INTO tasks (title, due_date, done, description, user)
    //       VALUES ('${data.title}','${data.due_date}','${data.done}', '${data.description}', '${data.user.id}')
    //     `;
    // sqlQuery(query, (error, results) => {
    //   res.json(results);
    //   res.status(201);
    // })
    (async() => {
      await Task.create({
        title: data.title,
        description: data.description,
        done: data.done,
        due_date: data.due_date,
        user_id: data.user_id
      });
    })().then((result) => {
      res.json('Creation success');
      res.status(201);
    }).catch((error) => {
        console.log(error);
        res.status(500);
    });
  } catch (error) {
    res.status(error.status);
    throw new Error('Une erreur serveur est survenue');
  }
});

/* Mise à jour partielle */
router.patch('/:id', function(req, res, next) {
  let taskId = req.params.id;
  // const user = req.user;
  const data = req.body;
  // let query = `UPDATE tasks SET title = '${data.title}', description = '${data.description}', due_date = '${data.due_date}', done = '${data.done}' WHERE id = '${taskId} AND user_id = '${user.id}`;
  try {
    // sqlQuery(query, (error, results) => {
    //   res.json(results);
    //   res.status(204);
    // })
    (async() => {
      await Task.update({
        title: data.title,
        description: data.description,
        done: data.done,
        due_date: data.due_date,
        user_id: data.user_id
      }, {
        where: {
          id: taskId
        },
      });
    })().then((result) => {
      res.json('Update success');
      res.status(204);
    }).catch((error) => {
        console.log(error);
        res.status(500);
    });
  } catch (error) {
    res.status(error.status);
    throw new Error('Une erreur serveur est survenue');
  }
});

/* Suppression d'un todo */
router.delete('/:id', function(req, res, next) {
  let taskId = req.params.id;
  if(taskId !== -1) {
    try {
      // let query = `DELETE FROM tasks WHERE id = ${taskId}`;
      // sqlQuery(query, (error, result) => {
      //   res.json(result);
      //   res.status(204);
      // })
      (async() => {
        await Task.destroy({
          where: {
            id: taskId
          },
        });
      })().then((result) => {
        res.json('Delete success');
        res.status(204);
      }).catch((error) => {
            console.log(error);
            res.status(500);
      });
    } catch (error) {
      res.status(error.status)
      throw new Error(error);
    }
  } else {
    res.status(404)
  }
});

module.exports = router;
