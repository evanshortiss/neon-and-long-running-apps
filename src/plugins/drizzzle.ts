import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import getDatabase from '../db'

// Use declaration merging to add drizzle to fastify objects
declare module 'fastify' {
  interface FastifyRequest {
    drizzle: () => Promise<NodePgDatabase>
  }
}

export interface DrizzlePluginOptions {}

const drizzlePlugin: FastifyPluginAsync<DrizzlePluginOptions> = async (fastify, options) => {
  fastify.decorateRequest('drizzle', () => getDatabase())
}

export default fp(drizzlePlugin, '4.x')
