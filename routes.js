const express = require('express') //Permet de naviguer parmi les fichiers
const app = new express();
const server= require('http').createServer(app); //Permet de créer le serveur
const db = require(__dirname + "/DB/mongo.js");
const fs = require('fs');

app.get("/", (req, res) => {
  db.getFilms({}, "nom vues", {sort: {nom: 1}}, (result) => {
    res.render("main.ejs", {filmList: result})
  })
});

app.get("/upload", (req, res) => {
    res.render("upload.ejs");
});

app.get("/MYRIADPRO-REGULAR.OTF", (req, res) => {
    res.sendFile(__dirname+"/views/MYRIADPRO-REGULAR.OTF");
});

app.get("/films/:film", (req, res) => {
  film = req.params.film;
  fs.readdir("/mnt/movies/"+film+"/subtitles/", (err, data) => {
    if(err) throw err;
    res.render("spectate.ejs", {film: film, subtitles: data});
  });
  db.increment(req.params.film);
	console.log(Date() + " " + req.params.film);
});

app.get("/jquery", (req, res) => {
  res.sendFile(__dirname + "/js/jquery-3.1.1.min.js");
});

app.get("/js/:script", (req, res) => {
  res.sendFile(__dirname + "/js/"+req.params.script);
});

app.get("/css/:style", (req, res) => {
  res.sendFile(__dirname + "/css/"+req.params.style);
});

app.get("/db/movie/:film", (req, res) => {
  res.sendFile("/mnt/Movies/"+req.params.film+"/"+req.params.film+".mp4");
});

app.get("/db/movie/:film/subtitles/:subtitles", (req, res) => {
  res.sendFile("/mnt/Movies/"+req.params.film+"/subtitles/"+req.params.subtitles);
});

app.get("/makeDL", (req, res) => {
  res.render("makeDL.ejs");
});

module.exports = {
  app: app,
  server: server
};
