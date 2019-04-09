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

describe('account status toggle', () => {
  it("should toggle specified account number's from active to dormant", (done) => {
    request(app)
      .patch('/api/v1/accounts/2984756340')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toEqual('dormant');
      })
      .end(done);
  });

  it("should toggle the specified account number's status from dormant to active", (done) => {
    request(app)
      .patch('/api/v1/accounts/1212334342')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toEqual('active');
      })
      .end(done);
  });

  it('should flag that the specified account number does not exist', (done) => {
    request(app)
      .patch('/api/v1/accounts/12121212123984738471481')
      .expect(404)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });
});

describe('DELETE account route', () => {
  it('should delete an account with specified account number', (done) => {
    request(app)
      .delete('/api/v1/accounts/1212334342')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('Account successfully deleted');
      })
      .end(done);
  });

  it('should flag for wrong account number', (done) => {
    request(app)
      .delete('/api/v1/accounts/12122212222321223')
      .expect(404)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });
});

describe('POST /api/v1/accounts/:accountNumber/debit', () => {
  it('should debit account', (done) => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    request(app)
      .post('/api/v1/accounts/1212334342/debit')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toIncludeKey('transactionType');
        expect(res.body.data.transactionType).toEqual('debit');
      })
      .end(done);
  });

  it('should flag for a non existing account number', (done) => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    request(app)
      .post('/api/v1/accounts/12123343421232/debit')
      .send(payload)
      .expect(404)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });

  it('should flag for insufficient funds', (done) => {
    const payload = {
      id: 1,
      amount: 2988934.89,
    };
    request(app)
      .post('/api/v1/accounts/1212334342/debit')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });

  it('should flag for required input not given', (done) => {
    const payload = { id: 1 };
    request(app)
      .post('/api/v1/accounts/1212334342/credit')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });
});

describe('POST /api/v1/accounts/:accountNumber/credit', () => {
  it('should credit account', (done) => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    request(app)
      .post('/api/v1/accounts/1212334342/credit')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toIncludeKey('transactionType');
        expect(res.body.data.transactionType).toEqual('credit');
      })
      .end(done);
  });

  it('flag for a non existing account number', (done) => {
    const payload = {
      id: 1,
      amount: 298.89,
    };
    request(app)
      .post('/api/v1/accounts/12123343421232/credit')
      .send(payload)
      .expect(404)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });

  it('should flag for required input not given', (done) => {
    const payload = { id: 1 };
    request(app)
      .post('/api/v1/accounts/1212334342/credit')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toIncludeKey('error');
      })
      .end(done);
  });
});
