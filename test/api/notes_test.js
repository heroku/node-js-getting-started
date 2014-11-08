'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');

var server = 'http://localhost:' + (process.env.PORT || 3000);
var expect = chai.expect;
var api = '/api/notes';
var id;

require('../../index');
chai.use(chaihttp);

describe('Basic notes CRUD', function() {
  it('should be able to create a note', function(done) {
    chai.request(server).
    post(api).
    send({noteBody: 'hello world'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('noteBody');
      expect(res.body.noteBody).equals('hello world');
      expect(res.body).to.have.property('_id');
      id = api + '/' + res.body._id;
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000').
    get(api).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).equals(true);
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request(server).
    get(id).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('noteBody');
      expect(res.body.noteBody).equals('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request(server).
    put(id).
    send({noteBody: 'new note body'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('noteBody');
      expect(res.body.noteBody).equals('new note body');
      done();
    });
  });

  it('should be able to delete a note', function(done) {
    chai.request(server).
    delete(id).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      done();
    });
  });
});
