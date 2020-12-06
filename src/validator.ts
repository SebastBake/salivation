import { ok, Result } from "./result";
import { Json } from "./utils";

/**
 * A function which validates
 */
type Checker<T extends Json> = (validateMe: any) => Result<T>;

/**
 *
 */
type Validated<T extends Validator<any>> = T extends Validator<infer U> ? U : never;

/**
 *
 */
type Validator<T extends Json> = {
  /**
   * Checks @param validateMe against the validator, throws any errors as as exceptions
   * @param validateMe
   */
  throwIfInvalid(validateMe: any): T;

  /**
   * Validates some json
   */
  validate: Checker<T>;

  /**
   *
   * @param mapper
   */
  withRecovery(mapper: (item: any) => any): Validator<T>;

  /**
   *
   * @param mapper
   */
  map<U extends Json>(mapper: (item: T) => U): Validator<U>;
};

/**
 * Creates a validator
 * @param args
 */
const createValidator = <T extends Json>(args: { validate: Checker<T> }): Validator<T> => ({
  validate: args.validate,

  throwIfInvalid(validateMe: any): T {
    const validated = args.validate(validateMe);
    if (validated.ok) {
      return validated.result;
    } else {
      const errMsg = JSON.stringify(validated.err, undefined, 2);
      throw Error(errMsg);
    }
  },

  withRecovery(mapper: (arg: any) => any): Validator<T> {
    return createValidator<T>({
      validate(validateMe) {
        const validated = args.validate(validateMe);
        if (validated.ok) {
          return validated;
        }
        return args.validate(mapper(validateMe));
      },
    });
  },

  map<U extends Json>(mapper: (arg: T) => U): Validator<U> {
    return createValidator<U>({
      validate(validateMe) {
        const validated = args.validate(validateMe);
        if (validated.ok) {
          return ok(mapper(validated.result));
        }
        return validated;
      },
    });
  },
});

export { Validated, Validator, createValidator };
