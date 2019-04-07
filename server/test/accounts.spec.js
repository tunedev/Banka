import expect from 'expect';
import request from 'supertest';

// local libraries
import app from '../server';

describe('POST /api/v1/accounts', () => {
  const endpoint = '/api/v1/accounts';

  it('should create new account', (done) => {
    const payload = {
      type: 'savings',
      id: 1,
    };
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toIncludeKey('accountNumber');
      })
      .end(done);
  });

  describe('# Edge cases', () => {
    it('should flag for missing required field', (done) => {
      const payload = {
        id: 1,
      };
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body).toIncludeKey('error');
        })
        .end(done);
    });

    it('should flag for wrong id', (done) => {
      const payload = {
        id: 829384,
        type: 'savings',
      };
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(404)
        .expect((res) => {
          expect(res.body).toIncludeKey('error');
        })
        .end(done);
    });

    it('should flag for wrong account type', (done) => {
      const payload = {
        id: 1,
        type: 'keepings',
      };
      request(app)
        .post(endpoint)
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body).toIncludeKey('error');
        })
        .end(done);
    });
  });
});
