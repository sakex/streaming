const express = require('express');
//Permet de naviguer parmi les fichiers
const app = new express();
const server= require('http').createServer(app);
//Permet de créer le serveur
const db = require(`${__dirname}/DB/mongo.js`);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const mdp = 'sziget2k16';

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));


const chckUser = (cookie, res, callback) => {
  if(cookie === mdp){
    callback();
  }
  else{
    res.redirect('/id');
  }
};

app.get('/', (req, res) => {
  //console.log(req.cookies);
  chckUser(req.cookies.mdp, res, () => {
    db.getFilms({}, 'nom vues', {sort: {nom: 1}}, (result) => {
      res.render('main.ejs', {filmList: result});
    });
  });
});

app.get('/id', (req, res) => {
  res.render('id.ejs');
});

app.post('/sendmdp', (req, res) => {
  if(req.body.mdp === mdp){
    //console.log(req.body.mdp);
    res.cookie('mdp', mdp, {expires: new Date(Date.now() + 604800000), httpOnly: true});
    res.redirect('/');
  }
  else{
    res.redirect('/id');
  }
});

app.get('/search/:query', (req, res) => {
  chckUser(req.cookies.mdp, res, () => {
    db.like(req.params.query, 50, (result) => {
      res.render('main.ejs', {filmList: result});
    });
  });
});

app.get('/upload', (req, res) => {
  chckUser(req.cookies.mdp, res, () => {
    db.like(req.params.query, 50, () => {
      res.render('upload.ejs');
    });
  });
});

app.get('/MYRIADPRO-REGULAR.OTF', (req, res) => {
    res.sendFile(`${__dirname}/views/MYRIADPRO-REGULAR.OTF`);
});

app.get('/films/:film', (req, res) => {
  chckUser(req.cookies.mdp, res, () => {
    const film = req.params.film;
    fs.readdir(`../movies/${film}/subtitles/`, (err, data) => {
      if(err) throw err;
      res.render('spectate.ejs', {film: film, subtitles: data});
    });
    db.increment(req.params.film);
    console.log(`${Date()} ${req.params.film}`);
  });
});

app.get('/jquery', (req, res) => {
  res.sendFile(`${__dirname}/js/jquery-3.1.1.min.js`);
});

app.get('/js/:script', (req, res) => {
  res.sendFile(`${__dirname}/js/${req.params.script}`);
});

app.get('/css/:style', (req, res) => {
  res.sendFile(`${__dirname}/css/${req.params.style}`);
});

app.get('/db/movie/:film', (req, res) => {
  //console.log('d')
  chckUser(req.cookies.mdp, res, () => {
    res.sendFile(`../Movies/${req.params.film}/${req.params.film}.mp4`);
  });
});

app.get('/db/movie/:film/subtitles/:subtitles', (req, res) => {
  res.sendFile(`../Movies/${req.params.film}/subtitles/${req.params.subtitles}`);
});

app.get('/makeDL', (req, res) => {
  chckUser(req.cookies.mdp, res, () => {
    res.render('makeDL.ejs');
  });
});

module.exports = {
  app: app,
  server: server
};
