
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
        //
        var img = $('<img src="'+img.url+'" style="display:block;margin-left:auto;margin-right:auto;max-width:100%;height:auto;"' + ' " height="'+img.height+'" width="'+img.width+'" "></img>')
        //imageResults.append(imgHtml)
        allImages.push(img)
      })
    })
    toggleHeaderOff()
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
    var description = ' ::: ' + getCurrentArtist() + ' ::: ' + getCurrentTrackName()
    if (isPaused()) {
      playPause.html('Play' + description)
      toggleHeaderOn()
    } else if (isPlaying()) {
      playPause.html('Pause' + description)
    }
  }

  function isPaused() {
    return R.player.playState() === R.player.PLAYSTATE_PAUSED
  }
  function isPlaying() {
    return R.player.playState() === R.player.PLAYSTATE_PLAYING
  }

  playPause.on('click', function() {
    updateUI()
    R.player.togglePause()
    setTimeout(function(){
      updateUI()
    }, 300)
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
    imageResults.on('click', function() {
      headerDiv.toggle()
    })
    clearInterval(intervalId)
    intervalId = setInterval(function() {
      //updateUI()
      var img = allImages.shift()
      img.css('opacity', 0.0)
      imageResults.empty()
      imageResults.append(img)
      img.animate({opacity:1.0, duration:getTempo()})
    }, 4000)
  }
  function toggleHeaderOff() {
    if (headerDiv.is(':visible')) headerDiv.toggle()
  }
  function toggleHeaderOn() {
    if (!headerDiv.is(':visible')) headerDiv.toggle()
  }

  function setfocus() {
    setTimeout(function(){window.scrollTo(0, 1)},100);
    setTimeout(function(){document.getElementById("project").focus()},200);
  }
  setfocus()


})})

