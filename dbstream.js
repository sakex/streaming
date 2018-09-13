var fs = require('fs');
var mongoose = require('mongoose');

/*var dir = fs.readdirSync("/home/pi/Temp"); //Liste des films dans movies
console.log(dir);*/
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/streaming', function(err) {
	if (err) { throw err; }
	});

	var FilmsSchema = new mongoose.Schema({
		nom: String,
    vues: Number,
    postePar: String,
    subtitles: []
	});

	var Films = mongoose.model('films', FilmsSchema);

  //for(i in dir){
    var newFilm = new Films();
    newFilm.nom = "Pirates of the Caribbean Curse of the Black Pearl";
    newFilm.vues = 0;
    newFilm.postePar = "Sakex";
    newFilm.subtitles = [];

    newFilm.save(function (err) {
      if (err) { throw err; }
      valid(newFilm);
    });
  //}




  function valid(x){
    console.log(x);
  }


mongoose.connection.close();
