require('dotenv').config();
const express = require('express');
const cors = require('cors');
const URL = require('url').URL;
const dns = require('dns');
const bodyParser = require('body-parser');
const { request } = require('http');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];

app.post("/api/shorturl", (request, response) => {
  let url = new URL(request.body.url);
  try {
    dns.lookup(url.hostname, (err)=> {
      if(err) {
        response.json({error: "Invalid hostname"});
      }else {
        if(!urls.includes(url)){
          urls.push(url);
        }
        response.json({original_url: url.href, shorturl: urls.indexOf(url)+1});
      }
    })
  } catch (error) {
    response.json({error: "Invalid hostname"});
  }
});

app.get("/api/shorturl/:id", (request, response)=> {
  const externalURL = urls[request.params.id-1];
  response.redirect(externalURL);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
