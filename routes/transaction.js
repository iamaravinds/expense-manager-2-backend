const TransactionController = require('../controller/transaction');

async function routes(fastify, options) {
  const transactionController = new TransactionController(fastify);
  fastify.get('/transaction', async (request, reply) => {
    return transactionController.getAllTransaction(request, reply);
  });

  fastify.get('/transaction/:transactionId', async (request, reply) => {
    const result = await collection.findOne({
      animal: request.params.transactionId,
    });
    if (!result) {
      reply.code(404).send({ message: 'No Document Found' });
    }
    return result;
  });

  fastify.post('/transaction', async (request, reply) => {
    return transactionController.createTransaction(request, reply);
  });
}

module.exports = routes;
