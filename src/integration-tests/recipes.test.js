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
  userId: 'd87as5d6as5dasdas676sdf34'
}


describe.only('GET /recipes', () => {
  describe('when the the endpoint is accessed', () => {
    let response;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe)

      response = await chai.request(app).get('/recipes').send({})
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200', () => {
      expect(response).to.have.status(200);
    });

    it('return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('the recipes are listed with information and id', () => {
      expect(response.body[0]).to.have.a.property('_id');
      expect(response.body[0]).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body[0]).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body[0]).to.have.a.property('preparation').equal(validRecipe.preparation);
      expect(response.body[0]).to.have.a.property('userId').equal(validRecipe.userId);
    });
  })
});

describe.only('GET /recipes/:id', () => {
  describe('when the recipe endpoint is accessed ', () => {
    let response;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId } = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe)

      response = await chai.request(app).get(`/recipes/${insertedId}`).send({})
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200', () => {
      expect(response).to.have.status(200);
    });

    it('return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has the properties id, name, ingredients preparations and userId', () => {
      expect(response.body).to.have.a.property('_id');
      expect(response.body).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body).to.have.a.property('preparation').equal(validRecipe.preparation);
      expect(response.body).to.have.a.property('userId').equal(validRecipe.userId);
    });
  })
})