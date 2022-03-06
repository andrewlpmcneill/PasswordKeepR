/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { param } = require('express/lib/request');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  const getUserWithEmail = function(email) {
    // Query database with user-inputted email
    return db.query(`
    SELECT users.full_name, users.email, users.id, users.password, users.organization_id, organizations.name AS organization_name, organizations.logo_url AS logo_url
    FROM users JOIN organizations ON users.organization_id = organizations.id
    WHERE email = $1`, [email])
      .then(result => {
        console.log(result.rows[0]);
        if (result.rows.length === 0) {
          return null;
        }
        // Return user object if successful
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getUserWithId = function(id) {
    // Query database for a user with a specific ID
    return db.query(`
    SELECT users.full_name, users.email, users.id, users.organization_id, organizations.name AS organization_name, organizations.logo_url AS logo_url
    FROM users JOIN organizations ON users.organization_id = organizations.id
    WHERE users.id = $1`, [id])
      .then(result => {
        if (result.rows.length === 0) {
          return null;
        }
        // Return user object if successful
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const loginUser  =  function(email, password) {
    return getUserWithEmail(email)
      .then(user => {
        if (password === user.password) {
          console.log("SUCCESSFUL LOGIN!");
          return user;
        }
        return null;
      });
  };

  // ROUTE FOR LOGGING USERS IN
  router.post('/login', (req, res) => {

    const {email, password} = req.body;
    loginUser(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        req.session.organizationId = user.organization_id;
        console.log("Logged in user is: ", req.session.userId);
        res.send({user: {name: user.full_name, email: user.email, organization: user.organization_name, logo_url: user.logo_url, id: user.id}});
      })
      .catch(e => res.send(e));
  });


  // ROUTE FOR CREATING NEW USER
  router.post('/new', (req, res) => {

    const userObject = req.body;
    const parameters = [`${userObject.full_name}`, `${userObject.organization_id}`, `${userObject.email}`, `${userObject.password}`];
    db.query(`
    INSERT INTO users
      (full_name, organization_id, email, password)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      *;
    `, parameters)
      .then(data => {
        const user = data.rows[0];
        req.session.userId = user.id;
        req.session.organizationId = user.organization_id;
        getUserWithId(user.id)
          .then(user => {
            res.json({user: {name: user.full_name, email: user.email, organization: user.organization_name, id: user.id}});
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ROUTE TO CHECK FOR LOGGED IN USER
  router.get("/current", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }

    getUserWithId(userId)
      .then(user => {
        if (!user) {
          res.send({error: "no user with that id"});
          return;
        }

        res.send({user: {name: user.full_name, email: user.email, organization: user.organization_name, organizationID: user.organization_id, logo_url: user.logo_url, id: userId}});
      })
      .catch(e => res.send(e));
  });

  // ROUTE TO VERIFY LOGGED IN USER ON SECURE MODE
  router.post("/verify", (req, res) => {
    // console.log(`Routing req.body is`, req.body);
    const parameters = [`${req.body.email}`];
    db.query(`
    SELECT password
    FROM users
    WHERE email = $1
    `, parameters)
      .then(result => {
        if (result.rows[0].password === req.body.password) return res.send(true);
        return res.send(false);
      });
  });

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    req.session.organizationId = null;
    res.send({});
  });

  return router;

};
