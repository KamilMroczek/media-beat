
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
    //taher, here is the realtime API. `rdioRealtimeSearch` is a global function
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
    //taher, here is the image API. `getImages` is a global function
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
    var description = ' - ' + getCurrentArtist() + ' ' + getCurrentTrackName()
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

  //autocomplete
  $( "#project" ).autocomplete({
    minLength: 0,
    source: rdioRealtimeSearch,
    focus: function( event, ui ) {
      $( "#project" ).val( ui.item.label );
      return false;
    },
    select: function( event, ui ) {
      ui.item.value()
      //$( "#project" ).val( ui.item.label );
      //$( "#project-id" ).val( ui.item.theartist );
      //$( "#project-description" ).html( ui.item.desc );

      return false;
    }
  })
  .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
    var li = $( '<li>'+item.label+'</li>' )
    li.on('click', item.value)
    li.css('cursor', 'pointer')

    return li.appendTo( ul );
  }

  function setfocus() {
    setTimeout(function(){window.scrollTo(0, 1)},100);
    setTimeout(function(){document.getElementById("project").focus()},200);
  }
  setfocus()

})})

