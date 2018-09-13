const mongoose = require('mongoose');
const readdir = require('../readdir.js');
const mv = require('../mv.js');
const spawn = require('child_process').spawn;
const mkdir = require('../mkdir.js');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/streaming',
  {useMongoClient: true},
  err => {
    if (err) throw err;
  });

  const FilmsSchema = new mongoose.Schema({
    nom: String,
    vues: Number,
    postePar: String,
    subtitles: [],
    temp: {
      type: Boolean,
      default: false,
      index: true
    }
  });

const Films = mongoose.model('films', FilmsSchema);

const getFilms = (query, options, sort, callback) => {
  //Simplifier les queries
  Films.find(query, options, sort, (err, result) => {
      if (err) throw err;
      callback(result);
    });
};

const increment = (param) => {
  Films.update({nom: param}, {$inc: {vues:1}}, (err) => {
    if(err) console.log(err);
  });
};

const addMovie = (name) => {
  const newFilm = new Films();
  newFilm.nom = name;
  newFilm.vues = 0;
  newFilm.postePar = '';
  newFilm.subtitles = [];

  newFilm.save((err) => {
    if (err) {
      throw err;
    }
  });
};

const like = (query, n, callback) => {
  Films.find({nom: {
    $regex: new RegExp(query, 'ig')
    }
  }, 'nom vues',
  (err, result) => {
        if (err) throw err;
        callback(result);
      })
  .limit(n);
};

const extractMovie = dir => {
  const reg = /\.mp4$/;
  const srt = /\.srt$/;
  const vtt = /\.vtt$/;

  const result = {
    movie: null,
    srt: null,
    vtt: null
  };

  for(const file of dir){
    if(reg.test(file))
      result.movie = file;
    else if(srt.test(file))
      result.srt = file;
    else if(vtt.test(file))
      result.vtt = file;
  }

  if(result.movie)
    return result;

  const error = new Error('Movie not found');
  error.code = 404;
  throw error;
};

const upSRT = async (name, io, out) => {
  // Convert SRT to VTT
  const result = await getFilms(
    {'nom': name}, 'nom', null
  );
  if (result[0]) {
    spawn('node', [
        '/mnt/streaming/child_process/SRTVTT.js',
        io,
        out
      ]);
    }
};


const addTemp = async name => {
  try{
    const dir = await readdir(`/mnt/downloads/${name}`);
    const files = extractMovie(dir);
    await mv(
      `/mnt/downloads/${name}`,
      `/mnt/Movies/${name}`
    );
    //sync (awaited)
    const mvPromise = mv(
      `/mnt/Movies/${name}/${files.movie}`,
      `/mnt/Movies/${name}/${name}.mp4`
    );

    const mkdirPromise = mkdir(
      `/mnt/Movies/${name}/subtitles`
    );

    if(files.srt){
      mkdirPromise.then(async () => {
        await mv(
          `/mnt/Movies/${name}/${files.srt}`,
          `/mnt/Movies/${name}/subtitles/${files.srt}`
        );
        const vtt = `${files.srt.split('.srt')[0]}.vtt`;
        upSRT(name,
          `/mnt/Movies/${name}/subtitles/${files.srt}`,
          `/mnt/Movies/${name}/subtitles/${vtt}`
          );
      });
    }
    if(files.vtt){
      mkdirPromise.then(async () => {
      await mv(
        `/mnt/Movies/${name}/${files.vtt}`,
        `/mnt/Movies/${name}/subtitles/${files.vtt}`
        );
      });
    }
    //async

    const newFilm = new Films();
    newFilm.nom = name;
    newFilm.vues = 0;
    newFilm.temp = true;
    newFilm.postePar = '';
    newFilm.subtitles = [];

    return await Promise.all([
      mvPromise,
      newFilm.save(),
      mkdirPromise
    ]);
  }
  catch(err){
    console.error(err.stack);
    if(err.code === 404)
      await mv(
        `../Movies/${name}`,
        `../failed/${name}`
      );
    else
      throw err;
  }
};

module.exports = {
  getFilms: getFilms,
  increment: increment,
  addMovie: addMovie,
  like: like,
  addTemp: addTemp
};
