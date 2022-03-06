/*
 * All routes for Organizations are defined here
 * Since this file is loaded in server.js into api/organizations,
 *   these routes are mounted onto /organizations
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM organizations;`)
      .then(data => {
        const organizations = data.rows;
        res.json({ organizations });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const newOrganizationObject = req.body;
    const parameters = [`${newOrganizationObject.name}`, `${newOrganizationObject.password}`, `${newOrganizationObject.organization_url}`, `${newOrganizationObject.description}`, `${newOrganizationObject.logo_url}`];
    db.query(`
    INSERT INTO organizations
      (name, password, organization_url, description, logo_url)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING
      *;
    `, parameters)
      .then(data => {
        const organization = data.rows[0];
        res.json({ id: organization.id });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
