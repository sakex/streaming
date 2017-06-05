const http = require('http');
const fs = require('fs');

const url = process.argv[2];
const name = process.argv[3];

const file = fs.createWriteStream("/mnt/Temp/" + name);
const request = http.get(url, (response) => {
  response.pipe(file);
});
