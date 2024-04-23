export const toQueryString = (query) => {
  return Object.keys(query)
    .filter((key) => query[key] != null)
    .map((key) => `${key}=${query[key] || ''}`)
    .join('&');
};