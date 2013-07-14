
window.getImages = function(artist, cb) {
  getTrackMood(function(ret) {
    console.log('getting images for query: ' + artist)
    $.getJSON('/images/'+artist+'/'+ret["mood"], function (data, status) {
      console.log('recieved images')
      var images = JSON.parse(data.images)
      cb(JSON.parse(data.images))
      //console.log(images)
    })
  })
}
