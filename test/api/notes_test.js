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
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('hello world');
      expect(res.body.Notes[0]).to.have.property('_id');
      id = api + '/' + res.body.Notes[0]._id;
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
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
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
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('hello world');
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
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('new note body');
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

  it('should reject creating a note with invalid words', function(done) {
    chai.request(server).
    post(api).
    send({noteBody: 'jap'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(500);
      done();
    });
  });
});
