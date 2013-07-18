/*global
  $ : true,
  console : true,
  R : true, document:true, getImages:true, getCurrentArtist:true, rdioRealtimeSearch:true, window:true, getCurrentTrackName:true
*/
R.ready(function() {
  console.log('rdio is ready')
  if (!R.authenticated()){
    console.log('attempting to authenticate rdio')
    R.authenticate()
  }
})

var types = {
    t : 'track'
  , a : 'album'
  , p : 'playlist'
}
function createLabel(itm) {
  var t = itm.type
    , track
    , artist
    , albumOrPlaylist

  if (t === 't') { //track
    track = itm.name
    artist = itm.artist
    albumOrPlaylist = itm.album
  } else if (t === 'a') { //album
    track = ''
    artist = itm.artist
    albumOrPlaylist = itm.name
  } else if (t === 'p') { //playlist
    track = ''
    artist = ''
    albumOrPlaylist = itm.name
  }

  return track + ' - ' + artist + ' - ' + albumOrPlaylist + ' - ' + '[' + types[t] + ']'
}

function makeReq(sQuery) {
  var req = {
    content : {
        query : sQuery
      , types : 'Album,Playlist,Track'
    }
    , error : function(e) { console.log('error in search ' + e) }
  }
  return req
}

function rdioRealtimeSearch(txtObj, cb) {
  if (!txtObj || !txtObj.term) return

  function handleSuccess(res) {
    var results = res.result
      , ret = []
    results.forEach(function(itm) {
      var obj = {}
      obj.label = createLabel(itm)
      obj.play = function() {
        R.player.play({source : itm.key})
      }
      ret.push(obj)
    })
    cb(ret)
  }

  var req = makeReq(txtObj.term)
  req.method = 'searchSuggestions'
  req.success = handleSuccess
  R.request(req)
}
window.rdioRealtimeSearch = rdioRealtimeSearch

function getCurrentArtist() {
  var currentTrack = R.player.playingTrack()
  if (currentTrack) {
    console.log("have a track")
    return currentTrack.get('albumArtist')
  }
  else {
    console.log("dont have a track")
    return ''
  }
}
window.getCurrentArtist = getCurrentArtist

function getCurrentTrackName() {
  var currentTrack = R.player.playingTrack()
  if (currentTrack) return currentTrack.get('name')
  else return ''
}
window.getCurrrentTrackName = getCurrentTrackName


