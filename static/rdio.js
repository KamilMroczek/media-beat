
R.ready(function() {
  console.log('rdio is ready')
  if (!R.authenticated()){
    console.log('attempting to authenticate rdio')
    R.authenticate()
  }
})

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
      var obj = {
        label : itm.name +  ' [' + (itm.type ? itm.type : '') + ']'
      }
      obj.value = function() {
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


