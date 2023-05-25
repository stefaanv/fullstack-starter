export interface OptionalLogParameters {
  context?: string
  uuid?: string
  meta?: unknown
}

export interface LogInterface {
  context: string
  log(message: string, params?: OptionalLogParameters): void
  error(message: string, params?: OptionalLogParameters): void
  urgent(message: string, params?: OptionalLogParameters): void
  warn(message: string, params?: OptionalLogParameters): void
  debug(message: string, params?: OptionalLogParameters): void
  verbose(message: string, params?: OptionalLogParameters): void
}
