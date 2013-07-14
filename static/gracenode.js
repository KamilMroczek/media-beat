getArtistInfo = function(artist, song) {
  var url = "http://mhd.gracenote.io";
  url += "/artist/" + encodeURIComponent(artist);
  url += "/track/" + encodeURIComponent(song);
  
  $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(results){
        trackData = extractRelevantTrackData(results, artist, song);
        $('#artist').append(trackData["artist"]);
        $('#song').append(trackData["song"]);
        $('#mood').append(trackData["mood"]);
        $('#tempo').append(trackData["tempo"]);
      }
  });
};

extractRelevantTrackData = function(results, artist, song) {
  var trackData = {}
  if(results) {
    trackData["song"] = song
    trackData["artist"] = artist
    if(results["mood"] && results["mood"]["1"]) {
      trackData["mood"] = results["mood"]["1"]["TEXT"];
    } else {
      alert("no mood!");
    }
    if(results["tempo"] && results["tempo"]["1"]) {
      trackData["tempo"] = results["tempo"]["1"]["TEXT"];
    } else {
      alert("no tempo!");
    }
  } else {
    alert("results is null!");
  }
  
  return trackData;
};

$(document).ready(function() {
  getArtistInfo("Stone Temple Pilots", "Creep");
});