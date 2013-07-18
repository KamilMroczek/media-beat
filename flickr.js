module.exports = search

var API_KEY = require('./apikeys.js').flickr
  , BASE_URL = 'http://api.flickr.com/services/rest/'
  , url = require('url')
  , request = require('request')

function search(txt, cb) {
  var flickrUrl = url.parse(BASE_URL)
  flickrUrl.query = {
      text : txt
    , content_type : 1 //json
    , api_key : API_KEY
    , format : 'json'
    , nojsoncallback : 1 //give us json data, (do not give us a function)
  }
  request({url : flickrUrl.format(), json : true}, function (err, res, json) {
    console.log('flickr response:\n%s', JSON.stringify(json))
    var pictures = formatP
  })
}

function formatPictureArray(json) {
  //url format: http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
  //look at this for reference : http://www.flickr.com/services/api/misc.urls.html
  var ret = []
  json.photos.photo.forEach(function (pic) {
    var url = 'http://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '_b.jpg' //b is large size
    ret.push({url : url})
  })
}
