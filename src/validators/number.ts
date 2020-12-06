import { ok, rootError } from "../result";
import { createValidator } from "../validator";

/**
 * Creates a validator for a number
 * @param restrictions
 */
export const number = (
  restrictions: {
    lt?: number;
    gt?: number;
    lte?: number;
    gte?: number;
    integer?: boolean;
  } = {}
) =>
  createValidator<number>({
    validate(validateMe) {
      if (typeof validateMe !== "number") {
        return rootError(`must be a number but found ${typeof validateMe}`);
      }
      if (restrictions.gt !== undefined && validateMe <= restrictions.gt) {
        return rootError(`must be greater than ${restrictions.gt} but found ${validateMe}`);
      }
      if (restrictions.gte !== undefined && validateMe < restrictions.gte) {
        return rootError(
          `must be greater than or equal to ${restrictions.gte} but found ${validateMe}`
        );
      }
      if (restrictions.lt !== undefined && validateMe >= restrictions.lt) {
        return rootError(`must be less than ${restrictions.lt} but found ${validateMe}`);
      }
      if (restrictions.lte !== undefined && validateMe > restrictions.lte) {
        return rootError(
          `must be less than or equal to ${restrictions.lte} but found ${validateMe}`
        );
      }
      if (restrictions.integer && Number.isSafeInteger(validateMe)) {
        return rootError(`must be an integer between 2^-53 and 2^53  but found ${validateMe}`);
      }
      return ok(validateMe);
    },
  });
