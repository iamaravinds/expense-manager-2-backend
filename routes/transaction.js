const TransactionController = require('../controller/transaction');

async function routes(fastify, options) {
  const transactionController = new TransactionController(fastify);
  fastify.get('/transaction', async (request, reply) => {
    return transactionController.getAllTransaction(request, reply);
  });

  fastify.post('/transaction', async (request, reply) => {
    return transactionController.createTransaction(request, reply);
  });

  fastify.put('/transaction/:transactionId/category', async (request, reply) => {
    return transactionController.updateTransactionCategory(request, reply);
  });

  fastify.post('/transaction/dump', async (request, reply) => {
    return transactionController.dumpData(request, reply);
  });
}

module.exports = routes;
