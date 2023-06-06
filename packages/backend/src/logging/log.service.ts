import { ConsoleLogger } from '@nestjs/common'
import { LogInterface, OptionalLogParameters } from './log.interface'
import { white } from 'ansi-colors'

export class LogService implements LogInterface {
  private _context = 'unknown'
  private _nestLogger = new ConsoleLogger()

  set context(value: string) {
    this._context = value
    this._nestLogger.setContext(value)
  }

  format(message: string, params?: OptionalLogParameters) {
    const uuidPart = params?.uuid ? `(${params?.uuid})` : ''
    const metaPart = params?.meta ? white('metadata: ' + JSON.stringify(params?.meta)) : ''
    const allDefined = [uuidPart, message, metaPart].filter(s => s !== undefined)
    return allDefined.join(' ')
  }

  info(message: string, params?: OptionalLogParameters) {
    this._nestLogger.log(this.format(message, params), params?.context ?? this._context)
  }

  error(message: string, params?: OptionalLogParameters) {
    this._nestLogger.error(this.format(message, params), params?.context ?? this._context)
  }

  urgent(message: string, params?: OptionalLogParameters) {
    this._nestLogger.error(this.format(message, params), params?.context ?? this._context)
  }

  warn(message: string, params?: OptionalLogParameters) {
    this._nestLogger.warn(this.format(message, params), params?.context ?? this._context)
  }

  debug(message: string, params?: OptionalLogParameters) {
    this._nestLogger.debug(this.format(message, params), params?.context ?? this._context)
  }

  verbose(message: string, params?: OptionalLogParameters) {
    this._nestLogger.verbose(this.format(message, params), params?.context ?? this._context)
  }
}
