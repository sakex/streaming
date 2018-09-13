const mv = require('fs').rename;

module.exports = (from, to) => {
  return new Promise((resolve, reject) => {
    mv(from, to, err => {
      if (err) reject(err);
      resolve(true);
    });
  });
};