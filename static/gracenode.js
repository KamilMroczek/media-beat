// getLyrics = function(artist, song) {
//   // var url = "http://lyrics.wikia.com/api.php?fmt=json";
//   //   url += "&artist=" + encodeURIComponent(artist);
//   //   url += "&song=" + encodeURIComponent(song);
//   // http://lyrics.wikia.com/api.php?fmt=text&artist=Stone%20Temple%20Pilots&song=Creep
//   
//   var url = "http://api.musixmatch.com/ws/1.1/?";
//   url += "apikey=3170550c6b5932906ca57a9a14d72334";
//   url += "&q_artist=" + encodeURIComponent(artist);
//   url += "&q_track=" + encodeURIComponent(song);
//   
//   alert(url);
//   $.ajax({
//       url: url,
//       dataType: 'jsonp',
//       success: function(results){
//         alert('Worked!');
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) { 
//           alert("Status: " + textStatus); alert("Error: " + errorThrown); 
//       }
//   });
// }

getTrackMood = function(cb) {
  var url = "http://mhd.gracenote.io";
  url += "/artist/" + encodeURIComponent(getCurrentArtist());
  url += "/track/" + encodeURIComponent(getCurrentTrackName());
  
  $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(results){
        trackData = extractRelevantTrackData(results);
        tempo = getTempoTiming(trackData["tempo"])
        cb({"mood": trackData["mood"], "tempo": tempo})
      }
  });
};

extractRelevantTrackData = function(results) {
  var trackData = {}
  if(results) {
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

getTempoTiming = function(tempo) {
  if(tempo == "Slow Tempo") {
    return 3000;
  } else if(tempo == "Medium Tempo") {
    return 1500;
  } else if(tempo == "Fast Tempo") {
    return 750;
  }
}

// $(document).ready(function() {
//   // getTrackMood("Nirvana", "Smells Like Teen Spirit");
//   getTrackMood("Sandro Silva", "Epic");
// });