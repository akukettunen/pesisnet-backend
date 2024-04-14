// axiosSetup.js
const axios = require('axios');

// List of origins to randomly choose from
// const origins = [
//   'http://example.com',
//   'http://anotherdomain.com',
//   'http://yetanother.com'
// ];

const origins = [
  'http://pesisnet-3a367fb30c25.herokuapp.com/'
]

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor to the instance
axiosInstance.interceptors.request.use(config => {
  // Select a random origin from the list
  const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
  // Set the Origin header to a randomly selected origin
  // config.headers['Origin'] = randomOrigin;
  // config.headers['Via'] = randomOrigin;
  // config.headers['Referer'] = 'https://pesis.net/';
  console.log(config)
  // config.headers['x-api-key'] = process.env.API_KEY;
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

module.exports = axiosInstance;