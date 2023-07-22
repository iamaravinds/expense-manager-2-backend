// CommonJs
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const path = require('path');
const AutoLoad = require('@fastify/autoload');
const cors = require('@fastify/cors');
const fastify = require('fastify')({
  logger: true,
});
fastify.register(cors, {});
fastify.register(require('./db-connector'));
// fastify.register(require('./client'));
// fastify.register(require('./transaction'));
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
});

fastify.listen({ port: 3300, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
