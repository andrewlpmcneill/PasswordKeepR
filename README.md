PasswordKeepR
=========

PasswordKeepR is an all-in-one password manager where organizations and users can generate and store their passwords.

## Demos

A user logging in. (Don't worry - those aren't real passwords or accounts 🙃)

!['Login flow'](https://github.com/seamusmcgill/passwordkeepr/blob/master/docs/login.gif?raw=true)

Filtering passwords by category.

!['Category filter'](https://github.com/seamusmcgill/passwordkeepr/blob/master/docs/categories%20filter.gif?raw=true)

Searching for a specific password.

!['Password search'](https://github.com/seamusmcgill/passwordkeepr/blob/master/docs/search.gif?raw=true)

Users can generate a password by choosing a length and whether to include capitals or special characters. 

!['Password generator'](https://github.com/seamusmcgill/passwordkeepr/blob/master/docs/passwordgenerator.gif?raw=true)

Secure mode can protect passwords from prying eyes - and can only be undone by entering PasswordKeepR login information.

!['Secure mode'](https://github.com/seamusmcgill/passwordkeepr/blob/master/docs/securemode.gif?raw=true)

## Stack

Front End
- HTML
- CSS (Pico framework)
- Sass
- jQuery

Back End
- Node.js
- Express
- Postgres

## Setup 

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
- username: `labber`
- password: `labber`
- database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
- Check the db folder to see what gets created and seeded in the SDB
6. Run the server: `npm run local`
- Note: nodemon is used, so you should not have to restart your server
7. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x

## Credits

[Barento Badaso](https://github.com/bbadaso/)

[Seamus McGill](https://github.com/seamusmcgill/)

[Andrew McNeill](https://github.com/andrewlpmcneill/)
