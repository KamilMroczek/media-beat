var restify = require('restify')
  , server = restify.createServer()
  , path = require('path')
  , filed = require('filed')
  , port = 8081

server.get('static/:filename', function (req, res) {
  var filename = path.join(__dirname, 'static',  req.params.filename)
  console.log('serving filename: ' + filename)
  filed(filename).pipe(res)
})

server.get('/', function(req, res){
  filed(path.join(__dirname, '/static/home.html')).pipe(res)
})

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
})
