const https = require('https');

const url = 'https://drive.google.com/thumbnail?id=1_83K_thPaaxanNaot3OKTQq7BGupvXLx&sz=w1000';

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log(`Redirecting to: ${res.headers.location}`);
  }
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
