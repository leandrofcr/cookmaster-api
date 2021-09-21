const express = require('express');

const app = express();
app.use(express.json());

const usersRoute = require('./routes/usersRoute');

// Do not remove this end-point, it is necessary for the evaluator.
app.get('/', (request, response) => {
  response.send();
});

app.use('/users', usersRoute);

module.exports = app;
