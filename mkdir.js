const mkdir = require('fs').mkdir;

module.exports = path => {
  return new Promise((resolve, reject) => {
    mkdir(path, err => {
      if(err) reject(err);
      resolve(true);
    });
  });
};