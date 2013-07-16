
var restify = require('restify')
  , server = restify.createServer()
  , path = require('path')
  , filed = require('filed')
  , PORT = process.env.PORT || 8081
  , bing = require('./bing.js')
  , lyrics = require('./lyrics.js')
  , STATIC_PATH = path.join(__dirname, 'static')

server.get('static/:filename', function (req, res) {

  var filename = req.params.filename
    , filePath = path.join(STATIC_PATH, filename)

  //if (filename.slice(0, STATIC_PATH.length) !== filename) { //basically, filepath contained ../
  //  res.statusCode = 403
  //  res.end('hmmmmmmmmmmmmmmmmmmm')
  //  return
  //}

  console.log('serving filename: ' + filename)
  filed(filename).pipe(res)
})

server.get('/', function(req, res){
  filed(path.join(__dirname, '/static/index.html')).pipe(res)
})

server.get('/images/:artist/:mood/:track', function (req, res) {
  console.log('getting images for artist: %s \tmood: %s \ttrack: %s', req.params.artist, req.params.mood, req.params.track )
  bing(req.params.artist, function(artistArray) {
    bing(req.params.mood, function(moodArray) {
      bing(req.params.track, function(trackArray) {
        res.setHeader('Content-Type', 'application/json')
        console.log('returning images')
        var randomImages = []
        var i = 0;
        while(artistArray.length > 0 || moodArray.length > 0 || trackArray.length > 0) {
          if(artistArray.length > 0) {
            randomImages.push(artistArray.shift())
          }
          if(moodArray.length > 0) {
            var url = moodArray.shift()
            if(i < 1 || (i % 8) == 0) {
              console.log("i=" + i + ", adding")
              randomImages.push(url)
            }
          }
          if(trackArray.length > 0) {
            randomImages.push(trackArray.shift())
          }
          i++;
        }
        res.end(JSON.stringify({images : JSON.stringify(randomImages)}))
      })
    })
  })
})

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
})
