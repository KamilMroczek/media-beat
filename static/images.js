
window.getImages = function(query, cb) {
  //getTrackMood(function(ret) {
    console.log('getting images for query: ' + query)
    $.getJSON('/images/'+query, function (data, status) {
      console.log('recieved images')
      var images = JSON.parse(data.images)
      cb(JSON.parse(data.images))
      //console.log(images)
    })
  //})
}
