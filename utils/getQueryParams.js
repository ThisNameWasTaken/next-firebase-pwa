export default function getQueryParams() {
  if (typeof window === 'undefined') return {};

  const url = window.location.href;
  const queryParamsString = url.split('?')[1];
  const queryParams = {};

  if (!queryParamsString) return queryParams;

  queryParamsString.split('&').forEach(keyValueString => {
    const [key, value] = keyValueString.split('=');
    queryParams[decodeURI(key)] = decodeURI(value.split('#')[0]);
  });

  return queryParams;
}
