
R.ready(function() {
  console.log('rdio is ready')
  if (!R.authenticated()) R.authenticate()
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

function rdioSearch (txt, cb) {
  function handleSuccess(res) {
    console.log('search response: ' + res)
    //var album = res.result.results[0]
    //console.log('playing album: ' + album.name)
    //R.player.play({source : album.key})
    cb(res.result.results)
  }

  var req = makeReq(txt)
  req.method = 'search'
  req.success = handleSuccess

  R.request(req)
}
window.rdioSearch = rdioSearch

function rdioRealtimeSearch(txt, cb) {
  function handleSuccess(res) {
    var results = res.result
      , ret = []
    results.forEach(function(itm) {
      var obj = {
        name : itm.name
      }
      obj.play = function() {
        R.player.play({source : itm.key})
      }
      ret.push(obj)
    })
    cb(ret)
  }

  var req = makeReq(txt)
  req.method = 'searchSuggestions'
  req.success = handleSuccess
  R.request(req)
}
window.rdioRealtimeSearch = rdioRealtimeSearch


