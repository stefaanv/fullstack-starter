/* eslint-disable @typescript-eslint/no-empty-function */
import { LogInterface } from './log.interface'

export class NullLoggerService implements LogInterface {
  set context(_value: string) {}
  log() {}
  error() {}
  urgent() {}
  warn() {}
  debug() {}
  verbose() {}
}
