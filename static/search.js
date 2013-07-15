
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
    , autocompleteObj

  loadImages()
  updateUI()

  function loadImages() {
    //taher, here is the image API. `getImages` is a global function
    getImages(getCurrentArtist(), getCurrentTrackName(), function(images) {
      imageResults.empty()
      allImages = []
      images.forEach(function(img) {
        img = $('<img src="'+img.url+'" class="displayed_image"' + ' " height="'+img.height+'" width="'+img.width+'" "></img>')
        //imageResults.append(imgHtml)
        allImages.push(img)
      })
      toggleHeaderOff()
      animateThroughImages()
    })
  }

  R.player.on('change:playingSource', function() {
    console.log('playing source changed')
    loadImages()
    updateUI()
  })

  R.player.on('change:playingTrack', function() {
    //allImages = []
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
  autocompleteObj = $("#project").autocomplete({
    minLength: 0,
    source: rdioRealtimeSearch,
    focus: function( event, ui ) {
      //$( "#project" ).val( ui.item.label );
      //ui.css('background-color', 'red')
    },
    select: function( event, ui ) {
      ui.item.play()
      autocompleteObj('close')
    },
    open : function(event) {
      $('ul.ui-autocomplete').removeAttr('style') //get rid of annoying styling on box
    }

  })
  .data('ui-autocomplete')._renderItem = function( ul, item ) {
    var li = $( '<li class="list_item"><a>'+item.label+'</a></li>' )
    li.on('click', function() {
      item.play()
      toggleHeaderOff()
    })
    li.css('cursor', 'pointer')
    ul.append(li)
    return li
  }

  //animate through images
  var TIMEOUT_ID
  function animateThroughImages() {
    imageResults.on('click', function() {
      toggleHeaderDiv()
    })
    clearTimeout(TIMEOUT_ID)
    function animate() {
      //updateUI()
      var img = allImages.shift()
      img.css('opacity', 0.0)
      imageResults.empty()
      imageResults.append(img)
      img.animate({opacity:1.0, duration:getTempoTransitionTime()}, function() {
        TIMEOUT_ID = setTimeout(animate, getTempoTimeBetweenImages())
      })
    }
    animate()
  }

  function toggleHeaderOff() {
    var opacity = parseInt(headerDiv.css('opacity'), 10)
    if (opacity > 0) headerDiv.animate({opacity : 0.0}, 350)
  }
  function toggleHeaderOn() {
    //if (!headerDiv.is(':visible')) headerDiv.toggle()
  }

  function toggleHeaderDiv() {
    var opacity = parseInt(headerDiv.css('opacity'), 10)
      , newOp
    if (opacity > 0) newOp = 0.0
    else newOp = 1.0
    headerDiv.animate({opacity : newOp}, 350)
  }

  function setfocus() {
    setTimeout(function(){window.scrollTo(0, 1)},100);
    setTimeout(function(){document.getElementById("project").focus()},200);
  }
  setfocus()


})})

