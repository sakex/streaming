const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/streaming', {
    useMongoClient: true
  },
  err => {
    if (err) throw err;
  });

  var FilmsSchema = new mongoose.Schema({
    nom: String,
    vues: Number,
    postePar: String,
    subtitles: []
  });

  const Films = mongoose.model('films', FilmsSchema);


  const valid = x => {
    console.log(x);
  };

  //for(i in dir){
    const newFilm = new Films();
    newFilm.nom = process.argv[2];
    newFilm.vues = 0;
    newFilm.postePar = 'Sakex';
    newFilm.subtitles = [];

    newFilm.save((err) => {
      if (err)
        throw err;
      valid(newFilm);
      mongoose.connection.close();
    });
