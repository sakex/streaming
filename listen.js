const readPromise = require('./readdir.js');
const {addTemp} = require('./DB/mongo.js');

const addFiles = async () => {
  try {
    const newFiles = await readPromise('/mnt/downloads');
    await Promise.all(newFiles.map(async file => {
      await addTemp(file);
    }));
    return true;
  }
  catch (err) {
    console.error(err.stack);
  }
};

const listen = async () => {
  try{
    await addFiles();
    setTimeout(listen, 60000);
  }
  catch(err){
    listen();
  }
};

module.exports = listen;