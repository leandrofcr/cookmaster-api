const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

const app = require('../api/app');
const { getConnection } = require('./connectionMock');

const { expect } = chai;

const expectedUser = {
  name: 'Rick Sanchez',
  email: 'rick@sanchez.com',
  password: 'rick-C-137'
};

const invalidUser = {
  name: 'Gandalf',
  email: 'rick@sanchez.com',
  password: 'youshallnotpass'
};

const validUser = {
  name: 'Gandalf',
  email: 'gandalf@thegrey.com',
  password: 'youshallnotpass'
};


describe('POST /users', () => {
  describe('when "name", "email", "password" are not entered ', () => {
    let response;

    before(async () => {
      response = await chai.request(app).post('/users').send({})
    })

    it('returns HTTP status 400', () => {
      expect(response).to.have.status(400);
    });

    it('return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called message', () => {
      expect(response.body).to.have.a.property('message');
    });

    it('the "message" property has a suitable error message ', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });

  });

  describe('when the email already belongs to another user', () => {
    let connectionMock;
    let response;

      before(async() => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(expectedUser)

      response = await chai.request(app)
        .post('/users')
        .send(invalidUser);
    });

    after(async ()=>{
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
    })

    it('returns HTTP status 409', () => {
      expect(response).to.have.status(409);
    });

    it('return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called message', () => {
      expect(response.body).to.have.a.property('message');
    });

    it('the "message" property has a suitable error message ', () => {
      expect(response.body.message).to.be.equal('Email already registered');
    });
  });

  describe('when the user is successfully registered', () => {
    let connectionMock;
    let response;

      before(async() => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(expectedUser)

      response = await chai.request(app)
        .post('/users')
        .send(validUser);
    });

    after(async ()=>{
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
    })

    it('returns HTTP status 201', () => {
      expect(response).to.have.status(201);
    });

    it('return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called "user"', () => {
      expect(response.body).to.have.a.property('user');
    });

    it('the "user" property has name, email, role, and id fields ', () => {
      expect(response.body.user).to.have.a.property('_id');
      expect(response.body.user).to.have.a.property('role').equal('user');
      expect(response.body.user).to.have.a.property('name').equal(validUser.name);
      expect(response.body.user).to.have.a.property('email').equal(validUser.email);

    });

  });
});