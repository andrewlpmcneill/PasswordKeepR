// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("../lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: "styles",
    destination: "public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

// /users endpoints
const usersRoutes = require("../routes/users");
app.use("/api/users", usersRoutes(db));

// /passwords endpoints
const passwordsRoutes = require("../routes/passwords");
app.use("/api/passwords", passwordsRoutes(db));

// /organizations endpoints
const organizationsRoutes = require("../routes/organizations");
app.use("/api/organizations", organizationsRoutes(db));

// /categories endpoints
const categoriesRoutes = require("../routes/categories");
app.use("/api/categories", categoriesRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/", (req, res) => {
//   res.render("./public/index");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
