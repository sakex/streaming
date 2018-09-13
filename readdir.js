const readdir = require('fs').readdir;

const readPromise = file => {
  return new Promise((resolve, reject) => {
    readdir(file, (err, files) => {
      if (err) reject(err);
      resolve(new Set(files));
    });
  });
};

module.exports = readPromise;