let api_key = "";
// if (process.env.NODE_ENV === 'production')
api_key = window.location.href.split('apikey=')[1].split('&')[0];
// else
  // api_key = '71932364-1925-4130-8e0c-389fa455f37e';

let api_base_address = "";
// if (process.env.NODE_ENV === 'production')
// api_base_address = `${window.location.protocol}//${window.location.hostname}${(window.location.port)?':'+window.location.port:''}`;
api_base_address = decodeURIComponent(window.location.href.split('apiurl=')[1]);

// console.log(window.location.href);
// else
  // api_base_address = `http://localhost:8845`;


// console.log(api_key);
// console.log(api_base_address);

export {api_base_address};
export default api_key;