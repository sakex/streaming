var express = require('express') //Permet de naviguer parmi les fichiers
var app = new express()
var server= require('http').createServer(app); //Permet de créer le serveur
var fs = require('fs');
var mongoose = require('mongoose');
var formidable = require('formidable');
var siofu = require('socketio-file-upload');
app.use(siofu.router);
var io = require('socket.io').listen(server);


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

app.get("/", function(req, res){
  getFilms({}, "nom vues", {sort: {nom: 1}}, function(result){
    res.render("main.ejs", {filmList: result})
  })
});

app.get("/upload", function(req, res){
    res.render("upload.ejs");
});

app.get("/droit", function(req, res){
    res.sendFile(__dirname+"/views/droit.html");
});

app.get("/MYRIADPRO-REGULAR.OTF", function(req, res){
    res.sendFile(__dirname+"/views/MYRIADPRO-REGULAR.OTF");
});

io.on("connection", function(socket){
    var uploader = new siofu();
    uploader.dir = "/mnt/Temp";
    uploader.listen(socket);

    socket.on("complete", function(nam){
			var len = nam.length;
			var sliced = nam.slice(len-4, len);

			if(sliced === ".mp4" || sliced === ".ogg" || sliced === ".webm"){
				var repo = nam.slice(0, len-4);

				fs.mkdir("/mnt/Movies/"+repo, function(){
          fs.mkdir("/mnt/Movies/"+repo+"/subtitles", function(){
            fs.rename("/mnt/Temp/"+nam, "/mnt/Movies/"+repo+"/"+nam, function(){
  					console.log("film déplacé!");

  					var newFilm = new Films();
  			    newFilm.nom = repo;
  			    newFilm.vues = 0;
  			    newFilm.postePar = "";
  			    newFilm.subtitles = [];

  					newFilm.save(function (err) {
  			      if (err) { throw err; }
  			    });
  				});
  			});
      });
    }

      else if(sliced === ".vtt"){
        var repo = nam.slice(0, len-4);
        getFilms({"nom": repo}, "nom", null, function(result){
					//console.log(result);
          if(result[0]){
            fs.rename("/mnt/Temp/"+nam, "/mnt/Movies/"+repo+"/subtitles/"+nam, function(){
            console.log("Sous-titres ajoutés!");
          });
        }
      });
    }
  });
});

app.get("/films/:film", function(req, res){
  film = req.params.film;
  fs.readdir("/mnt/movies/"+film+"/subtitles/", function(err, data){
    if(err) throw err;
    res.render("spectate.ejs", {film: film, subtitles: data});
  });
  Films.update({nom: req.params.film}, {$inc: {vues:1}}, function(err, data){
    //console.log(data);
  });
	console.log(Date() + " " + req.params.film);
});

app.get("/jquery", function(req, res){
  res.sendFile(__dirname + "/js/jquery-3.1.1.min.js");
});

app.get("/js/:script", function(req, res){
  res.sendFile(__dirname + "/js/"+req.params.script);
});

app.get("/css/:style", function(req, res){
  res.sendFile(__dirname + "/css/"+req.params.style);
});

app.get("/db/movie/:film", function(req, res){
  res.sendFile("/mnt/Movies/"+req.params.film+"/"+req.params.film+".mp4");
});

app.get("/db/movie/:film/subtitles/:subtitles", function(req, res){
  res.sendFile("/mnt/Movies/"+req.params.film+"/subtitles/"+req.params.subtitles);
});

function getFilms(query, options, sort, callback){ //Simplifier les queries
  Films.find(query, options, sort, function (err, result) {
      if (err) return handleError(err);
      callback(result);
    })
}

server.listen("8080");
console.log("Bring Yourself Back Online");
