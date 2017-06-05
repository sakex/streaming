const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/streaming', (err) => {
	if (err) { throw err; }
	});

	const FilmsSchema = new mongoose.Schema({
		nom: String,
    vues: Number,
    postePar: String,
		subtitles: []
	});

const Films = mongoose.model('films', FilmsSchema);

const getFilms = (query, options, sort, callback) => { //Simplifier les queries
  Films.find(query, options, sort, (err, result) => {
      if (err) return handleError(err);
      callback(result);
    });
}

const increment = (param) => {
  Films.update({nom: param}, {$inc: {vues:1}}, (err, data) => {
    if(err) console.log(err);
  });
}

const addMovie = (name) => {
  const newFilm = new Films();
  newFilm.nom = name;
  newFilm.vues = 0;
  newFilm.postePar = "";
  newFilm.subtitles = [];

  newFilm.save((err) => {
    if (err) { throw err; }
  });
}

module.exports = {
  getFilms: getFilms,
  increment: increment,
  addMovie: addMovie
}
