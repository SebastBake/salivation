export type ErrMsg = Array<{ debugString: string; path?: string }>;
export type OkResult<T> = { ok: true; result: T };
export type ErrResult = { ok: false; err: ErrMsg };
export type Result<T> = OkResult<T> | ErrResult;

/**
 * Creates ok result
 * @param result
 */
export const ok = <T>(result: T): OkResult<T> => ({ ok: true, result });

/**
 * creates error result
 * @param err
 */
export const error = (err: ErrMsg): ErrResult => ({ ok: false, err });

/**
 * creates root error result
 * @param msg
 */
export const rootError = (msg: string): ErrResult => ({
  ok: false,
  err: [{ debugString: msg }],
});
