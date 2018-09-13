const open = require('fs').open;

module.exports = (path, flags) => {
  return new Promise((resolve, reject) => {
    open(path, flags, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
};