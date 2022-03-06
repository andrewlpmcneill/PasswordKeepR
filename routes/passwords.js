/*
 * All routes for Passwords are defined here
 * Since this file is loaded in server.js into api/passwords,
 *   these routes are mounted onto /passwords
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.query.organizationID);
    const parameters = [`${req.query.organizationID}`];
    db.query(`SELECT passwords.id, service_name, service_url, login_username, login_password, passwords.description,
    categories.id AS category_id, categories.name AS category_name, categories.description AS category_description
    FROM passwords LEFT OUTER JOIN categories ON categories.id = category_id
    JOIN organizations ON passwords.organization_id = organizations.id
    JOIN users ON users.organization_id = organizations.id
    WHERE users.organization_id = $1
    GROUP BY users.organization_id, passwords.id, categories.id
    ORDER BY passwords.id;`, parameters)
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

  router.post("/", (req, res) => {
    const newPasswordObject = req.body;
    const parameters = [`${req.session.organizationId}`, `${req.session.userId}`, `${newPasswordObject.service_name}`, `${newPasswordObject.service_url}`, `${newPasswordObject.login_username}`, `${newPasswordObject.login_password}`, `${newPasswordObject.description}`, `${newPasswordObject.category_id}`];
    db.query(`
    INSERT INTO passwords
      (organization_id, creator_id, service_name, service_url, login_username, login_password, description, category_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      *;
    `, parameters)
      .then(data => {
        const response = data.rows;
        console.log(response);
        res.json({ response });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:passwordID", (req, res) => {
    let passwordID = req.params.passwordID;
    db.query(`SELECT * FROM passwords
    WHERE ID = ${passwordID}`)
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

  router.post("/:passwordID", (req, res) => {
    let username = req.body.login_username;
    let password = req.body.login_password;
    let description = req.body.description;
    let category_id = req.body.category_id;
    db.query(`UPDATE passwords
    SET login_username = '${username}', login_password = '${password}', description = '${description}', category_id = '${category_id}'
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
