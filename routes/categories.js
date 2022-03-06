/*
 * All routes for Categories are defined here
 * Since this file is loaded in server.js into api/categories,
 *   these routes are mounted onto /categories
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM categories;`)
      .then(data => {
        const categories = data.rows;
        res.json({ categories });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const newCategoryObject = req.body;
    const parameters = [`${req.session.userId}`, `${newCategoryObject.category_name}`, `${newCategoryObject.category_description}`];
    db.query(`
    INSERT INTO categories
      (creator_id, name, description)
    VALUES
      ($1, $2, $3)
    RETURNING
      *;
    `, parameters)
      .then(data => {
        const response = data.rows;
        res.json({ response });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:categoryID", (req, res) => {
    let categoryID = req.params.categoryID;
    db.query(`SELECT * FROM categories
    WHERE ID = ${categoryID}`)
      .then(data => {
        const category = data.rows;
        res.json({ category });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:categoryID", (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    db.query(`UPDATE categories
    SET name = '${name}', description = '${description}'
    WHERE id = ${req.body.id};`)
      .then(data => {
        const passwords = data.rows;
        res.json({ passwords });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
