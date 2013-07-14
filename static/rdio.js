R.ready(function() {
  console.log('rdio is ready')
  if (!R.authenticated()) R.authenticate()
})
function rdioSearch (sQuery, cb) {

  function handleSuccess(res) {
    console.log('search response: ' + res)
    var album = res.result.results[0]
    console.log('playing album: ' + album.name)
    R.player.play({source : album.key})
    cb(res.result.results)
  }

  var req = {
    method : 'search'
    , content : {
        query : sQuery
      , types : 'Album,Playlist,Track'
    }
    , success : handleSuccess
    , error : function(e) {
      console.log('error in search ' + e)
    }
  }

  R.request(req)
}
window.rdioSearch = rdioSearch
