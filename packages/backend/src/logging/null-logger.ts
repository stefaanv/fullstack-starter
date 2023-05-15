/* eslint-disable @typescript-eslint/no-empty-function */
import { LoggerInterface } from './logger.interface'

export class NullLogger implements LoggerInterface {
  set context(_value: string) {}
  log() {}
  error() {}
  urgent() {}
  warn() {}
  debug() {}
  verbose() {}
}
