require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');

const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = {};
let count = 1;

app.post('/api/shorturl', (req, res) => {
  let inputUrl = req.body.url;

  try{
    let urlObject = new URL(original_url);
    dns.lookup(urlObject.hostname, (err) => {
      if(err){
        return res.json({error: 'invalid url'})
      }

      const short_url = count++;
      urls[short_url] = original_url;

      res.json({
        original_url,
        short_url
      });
    });
  }catch(err){
    res.json({error: 'invalid url'});
  }
});

app.get('/api/shorturl/:short_url', function (req, res){
  const short = req.params.short_url;
  const original_url = urls[short];

  if(original_url){
    res.redirect(original_url);
  }
  else{
    res.json({error: 'No short URL found for given input'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
