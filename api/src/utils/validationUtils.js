const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

/**
 * Validates the given offset value.
 *
 * @param {any} [offset] - The offset value to be validated.
 *
 * @returns {number} - The validated offset value. If the offset value is not provided or is not a number or is less than 0, returns the default offset.
 */
const validateOffset = (offset) => {
  let parsedOffset;
  try {
    // If offset is null or undefined, set parsedOffset to DEFAULT_OFFSET
    if (offset === null || offset === undefined) {
      parsedOffset = DEFAULT_OFFSET;
    } else {
      // Convert offset to a number
      parsedOffset = Number(offset);
      // If parsedOffset is NaN or less than 0, throw an error
      if (isNaN(parsedOffset) || parsedOffset < 0 || parsedOffset % 1 !== 0) {
        return { message: "Invalid offset", status: 400 };
      }
    }
  } catch (error) {
    // Log the error and return the error object
    return { message: "Invalid offset", status: 400 };
  }
  // Return the validated offset value
  return parsedOffset;
};

/**
 * Validates the given limit value.
 *
 * @param {any} [limit] - The limit value to be validated.
 *
 * @returns {number} - The validated limit value. If the limit value is not provided or is not a number or is less than 1, returns the default limit.
 */
const validateLimit = (limit) => {
  let parsedLimit;
  try {
    // If limit is null or undefined, set parsedLimit to DEFAULT_LIMIT
    if (limit === null || limit === undefined) {
      parsedLimit = DEFAULT_LIMIT;
    } else {
      // Convert limit to a number
      parsedLimit = Number(limit);
      // If parsedLimit is NaN or less than 1, throw an error
      if (isNaN(parsedLimit) || parsedLimit <= 0  || parsedLimit > 100 || parsedLimit % 1 !== 0) {
        // Throw an error
        return { message: "Invalid limit", status: 400 };
      }
    }
  } catch (error) {
    // Return the error and the 400 status code
    return { message: "Invalid limit", status: 400 };
  }
  // Return the validated limit value
  return parsedLimit;
};

/**
handleValidationResponse is a function that processes the validation response and returns it in a formatted manner
@param {Object} res - The Express response object
@param {Object} response - The response object from the validation process
@returns {Object} - Either an error with a status code and message, or the original response
*/
const handleValidationResponse = (res, response) => {
  if (response.message) {
    return res.status(response.status).send({ error: response.message });
  }
  return response;
};

module.exports = {
  validateOffset,
  validateLimit,
  handleValidationResponse,
};
