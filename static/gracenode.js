var tempoTiming = 1000;

var getTrackMood = function(cb) {
  var url = "http://mhd.gracenote.io";
  url += "/artist/" + encodeURIComponent(getCurrentArtist());
  url += "/track/" + encodeURIComponent(getCurrentTrackName());
  
  $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(results){
        trackData = extractRelevantTrackData(results);
        tempoTiming = getTempoTiming(trackData["tempo"])
        cb({"mood": trackData["mood"], "tempo": tempo})
      }
  });
};

window.getTempo = function() {
  return tempoTiming;
}

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
  } else {
    return 1000;
  }
}