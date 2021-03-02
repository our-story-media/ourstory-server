
// This was gotten from /config/defaultlocal.js
// It should probably be changed there as well...?
const api_key = window.location.href.split('apikey=')[1];

export const api_base_address = `${window.location.protocol}//${window.location.hostname}${(window.location.port)?':'+window.location.port:''}`;

export default api_key;