import chai from 'chai';
import chaihttp from 'chai-http';
// local libraries
import app from '../server';

chai.use(chaihttp);
const { expect, request } = chai;

let testAccountNumber;

describe('POST create new account', () => {
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

describe('get all account', () => {
  it("should return specified accountNumber's details", async () => {
    const res = await request(app).get('/api/v1/accounts');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('data');
  });

  describe('# Edge cases', () => {
    it('should flag for wrong status value', async () => {
      const res = await request(app).get('/api/v1/accounts?status=oimsnt');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for incorrect type', async () => {
      const res = await request(app).get('/api/v1/accounts?status=1212113');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('get specific account', () => {
  it("should return specified accountNumber's details", async () => {
    const res = await request(app).get(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.accountnumber).to.equal(testAccountNumber);
  });

  describe('# Edge cases', () => {
    it('should flag that the specified account number does not exist', async () => {
      const res = await request(app).get('/api/v1/accounts/12121212121212121');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should correctly tell that account number is not a number type', async () => {
      const res = await request(app).get('/api/v1/accounts/wrongaccounttype/transactions');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('PATCH account status toggle', () => {
  it("should toggle specified account number's from active to dormant", async () => {
    const res = await request(app).patch(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('dormant');
  });

  it('should return specified account with specified status', async () => {
    const res = await request(app).get('/api/v1/accounts?status=dormant');

    expect(res).to.have.status(200);
    expect(res.body.data[0].status).to.equal('dormant');
  });

  it('should return empty array', async () => {
    const res = await request(app).get('/api/v1/accounts?status=active');

    expect(res).to.have.status(200);
    expect(res.body.data.length).to.equal(0);
  });

  it("should toggle the specified account number's status from dormant to active", async () => {
    const res = await request(app).patch(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('active');
  });

  it('should return specified account with specified status', async () => {
    const res = await request(app).get('/api/v1/accounts?status=active');

    expect(res).to.have.status(200);
    expect(res.body.data[0].status).to.equal('active');
  });

  it('should return empty array', async () => {
    const res = await request(app).get('/api/v1/accounts?status=dormant');

    expect(res).to.have.status(200);
    expect(res.body.data.length).to.equal(0);
  });

  it("should toggle specified account number's from active to dormant", async () => {
    const res = await request(app).patch(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('dormant');
  });

  describe('# Edge cases', () => {
    it('should flag that the specified account number does not exist', async () => {
      const res = await request(app).patch('/api/v1/accounts/12121212121212121');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should correctly tell that account number is not a number type', async () => {
      const res = await request(app).patch('/api/v1/accounts/wrongaccounttype');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('POST a credit transaction on an account', () => {
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

  describe('# Edge cases', () => {
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

    it('should correctly tell that account number is not a number type', async () => {
      const payload = {
        id: 1,
        amount: 298.89,
      };

      const res = await request(app)
        .post('/api/v1/accounts/wrongaccounttype/credit')
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('POST a debit transaction on an account', () => {
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

  describe('# Edge cases', () => {
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

    it('should correctly tell that account number is not a number type', async () => {
      const payload = {
        id: 1,
        amount: 298.89,
      };

      const res = await request(app)
        .post('/api/v1/accounts/wrongaccounttype/debit')
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('Get all transactions made on an account', () => {
  it('should get all transations carried out on specified accountNumber', async () => {
    const res = await request(app).get(`/api/v1/accounts/${testAccountNumber}/transactions`);

    expect(res).to.have.status(200);
    expect(res.body.data[0].accountnumber).to.equal(testAccountNumber);
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number', async () => {
      const res = await request(app).get('/api/v1/accounts/12121212121212121212/transactions');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should correctly tell that account number is not a number type', async () => {
      const res = await request(app).get('/api/v1/accounts/wrongaccounttype/transactions');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('GET specific transaction', () => {
  it('should get transaction first transaction', async () => {
    const id = 1;

    const res = await request(app).get(`/api/v1/accounts/${testAccountNumber}/transactions/${id}`);

    expect(res).to.have.status(200);
    expect(res.body.data.id).to.equal(id);
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number', async () => {
      const res = await request(app).get('/api/v1/accounts/12121212121212121212/transactions/1');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should correctly tell that account number is not a number type', async () => {
      const res = await request(app).get('/api/v1/accounts/wrongaccounttype/transactions/1');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should flag for non existing transaction id', async () => {
      const id = 12;

      const res = await request(app).get(
        `/api/v1/accounts/${testAccountNumber}/transactions/${id}`,
      );

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('it should flag for wrong id type', async () => {
      const id = 'wrongType';

      const res = await request(app).get(
        `/api/v1/accounts/${testAccountNumber}/transactions/${id}`,
      );

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('DELETE an account', () => {
  it('should delete an account with specified account number', async () => {
    const res = await request(app).delete(`/api/v1/accounts/${testAccountNumber}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number', async () => {
      const res = await request(app).delete('/api/v1/accounts/12122212222321223');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should correctly tell that account number is not a number type', async () => {
      const res = await request(app).delete('/api/v1/accounts/wrongaccounttype');

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});
