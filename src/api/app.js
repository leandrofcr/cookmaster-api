const express = require('express');
const { usersRoute, loginRoute, recipesRoute } = require('./routes');

const app = express();
app.use(express.json());

// Do not remove this end-point, it is necessary for the evaluator.
app.get('/', (_request, response) => {
  response.send();
});

app.use('/users', usersRoute);
app.use('/login', loginRoute);
app.use('/recipes', recipesRoute);
app.use('/images', express.static('src/uploads/'));

module.exports = app;
