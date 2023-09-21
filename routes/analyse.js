const AnalyseController = require('../controller/analyse');

async function routes(fastify, options) {
  const analyseController = new AnalyseController(fastify);
  fastify.get('/analyse', async (request, reply) => {
    return analyseController.analyseMonthTransaction(request, reply);
  });
}

module.exports = routes;
