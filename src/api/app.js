const express = require('express');

const app = express();

const usersRoute = require('./routes/usersRoute');

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});

// Não remover esse end-point, ele é necessário para o avaliador
app.use('/users', usersRoute);

module.exports = app;
