import { server } from "./server";
import { log } from './log'
import { HTTP_HOST, HTTP_PORT } from './config'

server.listen({
  host: HTTP_HOST,
  port: HTTP_PORT
}).then(() => log.info(`listening on http://${HTTP_HOST}:${HTTP_PORT}`))


