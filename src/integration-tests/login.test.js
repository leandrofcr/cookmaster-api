const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

const app = require('../api/app');
const { getConnection } = require('./connectionMock');

const { expect } = chai;


const expectedUser = {
  email: 'rick@sanchez.com',
  password: 'rick-C-137'
};


describe('POST /login', () => {
  describe('when username and password are not entered', ()=> {
    let response;

    before(async () => {
      response = await chai.request(app).post('/login').send({})
    })

    it('returns HTTP status 401', () => {
      expect(response).to.have.status(401);
    })

    it('returns an object in the body', () => {
      expect(response.body).to.be.an('object');
    })

    it('this object has a property called message', () => {
      expect(response.body).to.have.a.property('message');
    })

    it('the "message" property has a suitable error message', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    })
  });

  describe('when the user does not exist in the database or incorrect', ()=> {
    let connectionMock;
    let response;

    before(async() => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      response = await chai.request(app)
        .post('/login')
        .send(expectedUser);
    });

    after(()=> {
      MongoClient.connect.restore();
    })

    it('returns HTTP status 401', () => {
      expect(response).to.have.a.status(401);
    })

    it('returns an object in the body', () => {
      expect(response.body).to.be.an('object');
    })

    it('this object has a property called "message"', () => {
      expect(response.body).to.have.a.property('message');
    })

    it('the "message" property has a suitable error message', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password');
    })
  });

  describe('when login is successful', ()=> {
    let connectionMock;
    let response;

      before(async() => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(expectedUser)

      response = await chai.request(app)
        .post('/login')
        .send(expectedUser);
    });

    after(async ()=>{
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
    })

    it('returns HTTP status 200', () => {
      expect(response).to.have.a.status(200);
    })

    it('returns an object in the body', () => {
      expect(response.body).to.be.an('object');
    })

    it('this object has a property called "token"', () => {
      expect(response.body).to.have.an.property('token')

    })
  });
  
});
