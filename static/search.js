
/*global
  $ : true,
  console : true
*/


$(document).ready(function () {

	var searchForm = $('#search_form');

	function submitForm(ev) {
    var searchTerm = $('#search_box').val()
    rdioSearch(searchTerm, function(res) {
      res.forEach(function(itm) {
        var div = $('<div style="cursor:pointer;">' + itm.name + '</div>')
        div.on('click', function() {
          console.log('playing: ', itm.name)
          R.player.play({source : itm.key})
        })
        $('body').after(div)
      })
    })

    ev.preventDefault()
  }

	searchForm.on('submit', submitForm);
})

