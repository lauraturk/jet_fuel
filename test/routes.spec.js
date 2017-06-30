process.env.NODE_ENV = 'test';

var knex = require('../db/knex')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);

describe('Client Routes', function() {
  it('should return the homepage with text', (done) => {
      chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
    });

    it('should return a 404 for a route that does not exist', (done) => {
      chai.request(server)
      .get('/sad')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
});

describe('API Routes', () => {

  beforeEach(done => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done());
  });

  describe('GET /api/v1/folders for getting ALL folders', () =>{
    it('should return an array of folders.', (done) =>{
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('folder_name');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        done();
      })
    })

    it('should return a folder based on an id using /api/v1/folders/:id', (done) =>{
      chai.request(server)
      .get('/api/v1/folders/2')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(2);
        response.body[0].should.have.property('folder_name')
        response.body[0].folder_name.should.equal('email');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        done();
      })
    })

    it('should return a 404 if nothing found using /api/v1/folders/:id', (done) =>{
      chai.request(server)
      .get('/api/v1/folders/28')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        done();
      })
    })
  })

  describe('GET /api/v1/urls for getting ALL urls', () => {
    it('should return an array of URL', (done) =>{
      chai.request(server)
      .get('/api/v1/urls')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(4);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('original_url');
        response.body[0].should.have.property('shortened_url');
        response.body[0].should.have.property('folder_id');
        response.body[0].should.have.property('title');
        response.body[0].should.have.property('popularity');
        done();
      })
    })

    it('should return an array of URLs based on Folder ID', (done) =>{
      chai.request(server)
      .get('/api/v1/folders/2/urls')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].id.should.equal(4);
        response.body[0].original_url.should.equal('http://www.gmail.com');
        response.body[0].shortened_url.should.equal('Bd');
        response.body[0].folder_id.should.equal(2);
        response.body[0].title.should.equal('Gmail');
        done();
      })
    })

    it('should return a 404 if a folder is not found /api/v1/folders/:id/urls', (done) =>{
      chai.request(server)
      .get('/api/v1/folders/0/urls')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        done();
      })
    })

    it('should return a URL based on the URL id with /api/v1/urls/:id', (done) =>{
      chai.request(server)
      .get('/api/v1/urls/4/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.id.should.equal(4);
        response.body.original_url.should.equal('http://www.gmail.com');
        response.body.shortened_url.should.equal('Bd');
        response.body.folder_id.should.equal(2);
        response.body.title.should.equal('Gmail');
        done();
      })
    })

    it('should return a 404 a specific url is found /api/v1/urls/:id', (done) =>{
      chai.request(server)
      .get('/api/v1/urls/0')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        done();
      })
    })
  })
});
