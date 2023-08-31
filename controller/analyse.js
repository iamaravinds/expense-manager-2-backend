const TransactionHelper = require('../helper/transaction-helper');
class AnalyseController {
  constructor(fastify) {
    this.mongo = fastify.mongo;
    this.Transaction = fastify.mongo.db.collection('transaction');
    this.Analyse = fastify.mongo.db.collection('analyse');
    this.Client = fastify.mongo.db.collection('client');
  }

  async analyseMonthTransaction(request, reply) {
    try {
      const { clientId, startDate, endDate } = request.query;
      if (clientId && startDate && endDate) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const result = await this.Transaction.find({
            clientId,
            date: { $gte: startDate, $lte: endDate },
          }).toArray();
          return reply.code(200).send(result);
        }
        return reply.code(400).send({ message: 'Invalid client!!' });
      }
      return reply.code(400).send({ message: 'Client Id, startDate and endDate are mandatory' });
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
}
module.exports = AnalyseController;
