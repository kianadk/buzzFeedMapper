const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const listExtractor = require('./listExtractor.js');
const yelp = require('./yelp.js');

const app = express()

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/extractList', async function(req, res) {
  try {
    const places = await listExtractor(req.query.link);
    res.json(places);
  }
  catch(e) {
    res.send("There was an error loading the page");
  }
});

app.post('/yelp', async function(req, res) {
  try {
    const info = await yelp(req.body.data);
    res.json(info);
  }
  catch(e) {
    res.send("There was an error looking up the businesses")
  }
});

app.listen(5050, function () {
  console.log('Running at localhost:5050');
})