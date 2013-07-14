
/*global
  $ : true,
  console : true
*/


$(document).ready(function () {

	var searchForm = $('#search_form')
    , searchBox = $('#search_box')
    , resultsDiv = $('#search_results')
    , previousTxt = ''

  setInterval(function() {
    var txt = searchBox.val()
    if (!txt || txt === previousTxt) return
    resultsDiv.empty()
    previousTxt = txt
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

  }, 400)

	function submitForm(ev) {
    var searchTerm = $('#search_box').val()
    rdioSearch(searchTerm, function(res) {
      res.forEach(function(itm) {
        var div = $('<div style="cursor:pointer;">' + itm.name + '</div>')
        div.on('click', function() {
          console.log('playing: ', itm.name)
          R.player.play({source : itm.key})
        })
        $('body').append(div)
      })
    })

    ev.preventDefault()
  }

	searchForm.on('submit', submitForm);
})

