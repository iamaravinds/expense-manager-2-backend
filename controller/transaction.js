const TransactionHelper = require('../helper/transaction-helper');
const { pastTransactions } = require('../constants/pastTransactions');
class TransactionController {
  constructor(fastify) {
    this.mongo = fastify.mongo;
    this.Transaction = fastify.mongo.db.collection('transaction');
    this.Client = fastify.mongo.db.collection('client');
  }
  async getAllTransaction(request, reply) {
    try {
      const { clientId, from, to } = request.query;
      if (clientId) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const condition = {
            clientId,
          }
          if (from || to) {
            condition.date = {};
            if (from) {
              condition.date['$gte'] = new Date(from);
            }
            if (to) {
              condition.date['$lte'] = new Date(to);
            }
          }
          const result = await this.Transaction.find(condition).sort({date: -1}).toArray();
          return reply.code(200).send(result);
        }
        return reply.code(400).send({ message: 'Invalid client!!' });
      }
      return reply.code(400).send({ message: 'Client Id is mandatory' });
    } catch (error) {
      console.log('error', error);
    }
  }
  async createTransaction(request, reply) {
    try {
      const { data } = request.body;
      const dbClientData = await this.Client.findOne({
        _id: new this.mongo.ObjectId(data.clientId),
      });
      if (dbClientData) {
        const statementArray = TransactionHelper.constructHDFCStatement(
          data.transactions
        );
        const result = await this.Transaction.insertMany(statementArray);
        reply.code(200).send(result);
      }
      reply.code(400).send({ message: 'Invalid client!!' });
    } catch (error) {
      throw error;
    }
  }

  async updateTransactionCategory(request, reply) {
    try {
      const { data } = request.body;
      const { transactionId } = request.params;
      const dbClientData = await this.Client.findOne({
        _id: new this.mongo.ObjectId(data.clientId),
      });
      if (dbClientData) {
        const filter = {
          _id: new this.mongo.ObjectId(transactionId),
          clientId: data.clientId,
        };
        const update = { $set: { category : data.category } };
        await this.Transaction.updateOne(filter, update);
        return reply.send(201);
      }
      return reply.code(400).send({ message: 'Invalid client!!' });
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async dumpData(request, reply) {
    try {
      // await this.Transaction.insertMany(pastTransactions);
      return reply.send(201);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
module.exports = TransactionController;
