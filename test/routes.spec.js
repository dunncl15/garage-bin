/*eslint-env node, mocha*/
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
const server = require('../server');

chai.use(chaiHttp);

describe('Garage Bin Tests', () => {

  before((done) => {
    database.migrate.latest()
    .then(() => done());
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done());
  });

  describe('GET route', () => {

    it('should return all items', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('item');
        response.body[0].should.have.property('reason');
        response.body[0].should.have.property('cleanliness');
        done();
      });
    });

    it('should throw an error for sad path', (done) => {
      chai.request(server)
      .get('/api/v1/itemssss')
      .end((error, response) => {
        response.error.should.have.status(404);
        response.error.text.should.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/v1/itemssss</pre>\n</body>\n</html>\n');
        done();
      });
    });
  });

  describe('POST route', () => {

    it('should add a new item to db', (done) => {
      chai.request(server)
      .post('/api/v1/items')
      .send({ item: 'bike', reason: 'it goes here', cleanliness: 'rancid' })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.body.length.should.equal(4);
        });
        done();
      });
    });

    it('should deny a post with missing data', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .post('/api/v1/items')
        .send({ id: 4, item: 'bike', reason: 'it goes here' })
        .end((error, response) => {
          chai.request(server)
          .get('/api/v1/items')
          .end((error, response) => {
            response.body.length.should.equal(3);
            done();
          });
        });
      });
    });
  });

  describe('PATCH route', () => {

    it('should update a current items cleanliness', (done) => {
      chai.request(server)
      .patch('/api/v1/items/2')
      .send({ cleanliness: 'rancid' })
      .end((request, response) => {
        response.should.have.status(201);
        chai.request(server)
        .get('/api/v1/items')
        .end((request, response) => {
          response.body[1].cleanliness.should.equal('rancid');
          done();
        });
      });
    });

    it('should deny patch if bad data is sent', (done) => {
      chai.request(server)
      .patch('/api/v1/items/2')
      .send({ reason: 'because' })
      .end((request, response) => {
        response.should.have.status(422);
        chai.request(server)
        .get('/api/v1/items')
        .end((request, response) => {
          response.body[1].reason.should.equal('it is summer.');
          done();
        });
      });
    });
  });

  describe('DELETE route', () => {

    it('should delete an item', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .delete('/api/v1/items/1')
        .end((error, response) => {
          response.status.should.equal(204);
          chai.request(server)
          .get('/api/v1/items')
          .end((error, response) => {
            response.body.length.should.equal(2);
            done();
          });
        });
      });
    });

    it('should throw an error if ID does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/items/45')
      .end((error, response) => {
        response.should.have.status(404);
        response.error.text.should.equal('item not found.');
        done();
      });
    });
  });
});
