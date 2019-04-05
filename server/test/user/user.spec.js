import expect from 'expect';
import request from 'supertest';

// local libraries
import app from '../../server';
import Users from '../../models/user.model';

describe('Post /api/v1/auth/signup', () => {
  const endpoint = '/api/v1/auth/signup';

  it('should create a new User', (done) => {
    const payload = {
      password: 'passworded',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+23490988376',
      email: 'johndoe@mail.com',
    };

    request(app)
      .post(endpoint)
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe(201);
        expect(res.body.data.email).toBe(payload.email);
        expect(res.body.data).toIncludeKey('token');
      })
      .end((err) => {
        if (err) {
          done(err);
        }

        expect(Users.find(user => user.email === payload.email).tokens.length).toBe(1);
        done();
      });
  });

  describe('# Edge cases', () => {
    it('should flag for missing field', (done) => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'johndoe@mail.com',
      };

      request(app)
        .post(endpoint)
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBeA('string');
        })
        .end(done);
    });

    it('should flag for wrong email format', (done) => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'johndoemail.com',
      };

      request(app)
        .post(endpoint)
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(
            'email should be a valid email type, please ammend as appropriate',
          );
        })
        .end(done);
    });

    it('should flag for duplicate mail', (done) => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'example1@mail.com',
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

    it('should flag for qouted multiple space', (done) => {
      const payload = {
        password: 'passworded',
        firstName: '    ',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'example1@mail.com',
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

    it('should flag for invalid phone number', (done) => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+90988376',
        email: 'example1@mail.com',
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

    it('should flag for password whose length is less than 6', (done) => {
      const payload = {
        password: 'pas',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'example1@mail.com',
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
