
/*global
  $ : true,
  console : true,
  R : true, document:true, getImages:true, getCurrentArtist:true, rdioRealtimeSearch:true, window:true, getCurrentTrackName:true
*/


$(document).ready(function () { R.ready(function() {
  var playPause = $('#play_pause')
    , imageResults = $('#image_results')
    , headerDiv = $('#header_div')
    , previousTxt = ''
    , allImages = []

  loadImages()
  updateUI()

  function loadImages() {
    //taher, here is the image API. `getImages` is a global function
    getImages(getCurrentArtist(), getCurrentTrackName(), function(images) {
      imageResults.empty()
      allImages = []
      images.forEach(function(img) {
        var imgHtml = $('<img src="'+img.url+'" height="'+img.height+'" width="'+img.width+'" style="display:block;margin-left:auto;margin-right:auto;"></img>')
        //imageResults.append(imgHtml)
        allImages.push(imgHtml)
      })
    })
    animateThroughImages()
  }

  R.player.on('change:playingSource', function() {
    console.log('playing source changed')
    loadImages()
    updateUI()
  })

  R.player.on('change:playingTrack', function() {
    console.log('playing track changed')
    loadImages()
    updateUI()
  })

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

  //animate through images
  var intervalId
  function animateThroughImages() {
    var nivo = $('#slider')
    nivo.empty()
    allImages.forEach(function(img) {
      nivo.append(img)
    })
    nivo.nivoSlider({
        animSpeed : 300
      , pauseTime : getTempo()
    })
    nivo.on('click', function() {
      headerDiv.toggle()
    })
    //imageResults.on('click', function() {
    //  headerDiv.toggle()
    //})
    //clearInterval(intervalId)
    //intervalId = setInterval(function() {
    //  var img = allImages.shift()
    //  imageResults.empty()
    //  imageResults.append(img)
    //}, getTempo())
  }

  function setfocus() {
    setTimeout(function(){window.scrollTo(0, 1)},100);
    setTimeout(function(){document.getElementById("project").focus()},200);
  }
  setfocus()


})})

