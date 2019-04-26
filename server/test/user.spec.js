import chai from 'chai';
import chaihttp from 'chai-http';
// local libraries
import app from '../server';

chai.use(chaihttp);
const { expect, request } = chai;

let adminToken;

describe('Hooks', () => {
  const endpoint = '/api/v1/auth/signin';
  it('should get token for admin user', async () => {
    const payload = {
      email: 'admin@banka.com',
      password: 'intuitively'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    adminToken = res.body.data.token;
  });
});

describe('Post /api/v1/auth/signup', () => {
  const endpoint = '/api/v1/auth/signup';

  it('should create a new client User', async () => {
    const payload = {
      password: 'passworded',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+2348100101054',
      email: 'jnnyTest@mail.com'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data.email).to.equal(payload.email);
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.type).to.equal('client');
  });

  it('should create a new staff User', async () => {
    const payload = {
      password: 'passworded',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+2348100101054',
      email: 'jnnyTestStaff@mail.com',
      isAdmin: false
    };

    const res = await request(app)
      .post(endpoint)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data.email).to.equal(payload.email);
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.type).to.equal('staff');
  });

  describe('# Edge cases', () => {
    it('should flag for missing field', async () => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'johndoe@mail.com'
      };

      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for invalid token', async () => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+2348100101054',
        email: 'jnnyTest@mail.com',
        isAdmin: false
      };

      const res = await request(app)
        .post(endpoint)
        .set({ Authorization: 'Bearer InvalidToken' })
        .send(payload);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should flag for wrong email format', async () => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'johndoemail.com'
      };

      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for duplicate mail', async () => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '08121212121',
        email: 'jnnyTest@mail.com'
      };

      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(409);
      expect(res.body).to.have.property('error');
    });

    it('should flag for qouted multiple space as an empty field', async () => {
      const payload = {
        password: 'passworded',
        firstName: '    ',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'example1@mail.com'
      };

      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for invalid phone number', async () => {
      const payload = {
        password: 'passworded',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '0988376',
        email: 'example1@mail.com'
      };

      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for password whose length is less than 6', async () => {
      const payload = {
        password: 'pas',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+23490988376',
        email: 'example1@mail.com'
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('Post /api/v1/auth/signin', () => {
  const endpoint = '/api/v1/auth/signin';

  it('should signin to account and get a token', async () => {
    const payload = {
      email: 'jnnyTest@mail.com',
      password: 'passworded'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data.email).to.equal(payload.email);
    expect(res.body.data).to.have.property('token');
  });

  describe('# Edge cases', () => {
    it('should flag for invalid credentials', async () => {
      const payload = {
        email: 'incorrect@mail.com',
        password: 'password'
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should flag for invalid credentials', async () => {
      const payload = {
        email: 'example1@mail.com',
        password: 'incorrectpass'
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should flag for empty required field', async () => {
      const payload = {
        password: 'password'
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for empty required field', async () => {
      const payload = {
        email: 'incorrect@mail.com'
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});
