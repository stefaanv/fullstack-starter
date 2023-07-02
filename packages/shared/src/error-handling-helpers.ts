import { tryit as radashTryit, isPromise } from 'radash'

export function ensureError<E = Error>(error: unknown): E {
  if (error instanceof Error) return error as E
  if (['boolean', 'number', 'string'].includes(typeof error))
    return new Error((error as boolean | number | string).toString()) as E
  return new Error(JSON.stringify(error)) as E
}

export const tryit = <TArgs extends any[], TReturn, E = Error>(
  func: (...args: TArgs) => TReturn,
) => {
  return (
    ...args: TArgs
  ): TReturn extends Promise<any>
    ? Promise<[E, undefined] | [undefined, Awaited<TReturn>]>
    : [E, undefined] | [undefined, TReturn] => {
    try {
      const result = func(...args)
      if (isPromise(result)) {
        return result
          .then(value => [undefined, value])
          .catch(err => [ensureError(err), undefined]) as TReturn extends Promise<any>
          ? Promise<[E, undefined] | [undefined, Awaited<TReturn>]>
          : [E, undefined] | [undefined, TReturn]
      }
      return [undefined, result] as TReturn extends Promise<any>
        ? Promise<[E, undefined] | [undefined, Awaited<TReturn>]>
        : [E, undefined] | [undefined, TReturn]
    } catch (err) {
      return [err as E, undefined] as TReturn extends Promise<any>
        ? Promise<[E, undefined] | [undefined, Awaited<TReturn>]>
        : [E, undefined] | [undefined, TReturn]
    }
  }
}
