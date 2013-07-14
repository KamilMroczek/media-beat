var restify = require('restify')
  , server = restify.createServer()
  , path = require('path')
  , filed = require('filed')
  , port = 8081
  , bing = require('./bing.js')


server.get('static/:filename', function (req, res) {
  var filename = path.join(__dirname, 'static',  req.params.filename)
  console.log('serving filename: ' + filename)
  filed(filename).pipe(res)
})

server.get('/', function(req, res){
  filed(path.join(__dirname, '/static/home.html')).pipe(res)
})
//TODO mood
server.get('/images/:artist', function (req, res) {
  console.log('getting images for artist: ' + req.params.artist)
  bing('feeling adventurous', req.params.artist, function(arr) {
    res.setHeader('Content-Type', 'application/json')
    console.log('returning images')
    res.end(JSON.stringify({images : JSON.stringify(arr)}))
  })
})

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
})
