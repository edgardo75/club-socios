const http = require('http');

const url = 'http://localhost:3000/uploads/download-1764352755788.jpg';

http.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
