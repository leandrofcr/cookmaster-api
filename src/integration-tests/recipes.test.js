const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

const app = require('../api/app');
const { getConnection } = require('./connectionMock');

const { expect } = chai;

const validRecipe = {
  name: 'Naruto Ramen',
  ingredients: 'meat, garlic, shoyu, onion ginger and pasta',
  preparation: 'mix everything',
};

const invalidRecipe = {
  name: 'Naruto Ramen',
  preparation: 'mix everything',
};

const validUser = {
  _id: '137137137137137137137',
  name: 'Rick Sanchez',
  email: 'rick@sanchez.com',
  password: 'rick-C-137',
  role: 'user',
};

describe('GET /recipes', function () {
  describe('when the the endpoint is accessed', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      response = await chai.request(app).get('/recipes').send({});
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200', function () {
      expect(response).to.have.status(200);
    });

    it('return an array in the body', function () {
      expect(response.body).to.be.an('array');
    });

    it('the recipes are listed with information and id', function () {
      expect(response.body[0]).to.have.a.property('_id');
      expect(response.body[0]).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body[0]).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body[0]).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});

describe('GET /recipes/:id', function () {
  describe('when the recipe endpoint is accessed ', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId } = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      response = await chai.request(app).get(`/recipes/${insertedId}`).send({});
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200', function () {
      expect(response).to.have.status(200);
    });

    it('return an object in the body', function () {
      expect(response.body).to.be.an('object');
    });

    it('this object has the properties id, name, ingredients preparations and userId', function () {
      expect(response.body).to.have.a.property('_id');
      expect(response.body).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});

describe('POST /recipes', function () {
  describe('when the user is not logged in', function () {
    let response;

    before(async function () {
      response = await chai.request(app).post('/recipes').send(validRecipe);
    });

    it('returns HTTP status 401', function () {
      expect(response).to.have.status(401);
    });

    it('return an object in the body', function () {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"', function () {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message', function () {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('when logged in but sends invalid data', function () {
    let connectionMock;
    let response;
    let login;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);

      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;

      response = await chai.request(app).post('/recipes').send(invalidRecipe).set({ authorization: token });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
    });

    it('returns HTTP status 401', function () {
      expect(response).to.have.status(400);
    });

    it('returns an object in the body', function () {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called message', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('the "message" property has a suitable error message', function () {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when logged in and sends valid data', function () {
    let connectionMock;
    let response;
    let login;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);

      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;

      response = await chai.request(app).post('/recipes').send(validRecipe).set({ authorization: token });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 201', function () {
      expect(response).to.have.status(201);
    });

    it('returns an object in the body', function () {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called recipe', function () {
      expect(response.body).to.have.a.property('recipe');
    });

    it('the "recipe" property has id, name, preparation, ingredients and userId', function () {
      expect(response.body.recipe).to.have.a.property('_id');
      expect(response.body.recipe).to.have.a.property('userId');
      expect(response.body.recipe).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body.recipe).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body.recipe).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});
