const BudgetController = require('../controller/budget');

async function routes(fastify, options) {
  const budgetController = new BudgetController(fastify);
  fastify.post('/budget/create', async (request, reply) => {
    return budgetController.createBudget(request, reply);
  });
  fastify.get('/budget', async (request, reply) => {
    return budgetController.getBudget(request, reply);
  });
}

module.exports = routes;
