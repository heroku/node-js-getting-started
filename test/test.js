const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-http'))

describe('Node app', function () {
  const server = require('../index')

  it('responds to / with 200', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
  })

  it('responds to / with body including "<h1>Getting Started with Node on Heroku</h1>"', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.text).to.include('<h1>Getting Started with Node on Heroku</h1>')
        done()
      })
  })

  it('responds to /foo/bar with 404 status and error', function (done) {
    chai.request(server)
      .get('/foo/bar')
      .end(function (err, res) {
        expect(err).to.be.not.null
        expect(res).to.have.status(404)
        done();
      })
  })
})
