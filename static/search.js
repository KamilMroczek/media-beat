
/*global
  $ : true,
  console : true
*/


$(document).ready(function () { R.ready(function() {
	var searchForm = $('#search_form')
    , searchBox = $('#search_box')
    , resultsDiv = $('#search_results')
    , playPause = $('#play_pause')
    , imageResults = $('#image_results')
    , previousTxt = ''

  loadImages()
  updateUI()
  setInterval(function() {
    var txt = searchBox.val()
    updateUI()
    if (txt === previousTxt) return
    resultsDiv.empty()
    previousTxt = txt
    //taher, here is the realtime API
    rdioRealtimeSearch(txt, function(res) {
      res.forEach(function(itm) {
        var div = $('<div style="cursor:pointer;">' + itm.name + '</div>')
        div.on('click', function() {
          console.log('playing: ', itm.name)
          itm.play()
        })
        resultsDiv.append(div)
      })
    })
  }, 200)

  function loadImages() {
    //taher, here is the image API
    getImages(currentArtist(), function(images) {
      images.forEach(function(img) {
        var imgHtml = $('<img src="'+img.url+'" height="'+img.height+'" width="'+img.width+'"></img>')
        imageResults.prepend(imgHtml)
      })
    })
  }
  R.player.on('change:playingSource', function() {
    console.log('playing source changed')
    loadImages()
  })
  R.player.on('change:playingTrack', function() {
    console.log('playing track changed')
    loadImages()
  })

	function submitForm(ev) {
    ev.preventDefault() //dont reload page....
  }
	searchForm.on('submit', submitForm);

  function updateUI() {
    var currentlyPlaying = R.player.playingTrack()
      , description = ''
    if (currentlyPlaying) description = ' - ' + currentlyPlaying.get('albumArtist') + ' ' + currentlyPlaying.get('name')

    if (isPaused()) playPause.html('Play' + description)
    else if (isPlaying()) playPause.html('Pause' + description)
  }

  function isPaused() {
    return R.player.playState() === R.player.PLAYSTATE_PAUSED
  }
  function isPlaying() {
    return R.player.playState() === R.player.PLAYSTATE_PLAYING
  }

  playPause.on('click', function() {
    R.player.togglePause()
    updateUI()
  })

  function currentArtist() {
    var artist = R.player.playingTrack().get('albumArtist')
    return artist
  }
})})

