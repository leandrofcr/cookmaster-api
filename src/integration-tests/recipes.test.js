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

const admin = {
  name: 'Thanos',
  email: 'thanos@admin.com',
  password: 'infinitystonesareawesome',
  role: 'admin'
}

const editedRecipe = {
  name: 'Naruto Ramen edited',
  ingredients: 'meat, garlic, shoyu, onion ginger and pasta -  edited',
  preparation: 'mix everything edited',
}

describe('GET /recipes',  () => {
  describe('when the the endpoint is accessed',  () => {
    let connectionMock;
    let response;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      response = await chai.request(app).get('/recipes').send({});
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200',  () => {
      expect(response).to.have.status(200);
    });

    it('return an array in the body',  () => {
      expect(response.body).to.be.an('array');
    });

    it('the recipes are listed with information and id',  () => {
      expect(response.body[0]).to.have.a.property('_id');
      expect(response.body[0]).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body[0]).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body[0]).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});

describe('GET /recipes/:id',  () => {
  describe('when the recipe endpoint is accessed ',  () => {
    let connectionMock;
    let response;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId } = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      response = await chai.request(app).get(`/recipes/${insertedId}`).send({});
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 200',  () => {
      expect(response).to.have.status(200);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has the properties id, name, ingredients preparations and userId',  () => {
      expect(response.body).to.have.a.property('_id');
      expect(response.body).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});

describe('POST /recipes',  () => {
  describe('when the user is not logged in',  () => {
    let response;

    before(async  () => {
      response = await chai.request(app).post('/recipes').send(validRecipe);
    });

    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(401);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"',  () => {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message',  () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('when the user is logged in but sends invalid data',  () => {
    let connectionMock;
    let response;
    let login;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);

      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;

      response = await chai.request(app).post('/recipes').send(invalidRecipe).set({ authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
    });

    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(400);
    });

    it('returns an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called message',  () => {
      expect(response.body).to.have.a.property('message');
    });

    it('the "message" property has a suitable error message',  () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when the user is logged in and sends valid data',  () => {
    let connectionMock;
    let response;
    let login;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);

      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;

      response = await chai.request(app).post('/recipes').send(validRecipe).set({ authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });

    it('returns HTTP status 201',  () => {
      expect(response).to.have.status(201);
    });

    it('returns an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });

    it('this object has a property called recipe',  () => {
      expect(response.body).to.have.a.property('recipe');
    });

    it('the "recipe" property has id, name, preparation, ingredients and userId',  () => {
      expect(response.body.recipe).to.have.a.property('_id');
      expect(response.body.recipe).to.have.a.property('userId');
      expect(response.body.recipe).to.have.a.property('name').equal(validRecipe.name);
      expect(response.body.recipe).to.have.a.property('ingredients').equal(validRecipe.ingredients);
      expect(response.body.recipe).to.have.a.property('preparation').equal(validRecipe.preparation);
    });
  });
});

describe('PUT /recipes/:id', () => {
  describe('when user is not logged in', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);
      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).put(`/recipes/${recipeId}`).send(editedRecipe);
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(401);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"',  () => {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message',  () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  })
  
  describe('when the user is logged in and the recipe does not belong to the user', () => {
    let connectionMock;
    let response;
    let recipe;

    const newRecipe = {
      name: 'Naruto Ramen',
      ingredients: 'meat, garlic, shoyu, onion ginger and pasta',
      preparation: 'mix everything',
      userId: '137137137137137137137',
    };

    const anotherUser = { 
      name: 'Morty',
      email: 'evil@morty.com',
      password: 'mortyandjessica'
    }

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(anotherUser);
      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(newRecipe);
      
      login = await chai.request(app).post('/login').send(anotherUser);
      const { token } = login.body;
      
      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).put(`/recipes/${recipeId}`).send({}).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(401);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"', function () {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message', function () {
      expect(response.body.message).to.be.equal('access denied');
    });
  })

  describe('when the user is logged in and the recipe belongs to the user', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);
      
      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;
      
      recipe = await chai.request(app).post(`/recipes`).send(validRecipe).set({authorization: token })
      const {_id: recipeId } = recipe.body.recipe

      response = await chai.request(app).put(`/recipes/${recipeId}`).send(editedRecipe).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 200',  () => {
      expect(response).to.have.status(200);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the properties, id, name , ingredients, preparation and userId', function () {
      expect(response.body).to.be.a.property('_id');
      expect(response.body).to.be.a.property('userId');
      expect(response.body).to.be.a.property('name').equal(editedRecipe.name);
      expect(response.body).to.be.a.property('ingredients').equal(editedRecipe.ingredients);
      expect(response.body).to.be.a.property('preparation').equal(editedRecipe.preparation);
    });
  });

  describe('when the user is logged in and is an administrator', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(admin);
      
      login = await chai.request(app).post('/login').send(admin);
      const { token } = login.body;

      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);
      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).put(`/recipes/${recipeId}`).send(editedRecipe).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 200',  () => {
      expect(response).to.have.status(200);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the properties, id, name , ingredients, preparation and userId', function () {
      expect(response.body).to.be.a.property('_id');
      expect(response.body).to.be.a.property('userId');
      expect(response.body).to.be.a.property('name').equal(editedRecipe.name);
      expect(response.body).to.be.a.property('ingredients').equal(editedRecipe.ingredients);
      expect(response.body).to.be.a.property('preparation').equal(editedRecipe.preparation);
    });
  });
})

describe('DELETE /recipes/:id', () => {
  describe('when user is not logged in', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);
      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);

      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).delete(`/recipes/${recipeId}`).send(editedRecipe);
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(401);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"',  () => {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message',  () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  })
  
  describe('when the user is logged in and the recipe does not belong to the user', () => {
    let connectionMock;
    let response;
    let recipe;

    const newRecipe = {
      name: 'Naruto Ramen',
      ingredients: 'meat, garlic, shoyu, onion ginger and pasta',
      preparation: 'mix everything',
      userId: '137137137137137137137',
    };

    const anotherUser = { 
      name: 'Morty',
      email: 'evil@morty.com',
      password: 'mortyandjessica'
    }

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(anotherUser);
      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(newRecipe);
      
      login = await chai.request(app).post('/login').send(anotherUser);
      const { token } = login.body;
      
      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).delete(`/recipes/${recipeId}`).send({}).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 401',  () => {
      expect(response).to.have.status(401);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object has the property "message"', function () {
      expect(response.body).to.be.a.property('message');
    });

    it('the "message" property has a suitable error message', function () {
      expect(response.body.message).to.be.equal('access denied');
    });
  })

  describe('when the user is logged in and the recipe belongs to the user', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(validUser);
      
      login = await chai.request(app).post('/login').send(validUser);
      const { token } = login.body;
      
      recipe = await chai.request(app).post(`/recipes`).send(validRecipe).set({authorization: token })
      const {_id: recipeId } = recipe.body.recipe

      response = await chai.request(app).delete(`/recipes/${recipeId}`).send(editedRecipe).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 204',  () => {
      expect(response).to.have.status(204);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object is empty', function () {
      expect(response.body).to.be.empty;
    });
  });

  describe('when the user is logged in and is an administrator', () => {
    let connectionMock;
    let response;
    let recipe;

    before(async  () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db('Cookmaster').collection('users').insertOne(admin);
      
      login = await chai.request(app).post('/login').send(admin);
      const { token } = login.body;

      recipe = await connectionMock.db('Cookmaster').collection('recipes').insertOne(validRecipe);
      const {_id: recipeId } = recipe.ops[0]

      response = await chai.request(app).delete(`/recipes/${recipeId}`).send(editedRecipe).set({authorization: token });
    });

    after(async  () => {
      MongoClient.connect.restore();
      await connectionMock.db('Cookmaster').collection('users').drop();
      await connectionMock.db('Cookmaster').collection('recipes').drop();
    });


    it('returns HTTP status 204',  () => {
      expect(response).to.have.status(204);
    });

    it('return an object in the body',  () => {
      expect(response.body).to.be.an('object');
    });
  
    it('this object is empty', function () {
      expect(response.body).to.be.empty;
    });
  });
})