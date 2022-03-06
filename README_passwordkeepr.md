# PasswordKeepr

## Project Structure

```
├── bin
│   └── resetdb.js
├── db
│   ├── schema
│   │   ├── 01_organizations.sql 
│   │   ├── 02_users.sql 
│   │   ├── 03_categories.sql 
│   │   └── 04_passwords.sql 
│   └── seeds
│       ├── 01_organizations.sql 
│       ├── 02_users.sql 
│       ├── 03_categories.sql 
│       └── 04_passwords.sql 
├── lib
│   ├── db.js
│   └── sass-middleware.js
├── public
│   ├── scripts
│   │   ├── components 
│   │   │   ├── edit_category_form.js
│   │   │   ├── edit_password_form.js
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_category_form.js
│   │   │   ├── new_password_form.js
│   │   │   ├── passwords_table.js
│   │   │   ├── registration_form.js
│   │   │   └── search.js
│   │   ├── app.js
│   │   ├── database.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── vendor
│   │       ├── border-box.css
│   │       ├── jquery-3.0.0.js
│   │       └── normalize-4.1.1.css
│   └── index.html
├── routes
│   ├── categories.js
│   ├── organizations.js
│   ├── passwords.js
│   └── users.js
├── styles
│   ├── layout.css
│   └── main.css
└── server
    ├── database.js
    └── server.js

```

* `/public` contains all of the HTML, CSS, and client side JavaScript. 
  * `/public/index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `/public/scripts` contains all of the client side javascript files.
    * `app.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
  * `/public/styles` contains all of the SASS-generated CSS files.
* `styles` contains all of the sass files. 
* `server` contains all of the server side and database code.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `database.js` is responsible for all queries to the database.
