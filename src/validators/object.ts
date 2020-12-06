import { ErrMsg, error, ok, Result, rootError } from "../result";
import { JsonObj } from "../utils";
import { createValidator, Validator } from "../validator";

type PickPartial<T extends JsonObj, REQUIRED extends keyof T> = Pick<T, REQUIRED> &
  Partial<Omit<T, REQUIRED>>;

/**
 * Creates a validator for an object
 * @param properties
 */
export const object = <T extends JsonObj, REQUIRED extends keyof T>(
  properties: {
    [key in keyof T]: Validator<T[key]>;
  },
  required: Array<REQUIRED> = [...Object.keys(properties)] as Array<REQUIRED>
) =>
  createValidator<PickPartial<T, REQUIRED>>({
    validate(validateMe) {
      if (typeof validateMe !== "object") {
        return rootError(`must be an object but found ${typeof validateMe}`);
      }

      const err: ErrMsg = [];
      const obj: any = {};

      for (const [key, val] of Object.entries(properties)) {
        if (!required.includes(key as any) && validateMe[key] === undefined) {
          continue;
        }

        const result: Result<any> = val.validate(validateMe[key]);
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
