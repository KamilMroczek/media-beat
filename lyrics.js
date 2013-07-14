var request = require('request')

module.exports = function(artist, track, cb) {
   var lyricsUrl = "http://lyrics.wikia.com/api.php?fmt=text";
   lyricsUrl += "&artist=" + encodeURIComponent(artist);
   lyricsUrl += "&song=" + encodeURIComponent(track);
   // http://lyrics.wikia.com/api.php?fmt=text&artist=Stone%20Temple%20Pilots&song=Creep

   console.log("Getting lyrics from " + lyricsUrl)
   var lyrics = [];
   request(lyricsUrl, function(err, res, body) {
     if (!err && res.statusCode == 200) {
       console.log('lyrics response: \n\t' + body)
       lyrics = body.split('\n')
       console.log("length=" + lyrics.length)
     } else {
       console.log('error!-' + res.statusCode)
     }
     cb(lyrics);
   })
 }