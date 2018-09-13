const load = require(`${__dirname}/sockets.js`);
const listen = require('./listen.js');

listen();

load.start(8080);
