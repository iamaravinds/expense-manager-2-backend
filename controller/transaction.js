const TransactionHelper = require('../helper/transaction-helper');
class TransactionController {
  constructor(fastify) {
    this.mongo = fastify.mongo;
    this.Transaction = fastify.mongo.db.collection('transaction');
    this.Client = fastify.mongo.db.collection('client');
  }
  async getAllTransaction(request, reply) {
    try {
      const { clientId } = request.query;
      if (clientId) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const result = await this.Transaction.find({
            clientId,
          }).toArray();
          reply.code(200).send(result);
        }
        reply.code(400).send({ message: 'Invalid client!!' });
      }
      reply.code(400).send({ message: 'Client Id is mandatory' });
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
}
module.exports = TransactionController;
