export function formattedError(err: Error) {
  return {
    message: err.message,
    stack: err.stack,
  };
}
