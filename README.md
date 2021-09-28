# Welcome to the Cookmaster API project repository!


## What was developed


This project aims to deliver an API where it is possible to register and login users, where only these people can access, modify and delete the recipes they have registered.


## Skills

In this project, the following skills were worked:

- Understand what's inside an authentication token;

- Generate tokens from information such as login and password;

- Authenticate Express routes, using JWT token;

- Upload files in REST APIs;

- Save files on the server through a REST API;

- Query server files through a REST api.

- Perform integration tests

---

# Clone Project Instructions

1. Clone the repository

- `git clone git@github.com:leandrofcr/cookmaster-api.git`.
- Enter the repository folder you just cloned:
  - `cd cookmaster-api`

2. Install dependencies

- `npm install`


** Important notes:**

- Local testing depends on the API running (use `npm run dev` to facilitate the process);

---

There are two files in `./src/api/` in the repository: `server.js` and `app.js`.

In `app.js` the following code snippet should not be removed:

```javascript
app.get('/', (request, response) => {
  response.send();
});
```
This is configured for the evaluator to work correctly.


## Collections

The database will have two collections: users and recipes.

The collection of users should have the following name: `users`.

The fields in the `users` collection will have this format:

```json
{ "name" : "Erick Jacquin", "email" : "erickjacquin@gmail.com", "password" : "12345678", "role" : "user" }
```


The fields in the `recipes` collection will have this format:

```json
{ "name" : "Receita do Jacquin", "ingredients" : "Frango", "preparation" : "10 minutos no forno" }
```
---

## Linter

[ESLint](https://eslint.org/) was used to perform the static analysis of the code.

This project already comes with _linter_-related dependencies configured in the `package.json` file.

To be able to run `ESLint` in a project just run `npm install` inside the project and then `npm run lint`. If `ESLint`'s analysis finds problems in your code, those problems will show up on your terminal. If there is no problem with your code, nothing will be printed on your terminal.


## Tests

To run the integration tests run `npm run dev:test` in your terminal.

---


Let's GO!!
