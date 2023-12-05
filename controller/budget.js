const TransactionHelper = require('../helper/transaction-helper');
const Analyse = require('../lib/analyse')
class BudgetController {
  constructor(fastify) {
    this.mongo = fastify.mongo;
    this.Budget = fastify.mongo.db.collection('budget');
    this.Client = fastify.mongo.db.collection('client');
  }

  async createBudget(request, reply) {
    try {
      const data = request.body;
      console.log(data)
      const { budget, date, clientId } = data;
      if (clientId) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          await this.Budget.insertOne({
            clientId,
            budget,
            date: new Date(date),
          });
          return reply.code(201).send(budget);
        }
        return reply.code(400).send({message: 'Invalid client!!'});
      }
      return reply.code(400).send({message: 'Client Id, startDate and endDate are mandatory'});
    } catch (error) {
      console.log('error', error);
      return reply.code(500).send(error);
    }
  }

  async getBudget(request, reply) {
    try {
      const { date, clientId } = request.query;
      if (clientId) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const budget = await this.Budget.findOne({
            clientId,
            date: new Date(date),
          });
          return reply.code(200).send(budget);
        }
        return reply.code(400).send({message: 'Invalid client!!'});
      }
      return reply.code(400).send({message: 'Client Id, startDate and endDate are mandatory'});
    } catch (error) {
      console.log('error', error);
      return reply.code(500).send(error);
    }
  }
}
module.exports = BudgetController;
