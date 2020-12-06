import { ErrMsg, error, ok, Result, rootError } from "../result";
import { Json } from "../utils";
import { createValidator, Validator } from "../validator";

/**
 * Validates a dictionary
 * @param validator
 */
export const dict = <T extends Json>(validator: Validator<{ [key: string]: T }>) =>
  createValidator<T>({
    validate(validateMe) {
      if (typeof validateMe !== "object") {
        return rootError(`must be an object but found ${typeof validateMe}`);
      }

      const err: ErrMsg = [];
      const obj: any = {};

      for (const [key, val] of Object.entries(validateMe)) {
        const result: Result<any> = validator.validate(val);
        if (!result.ok) {
          const resultErr = result.err.map((item) => ({
            ...item,
            path: key + (item.path ? "." + item.path : ""),
          }));
          err.push(...resultErr);
        } else {
          obj[key] = result.result;
        }
      }

      return err.length ? error(err) : ok(obj);
    },
  });
