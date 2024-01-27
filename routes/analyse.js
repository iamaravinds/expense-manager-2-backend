const AnalyseController = require('../controller/analyse');

async function routes(fastify, options) {
  const analyseController = new AnalyseController(fastify);
  fastify.get('/analyse', async (request, reply) => {
    return analyseController.analyseMonthTransaction(request, reply);
  });
  fastify.get('/analyse/category', async (request, reply) => {
    return analyseController.analyseCategoryWiseMonthTransactions(request, reply);
  });
}

module.exports = routes;
