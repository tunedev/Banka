const transactions = [
  {
    id: 1,
    createdOn: new Date('13 march, 2019').toString(),
    transactionType: 'debit',
    accountNumber: 1212334342,
    cashierId: 2,
    amount: 3000.0,
    oldBalance: 9000.0,
    newBalance: 6000.0,
  },
  {
    id: 2,
    createdOn: new Date('15 march, 2019').toString(),
    transactionType: 'credit',
    accountNumber: 2984756340,
    cashierId: 1,
    amount: 3000.0,
    oldBalance: 9000.0,
    newBalance: 12000.0,
  },
  {
    id: 3,
    createdOn: new Date('19 march, 2019').toString(),
    transactionType: 'debit',
    accountNumber: 1212334342,
    cashierId: 2,
    amount: 2000.0,
    oldBalance: 6000.0,
    newBalance: 4000.0,
  },
  {
    id: 4,
    createdOn: new Date('22 march, 2019').toString(),
    transactionType: 'credit',
    accountNumber: 1212334342,
    cashierId: 2,
    amount: 5000.0,
    oldBalance: 4000.0,
    newBalance: 9000.0,
  },
];

export default transactions;
