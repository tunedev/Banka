import chai from 'chai';
import chaihttp from 'chai-http';
// local libraries
import app from '../server';

chai.use(chaihttp);
const { expect, request } = chai;

let testAccountNumber;
let clientToken;
let staffAdminToken;
let staffCashierToken;

describe('Hooks', () => {
  const endpoint = '/api/v1/auth/signin';

  it('should get token for staff admin user', async () => {
    const payload = {
      email: 'staffadmin@banka.com',
      password: 'intuitively'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    staffAdminToken = res.body.data.token;
  });

  it('should get token for cashier staff user', async () => {
    const payload = {
      email: 'staffcashier@banka.com',
      password: 'intuitively'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    staffCashierToken = res.body.data.token;
  });

  it('should get token for client user', async () => {
    const payload = {
      email: 'clientmail@mail.com',
      password: 'intuitively'
    };

    const res = await request(app)
      .post(endpoint)
      .send(payload);

    expect(res).to.have.status(201);
    clientToken = res.body.data.token;
  });
});

describe('POST create new account', () => {
  const endpoint = '/api/v1/accounts';

  it('should create new account', async () => {
    const payload = {
      type: 'savings',
      id: 4
    };
    const res = await request(app)
      .post(endpoint)
      .set({ Authorization: `Bearer ${clientToken}` })
      .send(payload);

    expect(res.body.data).to.have.property('accountNumber');
    expect(res).to.have.status(201);
    testAccountNumber = res.body.data.accountNumber;
  });

  describe('# Edge cases', () => {
    it('should flag for missing token', async () => {
      const payload = {
        id: 1
      };
      const res = await request(app)
        .post(endpoint)
        .send(payload);
      expect(res.body).to.have.property('error');
      expect(res).to.have.status(401);
    });

    it('should flag for invalid token', async () => {
      const payload = {
        id: 1
      };
      const res = await request(app)
        .post(endpoint)
        .set({ Authorization: 'Bearer Icavalinsjnjei' })
        .send(payload);
      expect(res.body).to.have.property('error');
      expect(res).to.have.status(401);
    });

    it('should flag for missing required field', async () => {
      const payload = {
        id: 1
      };
      const res = await request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${clientToken}` })
        .send(payload);
      expect(res.body).to.have.property('error');
      expect(res).to.have.status(400);
    });

    it('should flag for wrong account type', async () => {
      const payload = {
        id: 1,
        type: 'keepings'
      };
      const res = await request(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${clientToken}` })
        .send(payload);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('get specific account', () => {
  it("should return specified accountNumber's details", async () => {
    const res = await request(app)
      .get('/api/v1/accounts')
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('data');
  });

  describe('# Edge cases', () => {
    it('should flag for wrong status value', async () => {
      const res = await request(app)
        .get('/api/v1/accounts?status=oimsnt')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for incorrect type', async () => {
      const res = await request(app)
        .get('/api/v1/accounts?status=1212113')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/accounts?status=1212113')
        .set({ Authorization: 'Bearer INcorecttoken' });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should flag for invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/accounts?status=1212113')
        .set({ Authorization: `Bearer ${staffCashierToken}` });

      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('get specific account', () => {
  it("should return specified accountNumber's details", async () => {
    const res = await request(app)
      .get(`/api/v1/accounts/${testAccountNumber}`)
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data.accountnumber).to.equal(testAccountNumber);
  });

  describe('# Edge cases', () => {
    it(`should flag that the specified
     account number does not exist`, async () => {
      const res = await request(app)
        .patch('/api/v1/accounts/1212121212')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it(`should flag that the specified account number
    that is longer than 10 digit`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/12121212121212121')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/wrongaccounttype/transactions')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/wrongaccounttype/transactions')
        .set({ Authorization: 'Bearer INvalidToken' });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/wrongaccounttype/transactions')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('PATCH account status toggle', () => {
  it(`should toggle specified 
  account number's from active to dormant`, async () => {
    const res = await request(app)
      .patch(`/api/v1/accounts/${testAccountNumber}`)
      .set({ Authorization: `Bearer ${staffAdminToken}` })
      .send({ status: 'dormant' });

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('dormant');
  });

  it('should return specified account with specified status', async () => {
    const res = await request(app)
      .get('/api/v1/accounts?status=dormant')
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data[0].status).to.equal('dormant');
  });

  it('should return empty array', async () => {
    const res = await request(app)
      .get('/api/v1/accounts?status=active')
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data.length).to.equal(0);
  });

  it(`should toggle the specified 
  account number's status from dormant to active`, async () => {
    const res = await request(app)
      .patch(`/api/v1/accounts/${testAccountNumber}`)
      .set({ Authorization: `Bearer ${staffAdminToken}` })
      .send({ status: 'active' });

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('active');
  });

  it('should return specified account with specified status', async () => {
    const res = await request(app)
      .get('/api/v1/accounts?status=active')
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data[0].status).to.equal('active');
  });

  it('should return empty array', async () => {
    const res = await request(app)
      .get('/api/v1/accounts?status=dormant')
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data.length).to.equal(0);
  });

  it(`should toggle specified account 
    number's from active to dormant`, async () => {
    const res = await request(app)
      .patch(`/api/v1/accounts/${testAccountNumber}`)
      .set({ Authorization: `Bearer ${staffAdminToken}` })
      .send({ status: 'dormant' });

    expect(res).to.have.status(200);
    expect(res.body.data.status).to.equal('dormant');
  });

  describe('# Edge cases', () => {
    it(`should toggle specified account 
    number's from active to dormant`, async () => {
      const res = await request(app)
        .patch(`/api/v1/accounts/${testAccountNumber}`)
        .set({ Authorization: `Bearer ${staffAdminToken}` })
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should flag that the specified
     account number does not exist`, async () => {
      const res = await request(app)
        .patch('/api/v1/accounts/1212121212')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it(`should flag that the specified
     account number that exceed 10 digit`, async () => {
      const res = await request(app)
        .patch('/api/v1/accounts/121212121212121212')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .patch('/api/v1/accounts/wrongaccounttype')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('Get /users/userEmail/accounts', () => {
  const endpoint = '/api/v1/users/clientmail@mail.com/accounts';

  it('should get all accounts belonging to specified user', async () => {
    const res = await request(app)
      .get(endpoint)
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('data');
  });

  describe('# Edge Cases', () => {
    it('should flag for non existing mail', async () => {
      const res = await request(app)
        .get('/api/v1/users/wrongmail/accounts')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('POST a credit transaction on an account', () => {
  it('should credit account', async () => {
    const payload = {
      id: 1,
      amount: 2000.0
    };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/credit`)
      .set({ Authorization: `Bearer ${staffCashierToken}` })
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data).to.have.property('transactionType');
  });

  describe('# Edge cases', () => {
    it('flag for a non existing account number', async () => {
      const payload = {
        id: 1,
        amount: 298.89
      };
      const res = await request(app)
        .post('/api/v1/accounts/1212334342/credit')
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('flag for a longer than 10 digit account number', async () => {
      const payload = {
        id: 1,
        amount: 298.89
      };
      const res = await request(app)
        .post('/api/v1/accounts/12123343478342/credit')
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for required input not given', async () => {
      const payload = { id: 1 };
      const res = await request(app)
        .post(`/api/v1/accounts/${testAccountNumber}/credit`)
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const payload = {
        id: 1,
        amount: 298.89
      };

      const res = await request(app)
        .post('/api/v1/accounts/wrongaccounttype/credit')
        .set({ Authorization: `Bearer ${staffCashierToken}` })
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
      amount: 2000.89
    };
    const res = await request(app)
      .post(`/api/v1/accounts/${testAccountNumber}/credit`)
      .set({ Authorization: `Bearer ${staffCashierToken}` })
      .send(payload);

    expect(res).to.have.status(201);
    expect(res.body.data).to.have.property('transactionType');
  });

  describe('# Edge cases', () => {
    it('should flag for a non existing account number', async () => {
      const payload = {
        id: 1,
        amount: 298.89
      };
      const res = await request(app)
        .post('/api/v1/accounts/1212334342/debit')
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should flag for insufficient funds', async () => {
      const payload = {
        id: 1,
        amount: 2988934.89
      };
      const res = await request(app)
        .post(`/api/v1/accounts/${testAccountNumber}/debit`)
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for required input not given', async () => {
      const payload = { id: 1 };
      const res = await request(app)
        .post(`/api/v1/accounts/${testAccountNumber}/debit`)
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that account 
    number is not a number type`, async () => {
      const payload = {
        id: 1,
        amount: 298.89
      };

      const res = await request(app)
        .post('/api/v1/accounts/wrongaccounttype/debit')
        .set({ Authorization: `Bearer ${staffCashierToken}` })
        .send(payload);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('Get all transactions made on an account', () => {
  it(`should get all transations carried 
  out on specified accountNumber`, async () => {
    const res = await request(app)
      .get(`/api/v1/accounts/${testAccountNumber}/transactions`)
      .set({ Authorization: `Bearer ${clientToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data[0].accountnumber).to.equal(testAccountNumber);
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number length', async () => {
      const res = await request(app)
        .get('/api/v1/accounts/121212121212121212/transactions')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/wrongaccounttype/transactions')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('GET specific transaction', () => {
  it('should get transaction first transaction', async () => {
    const id = 1;

    const res = await request(app)
      .get(`/api/v1/accounts/${testAccountNumber}/transactions/${id}`)
      .set({ Authorization: `Bearer ${clientToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data.id).to.equal(id);
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number', async () => {
      const res = await request(app)
        .get('/api/v1/accounts/12121212121212121212/transactions/1')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for non existing account number', async () => {
      const res = await request(app)
        .get('/api/v1/accounts/1212121212/transactions/1')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .get('/api/v1/accounts/wrongaccounttype/transactions/1')
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should flag for non existing transaction id', async () => {
      const id = 12;

      const res = await request(app)
        .get(`/api/v1/accounts/${testAccountNumber}/transactions/${id}`)
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('it should flag for wrong id type', async () => {
      const id = 'wrongType';

      const res = await request(app)
        .get(`/api/v1/accounts/${testAccountNumber}/transactions/${id}`)
        .set({ Authorization: `Bearer ${clientToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});

describe('DELETE an account', () => {
  it('should delete an account with specified account number', async () => {
    const res = await request(app)
      .delete(`/api/v1/accounts/${testAccountNumber}`)
      .set({ Authorization: `Bearer ${staffAdminToken}` });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
  });

  describe('# Edge cases', () => {
    it('should flag for wrong account number', async () => {
      const res = await request(app)
        .delete('/api/v1/accounts/12122212222321223')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should flag for wrong account number', async () => {
      const res = await request(app)
        .delete('/api/v1/accounts/121222122')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it(`should correctly tell that 
    account number is not a number type`, async () => {
      const res = await request(app)
        .delete('/api/v1/accounts/wrongaccounttype')
        .set({ Authorization: `Bearer ${staffAdminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});
