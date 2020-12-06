import { ok, rootError } from "../result";
import { createValidator } from "../validator";

/**
 * Creates a validator for boolean entries
 * @param validator
 */
export const boolean = () =>
  createValidator<boolean>({
    validate(validateMe) {
      if (typeof validateMe === "boolean") {
        return ok(validateMe);
      } else {
        return rootError(`must be a boolean but found ${typeof validateMe}`);
      }
    },
  });
