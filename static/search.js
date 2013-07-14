
/*global
  $ : true,
  console : true
*/


$(document).ready(function () {


	var searchForm = $('#search_form')
    , searchBox = $('#search_box')
    , resultsDiv = $('#search_results')
    , playPause = $('#play_pause')
    , previousTxt = ''

  setInterval(function() {
    var txt = searchBox.val()
    updateUI()
    if (txt === previousTxt) return
    resultsDiv.empty()
    previousTxt = txt
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

	function submitForm(ev) {
    ev.preventDefault() //dont reload page....
  }
	searchForm.on('submit', submitForm);

  function updateUI() {
    var currentlyPlaying = R.player.playingSource().attributes.name
      , description = ''
    if (currentlyPlaying) description = ' - ' + currentlyPlaying

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
})

