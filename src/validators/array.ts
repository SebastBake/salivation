import { ErrMsg, error, ok, rootError } from "../result";
import { Entry, JsonArr } from "../utils";
import { createValidator, Validator } from "../validator";

/**
 * Creates validator for an array
 * @param entryValidator
 */
export const array = <T extends JsonArr>(entryValidator: Validator<Entry<T>>) =>
  createValidator<T>({
    validate(validateMe) {
      if (!Array.isArray(validateMe)) {
        return rootError(`must be an array but found ${typeof validateMe}`);
      }

      const err: ErrMsg = [];

      let i = 0;
      for (const item of validateMe) {
        const validatedItemResult = entryValidator.validate(item);

        if (!validatedItemResult.ok) {
          const errors = validatedItemResult.err.map((itemErr) => ({
            ...itemErr,
            path: `[${i}]${itemErr.path}`,
          }));
          err.push(...errors);
        }
        i++;
      }

      return err.length ? error(err) : ok(validateMe as T);
    },
  });
