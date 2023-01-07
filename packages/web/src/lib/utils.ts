export const toErrorMap = (errors: unknown[]) => {
  if (!errors.length) return {};

  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
