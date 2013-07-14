
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


