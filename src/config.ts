import { get } from 'env-var'
import pino from 'pino'

export const HTTP_PORT = get('HTTP_PORT').default(8080).asPortNumber()
export const HTTP_HOST = get('HTTP_HOST').default('0.0.0.0').asString()
export const DATABASE_URL = get('DATABASE_URL').required().asUrlString()
export const LOG_LEVEL = get('LOG_LEVEL').default('info').asEnum(Object.values(pino.levels.labels))
export const FASTIFY_LOG_ENABLED = get('FASTIFY_LOG_ENABLED').default('false').asBool()
export const PG_POOL_ENABLED = get('PG_POOL_ENABLED').default('true').asBool()
export const PG_POOL_MAX_CONNS = get('PG_POOL_MAX_CONNS').default('5').asIntPositive()
