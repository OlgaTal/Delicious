const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const mongoose = require('mongoose');

describe('bookmarks', () => {
  beforeEach((done) => {
    // mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.collections.bookmarks.drop(() => {
      done();
    });
  });

  describe('post /bookmarks', () => {
    it('should create a bookmark', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'd',
              isProtected: true, datePublished: '2016-01-05',
              stars: 3, tags:[ 'test', 'mock', 'baloney'] })
      .end((err, resp) => {
        expect(err).to.be.null;
        expect(resp.status).to.equal(200);
        expect(resp.body.bookmark.__v).to.not.be.null;
        expect(resp.body.bookmark._id).to.not.be.null;
        expect(resp.body.bookmark.url).to.equal('b');
        done();
      });
    });

    it('should NOT create a bookmark - missing title', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ url: 'b', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"title" is required']);
        done();
      });
    });

    it('should NOT create a bookmark -  date too old', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'c',
              isProtected: true, datePublished: '1816-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"datePublished" must be larger than or equal to "Sat Dec 31 1994 18:00:00 GMT-0600 (CST)"']);
        done();
      });
    });

    it('should NOT create a bookmark -  url is required', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"url" is required']);
        done();
      });
    });

    it('should NOT create a bookmark -  stars are out of range (between 1 and 5)', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 0, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"stars" must be larger than or equal to 1']);
        done();
      });
    });

    it('should NOT create a bookmark -  tags is an array', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: 'd' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"tags" must be an array']);
        done();
      });
    });

    it('should NOT create a bookmark -  tags is an empty array', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: [] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"tags" must contain at least 1 items']);
        done();
      });
    });

    it('should NOT create a bookmark -  tags is an array of strings', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'b', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: [1, 2, 3] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"0" must be a string']);
        done();
      });
    });

  });
});
