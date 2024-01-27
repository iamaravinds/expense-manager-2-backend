const TransactionHelper = require('../helper/transaction-helper');
const Analyse = require('../lib/analyse')
class AnalyseController {
  constructor(fastify) {
    this.mongo = fastify.mongo;
    this.Transaction = fastify.mongo.db.collection('transaction');
    this.Analyse = fastify.mongo.db.collection('analyse');
    this.Client = fastify.mongo.db.collection('client');
  }

  async analyseMonthTransaction(request, reply) {
    try {
      const {clientId, startDate, endDate} = request.query;
      if (clientId && startDate && endDate) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const result = await this.Transaction.find({
            clientId,
            date: {$gte: new Date(startDate), $lte: new Date(endDate)},
          }).toArray();

          const analyseData = new Analyse(result);
          const analysedData = analyseData.getCategoryWiseAnalysis();
          return reply.code(200).send(analysedData);
        }
        return reply.code(400).send({message: 'Invalid client!!'});
      }
      return reply.code(400).send({message: 'Client Id, startDate and endDate are mandatory'});
    } catch (error) {
      console.log('error', error);
    }
  }

  async analyseCategoryWiseMonthTransactions(request, reply) {
    try {
      const {clientId, startDate, endDate, category} = request.query;
      if (clientId && startDate && endDate && category) {
        const dbClientData = await this.Client.findOne({
          _id: new this.mongo.ObjectId(clientId),
        });
        if (dbClientData) {
          const result = await this.Transaction.find({
            clientId,
            date: {$gte: new Date(startDate), $lte: new Date(endDate)},
            category,
          }).toArray();
          return reply.code(200).send(result);
        }
        return reply.code(400).send({message: 'Invalid client!!'});
      }
      return reply.code(400).send({message: 'Client Id, startDate and endDate are mandatory'});
    } catch (error) {
      console.log('error', error);
    }
  }
}
module.exports = AnalyseController;
