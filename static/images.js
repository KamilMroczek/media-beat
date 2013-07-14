
window.getImages = function(artist, track, cb) {
  getTrackMood(function(ret) {
    console.log('getting images for query: ' + artist + ' and mood ' + ret["mood"] + ' and track ' + track)
    console.log('tempo =' + ret["tempo"])
    $.getJSON('/images/'+artist+'/'+ret["mood"]+'/'+track, function (data, status) {
      console.log('recieved images')
      var images = JSON.parse(data.images)
      cb(JSON.parse(data.images))
      //console.log(images)
    })
  })
}
