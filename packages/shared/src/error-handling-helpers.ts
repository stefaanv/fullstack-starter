export function ensureError<E = Error>(error: unknown): E {
  if (error instanceof Error) return error as E
  if (['boolean', 'number', 'string'].includes(typeof error))
    return new Error((error as boolean | number | string).toString()) as E
  return new Error(JSON.stringify(error)) as E
}

//! use radash for error handling !
