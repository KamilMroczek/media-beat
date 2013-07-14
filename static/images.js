
window.getImages = function(cb) {
  $.getJSON('/images', function (data, status) {
    console.log('recieved images')
    var images = JSON.parse(data.images)
    cb(JSON.parse(data.images))
    console.log(images)
    images.forEach(function(img) {
      var imgHtml = $('<img src="'+img.url+'" height="'+img.height+'" width="'+img.width+'"></img>')
      $('body').append(imgHtml)
    })
  })
}
