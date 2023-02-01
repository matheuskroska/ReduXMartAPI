const DEFAULT_LIMIT = 10;

function validateOffset(offset) {
  if (!offset || isNaN(offset) || parseInt(offset) < 0) {
    return 0;
  }
  return parseInt(offset);
}

function validateLimit(limit) {
  if (!limit || isNaN(limit) || parseInt(limit) < 1) {
    return DEFAULT_LIMIT;
  }
  return parseInt(limit);
}

export { validateOffset, validateLimit };
