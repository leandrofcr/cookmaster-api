const express = require('express');

const app = express();
app.use(express.json());

const { usersRoute, loginRoute, recipesRoute } = require('./routes');

// Do not remove this end-point, it is necessary for the evaluator.
app.get('/', (_request, response) => {
  response.send();
});

app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/recipes', recipesRoute);

module.exports = app;
