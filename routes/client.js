/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('client');
  fastify.get('/client', async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      reply.code(404).send({ message: 'No Documents Found' });
    }
    return result;
  });

  fastify.get('/client/:clientId', async (request, reply) => {
    const result = await collection.findOne({
      _id: request.params.clientId,
    });
    if (!result) {
      reply.code(404).send({ message: 'No Documents Found' });
    }
    return result;
  });

  fastify.post('/client', async (request, reply) => {
    const result = await collection.insertOne(request.body.client);
    return result;
  });
}

module.exports = routes;
