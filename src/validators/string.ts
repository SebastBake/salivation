import { ok, rootError } from "../result";
import { createValidator } from "../validator";

/**
 * Creates a validator for a string
 * @param regex
 */
export const string = (regex?: RegExp) =>
  createValidator<string>({
    validate(validateMe) {
      if (typeof validateMe !== "string") {
        return rootError(`must be a string but found ${typeof validateMe}`);
      } else if (regex && !regex.test(validateMe)) {
        return rootError(`must match regex ${regex} but found ${validateMe}`);
      }
      return ok(validateMe);
    },
  });
