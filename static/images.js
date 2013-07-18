
window.getImages = function(artist, track, cb) {
  getTrackMood(function(ret) {
    console.log('getting images for query: ' + artist + ' and mood ' + ret["mood"] + ' and track ' + track)
    console.log('tempo =' + ret["tempo"])
    var url = '/images/'+encodeURIComponent(artist)+'/'+encodeURIComponent(ret["mood"])+'/'+encodeURIComponent(track)
    url = url.replace(/\(/g, "").replace(/\)/g, "");
    $.getJSON(url, function (resJson, status) {
      console.log('recieved images')
      var images = resJson.images
      cb(images)
      //console.log(images)
    })
  })
}
