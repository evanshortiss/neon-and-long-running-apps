import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool, Client } from "pg";
import { log } from '../log'
import { DATABASE_URL as connectionString, PG_POOL_ENABLED, PG_POOL_MAX_CONNS } from '../config'

let db: Promise<NodePgDatabase>|undefined

export default async function getDatabase () {
  // Return an existing instance if available
  if (db) return db

  if (PG_POOL_ENABLED) {
    log.info('establishing database connection via pg.Pool')
    const pool = new Pool({
      connectionString,
      
      // Close any db connection that is idle for more than this number of
      // milliseconds. If this number is less than the Neon auto-suspend value
      // then no error will be logged when Neon auto-suspend kicks in, since
      // the pool will have already removed idle database connections
      idleTimeoutMillis: 30 * 1000,
      
      // Maximum number of connections the pool will have open at any given time.
      // Refer to Neon docs for guidance: https://neon.tech/docs/connect/connection-pooling#default-connection-limits
      max: PG_POOL_MAX_CONNS
    })
    
    pool.on('error', (e) => {
      log.error('pg:pool error:', e.stack)

      // Force the pool to be recreated for future queries after this error
      db = undefined

      pool.end().catch((e) => {
        log.error('pg:pool error running pool.end()')
        log.error(e)
      })
    })
    pool.on('connect', () => log.debug(`pg:pool established a connection. open connection count is: ${pool.totalCount}`))
    pool.on('acquire', () => log.trace(`pg:pool acquierd a client to execute a query. waiting count: ${pool.waitingCount}`))
    pool.on('release', () => log.trace(`pg:pool released a client for fututre queries. waiting count: ${pool.waitingCount}`))
    pool.on('remove', () =>  log.debug(`pg:pool removed a connection. open connection count is: ${pool.totalCount}`))

    db = Promise.resolve(drizzle(pool));
  } else {
    /**
     * We need to immediately wrap this code in a promise so requests arriving
     * at the same time will end up using the same client, instead of opening
     * too many instances of pg.Client.
     */
    db = new Promise(async (resolve, reject) => {
      /**
       * This un-pooled flow reuses the same connection for each query. This
       * could result in a performance bottleneck if you're not sclaing your
       * Node.js application across many lambdas or processes
       */
      log.info('establishing database connection via pg.Client')
      const client = new Client({ connectionString })
    
      try {
        // This callback is triggered when Neon auto-suspend kicks in, since pg
        // sees that the connection to the database was lost. Log the error, and
        // cleanup the client, and unassign the db variable to force a subsequent
        // query to re-open a connection to your Neon Postgres database.
        client.once('error', (e) => {
          log.error('pg:client error:')
          log.error(e)
    
          // Force a new client to be recreated for future queries after this error
          db = undefined
    
          client.end().catch((e) => {
            log.error('pg:client error running client.end()')
            log.error(e)
          })
        })

        await client.connect()
    
        db = Promise.resolve(drizzle(client))
  
        resolve(db)
      } catch (e) {
        reject(e)
      }
    })
  }

  return db
}  
