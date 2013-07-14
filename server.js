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
  filed(path.join(__dirname, '/static/index.html')).pipe(res)
})

server.get('/images/:artist/:mood', function (req, res) {
  console.log('getting images for artist: %s \tmood: %s', req.params.artist, req.params.mood )
  bing(req.params.artist, function(artistArray) {
    bing(req.params.mood, function(moodArray) {
      res.setHeader('Content-Type', 'application/json')
      console.log('returning images')
      var allImages = artistArray.concat(moodArray)
      var randomImages = []
      while(artistArray.length > 0 || moodArray.length > 0) {
        if(artistArray.length > 0) {
          randomImages.push(artistArray.shift())
        }
        if(moodArray.length > 0) {
          randomImages.push(moodArray.shift())
        }
      }
      res.end(JSON.stringify({images : JSON.stringify(randomImages)}))
    })
  })
})

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
})
