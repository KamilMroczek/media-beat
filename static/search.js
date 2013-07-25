
/*global
  $ : true,
  console : true,
  R : true, document:true, getImages:true, getCurrentArtist:true, rdioRealtimeSearch:true, window:true, getCurrentTrackName:true
*/


$(document).ready(function () { R.ready(function() {
  var playPause = $('#play_pause')
    , imageResults = $('#image_results')
    , headerDiv = $('#header_div')
    , searchBar = $('#search_bar')
    , devStatus = $('#dev-status')
    , visualGrooveTitle = $('#visual_groove_title')
    , arrowUp = $('#arrow_up')
    , arrowDown = $('#arrow_down')
    , arrowImage = $('#arrow_image')
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
        img.htmlElement = $('<img src="'+img.url+'" class="displayed_image"></img>')
        allImages.push(img)
      })
      toggleHeaderOff()
      resumeSlideshow()
      if (isPaused()) pauseSlideshow() //only show first image if paused
    })
  }

  R.player.on('change:playingSource', function() {
    console.log('playing source changed')
    updateUI()
  })

  R.player.on('change:playingTrack', function() {
    console.log('playing track changed')
    loadImages()
    updateUI()
  })

  R.player.on('change:playState', function() {
    updateUI()
    if (isPaused()) {
      pauseSlideshow()
    } else if (isPlaying()) {
      resumeSlideshow()
    }
  })

  function updateUI() {
    var description = ' ::: ' + getCurrentArtist() + ' ::: ' + getCurrentTrackName()
    if (isPaused()) {
      playPause.html('Play' + description)
    } else if (isPlaying()) {
      playPause.html('Pause' + description)
    }
    updateArrowImage()
  }
  function updateArrowImage() {
    if (headerIsMaximized()){ //point up
      arrowUp.css('display', 'inline')
      arrowDown.css('display', 'none')
    } else { //point down
      arrowDown.css('display', 'inline')
      arrowUp.css('display', 'none')
    }
  }

  function isPaused() {
    return R.player.playState() === R.player.PLAYSTATE_PAUSED
  }
  function isPlaying() {
    return R.player.playState() === R.player.PLAYSTATE_PLAYING
  }

  playPause.on('click', function() {
    R.player.togglePause()
  })


  //autocomplete
  autocompleteObj = $("#search_bar").autocomplete({
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

  imageResults.on('click', toggleHeaderDiv)
  arrowImage.on('click', toggleHeaderDiv)
  $(document).on('click', toggleHeaderOn)

  //animate through images
  var TIMEOUT_ID
  function resumeSlideshow() {
    clearTimeout(TIMEOUT_ID)
    function animate() {
      var transitionTime = getTempoTransitionTime()

      //fade out current slide
      imageResults.animate({opacity:0.0, duration:transitionTime}, function() {
        var img = allImages.shift()
        if (!img) return

        imageResults.empty()
        imageResults.append(img.htmlElement)
        devStatus.html('image source:' + img.__webSource + ' type:' + img.__webType)
        //next slide
        imageResults.animate({opacity:1.0, duration:transitionTime})
      })
      TIMEOUT_ID = setTimeout(animate, getTempoTimeBetweenImages() + transitionTime*2.0)
    }
    animate()
  }

  function pauseSlideshow() {
    clearTimeout(TIMEOUT_ID)
    toggleHeaderOn()
    var opacity = parseInt(imageResults.css('opacity'), 10)
    if (opacity < 1) imageResults.animate({opacity : 1.0}, 350) //show whatever image there is
  }

  function toggleHeaderOff() {
    var opacity = parseInt(searchBar.css('opacity'), 10)
    if (headerIsMaximized()) toggleHeaderDiv()
    //var newOp = 0.0
    //  , btm = '' + playPause.offset().top*0.8 + 'px'

    //visualGrooveTitle.animate({opacity : newOp}, 350)
    //searchBar.animate({opacity : newOp}, 350)
    //headerDiv.animate({bottom : btm}, 350)
  }

  function toggleHeaderOn() {
    var opacity = parseInt(searchBar.css('opacity'), 10)
    if (headerIsMinimized()) toggleHeaderDiv()
    //var newOp = 1.0
    //  , btm = '0px'

    //visualGrooveTitle.animate({opacity : newOp}, 350)
    //searchBar.animate({opacity : newOp}, 350)
    //headerDiv.animate({bottom : btm}, 350)
  }
  function headerIsMaximized() {
    return parseInt(searchBar.css('opacity'), 10) === 1.0
  }
  function headerIsMinimized() {
    return parseInt(searchBar.css('opacity'), 10) === 0.0
  }

  var toggleHeaderDiv = (function() {
    var amAnimating = false
    return function () {
      if (amAnimating) return
      amAnimating = true
      var opacity = parseInt(headerDiv.css('opacity'), 10)
        , curBtm = parseInt(headerDiv.css('bottom'), 10)
        , newOp
        , btm
      //if (opacity > 0) {
      console.log('toggling header div')
      if (headerIsMaximized()) {
        newOp = 0.0
        btm = '' + playPause.offset().top*0.8 + 'px'
      } else {
        newOp = 1.0
        btm = '0px'
      }

      $('#visual_groove_title').animate({opacity : newOp}, 350)
      $('#search_bar').animate({opacity : newOp}, 350)
      headerDiv.animate({bottom : btm}, 350, function() {
        amAnimating = false
        updateArrowImage()
      })
    }
  })()

  function setfocus() {
    setTimeout(function(){window.scrollTo(0, 1)},100);
    setTimeout(function(){document.getElementById("search_bar").focus()},200);
  }
  setfocus()


})})

