import chai from 'chai';
import chaihttp from 'chai-http';
// local libraries
import app from '../server';

chai.use(chaihttp);
const { expect, request } = chai;

let testAccountNumber;

describe('POST /api/v1/accounts', () => {
  const endpoint = '/api/v1/accounts';

  it('should create new account', async () => {
    const payload = {
      type: 'savings',
      id: 4,
    };
    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res.body.data).to.have.property('accountNumber');
    expect(res).to.have.status(201);
    testAccountNumber = res.body.data.accountNumber;
  });

  describe('# Edge cases', () => {
    it('should flag for missing required field', async () => {
      const payload = {
        id: 1,
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);
      expect(res.body).to.have.property('error');
      expect(res).to.have.status(400);
    });

    it('should flag for wrong id', async () => {
      const payload = {
        id: 829384,
        type: 'savings',
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should flag for wrong account type', async () => {
      const payload = {
        id: 1,
        type: 'keepings',
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('account status toggle', () => {
  it("should toggle specified account number's from active to dormant", async () => {
    const res = await request(app).patch(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('dormant');
  });

  it("should toggle the specified account number's status from dormant to active", async () => {
    const res = await request(app).patch(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('active');
  });

  it('should flag that the specified account number does not exist', async () => {
    const res = await request(app).patch('/api/v1/accounts/12121212123984738471481');

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
  });
});

describe('POST /api/v1/accounts/:accountNumber/credit', () => {
  it('should credit account', async () => {
    const payload = {
      id: 1,
      amount: 2000.0,
    };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/credit`)
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data).to.have.property('transactionType');
  });

  it('flag for a non existing account number', async () => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    const res = await request(app)
      .post('/api/v1/accounts/12123343421232/credit')
      .send(payload);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
  });

  it('should flag for required input not given', async () => {
    const payload = { id: 1 };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/credit`)
      .send(payload);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error');
  });
});

describe('POST /api/v1/accounts/:accountNumber/debit', () => {
  before(() => {
    const payload = {
      id: 1,
      amount: 2000.89,
    };
    request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/debit`)
      .send(payload);
  });
  it('should debit account', async () => {
    const payload = {
      id: 1,
      amount: 2000.89,
    };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/credit`)
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data).to.have.property('transactionType');
  });

  it('should flag for a non existing account number', async () => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    const res = await request(app)
      .post('/api/v1/accounts/12123343421232/debit')
      .send(payload);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
  });

  it('should flag for insufficient funds', async () => {
    const payload = {
      id: 1,
      amount: 2988934.89,
    };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/debit`)
      .send(payload);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error');
  });

  it('should flag for required input not given', async () => {
    const payload = { id: 1 };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/debit`)
      .send(payload);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error');
  });
});

describe('DELETE account route', () => {
  it('should delete an account with specified account number', async () => {
    const res = await request(app).delete(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
  });

  it('should flag for wrong account number', async () => {
    const res = await request(app).delete('/api/v1/accounts/12122212222321223');

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
  });
});
