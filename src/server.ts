import fastify from 'fastify'
import { eq } from 'drizzle-orm';
import { Elements } from './db/schema';
import { FastifyViewOptions } from '@fastify/view';
import { FASTIFY_LOG_ENABLED } from './config'
import view from '@fastify/view'
import drizzle from './plugins/drizzzle'
const server = fastify({
  logger: FASTIFY_LOG_ENABLED
})

// Required to handle incoming HTMX delete requests
server.register(require('@fastify/formbody'))

// Register the custom drizzle fastify plugin
server.register(drizzle)

// Register HTML rendering that uses handlebars
server.register(view, {
  engine: {
    handlebars: require('handlebars'),
  },
  root: process.cwd(),
} as FastifyViewOptions);

server.get('/', async (req, reply) => {
  const db = await req.drizzle()
  const elements = await db.select().from(Elements)

  return reply.view('/views/index', { elements: elements });
});

server.delete<{ Params: { number: string } }>('/elements/:number', async (req, reply) => {
  const db = await req.drizzle()

  await db.delete(Elements).where(eq(Elements.atomicNumber, parseInt(req.params.number)))

  const elements = await db.select().from(Elements)

  return reply.view('/views/index', { elements: elements });
});

export { server }
