
var restify = require('restify')
  , server = restify.createServer()
  , path = require('path')
  , filed = require('filed')
  , async = require('async')
  , PORT = process.env.PORT || 8081
  , bing = require('./bing.js')
  , flickr = require('./flickr.js')
  , lyrics = require('./lyrics.js')
  , STATIC_PATH = path.join(process.cwd(), 'static')

//console.log('cwd: %s', process.cwd())
//console.log('__dirname: %s', __dirname)
console.log('static path: %s', STATIC_PATH)

server.get('static/:filename', function (req, res) {

  var filename = req.params.filename
    , filePath = path.join(STATIC_PATH, filename)

  //if (filename.slice(0, STATIC_PATH.length) !== filename) { //basically, filepath contained ../
  //  res.statusCode = 403
  //  res.end('hmmmmmmmmmmmmmmmmmmm')
  //  return
  //}

  console.log('serving file: ' + filePath)
  filed(filePath).pipe(res)
})

server.get('/', function(req, res){
  filed(path.join(process.cwd(), '/static/index.html')).pipe(res)
})
server.get('/flickr/:query', function(req, res) {
  flickr(req.params.query, function(e, pics) {
    if (e) return res.end(e)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({images : pics}))
  })
})

server.get('/images/:artist/:mood/:track', function (req, res) {
  console.log('getting images for artist: %s \tmood: %s \ttrack: %s', req.params.artist, req.params.mood, req.params.track )
  async.parallel({
    bingArtist: function(cb) {
      flickr(req.params.artist, cb)
    },
    bingTrack: function(cb) {
      flickr(req.params.track, cb)
    },
    bingMood: function(cb) {
      flickr(req.params.mood, cb)
    }//,
    //flickrTrack: function(cb) {
    //  flickr(req.params.track, cb)
    //},
    //flickrArtist: function(cb) {
    //  flickr(req.params.artist, cb)
    //}
  }, function(err, allResults) {
    if (err) return res.end(err)

    var artistArray = allResults.bingArtist
      , moodArray = allResults.bingMood
      , trackArray = allResults.bingTrack
      //, flTrackArray = allResults.flickrTrack
      //, flAristArray = allResults.flickrArtist
      , randomImages = []
      , i = 0

    while(artistArray.length > 0 || moodArray.length > 0 || trackArray.length > 0 /*|| flAristArray.length > 0 || flTrackArray.length > 0*/) {
      if(artistArray.length > 0) {
        randomImages.push(artistArray.shift())
      }
      if(moodArray.length > 0) {
        var url = moodArray.shift()
        if(i < 1 || (i % 8) === 0) {
          //console.log("i=" + i + ", adding")
          randomImages.push(url)
        }
      }
      if(trackArray.length > 0) {
        randomImages.push(trackArray.shift())
      }
      //if(flTrackArray.length > 0) {
      //  randomImages.push(flTrackArray.shift())
      //}
      //if(flAristArray.length > 0) {
      //  randomImages.push(flAristArray.shift())
      //}
      i++;
    }

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({images : randomImages}))
  })
})

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
})
