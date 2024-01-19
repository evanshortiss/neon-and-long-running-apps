import pino from "pino";
import { LOG_LEVEL } from "./config";

export const log = pino({
  level: LOG_LEVEL,
});
