const mongoose = require('mongoose');
const readdir = require('../readdir.js');
const mv = require('../mv.js');
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
  for(const movie of dir){
    if(reg.test(movie))
      return movie;
  }
  const error = new Error('Movie not found');
  error.code = 404;
  throw error;
};

const addTemp = async name => {
  try{
    const dir = await readdir(`../Movies/${name}`);
    const movie = extractMovie(dir);
    await mv(
      `/mnt/downloads/${name}`,
      `/mnt/Movies/${name}`
    );
    //sync (awaited)
    const mvPromise = mv(
      `/mnt/download/${name}/${movie}`,
      `/mnt/Movies/${name}/${name}.mp4`
    );
    //async

    const newFilm = new Films();
    newFilm.nom = name;
    newFilm.vues = 0;
    newFilm.temp = true;
    newFilm.postePar = '';
    newFilm.subtitles = [];

    return await Promise.all([mvPromise, newFilm.save()]);
  }
  catch(err){
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
