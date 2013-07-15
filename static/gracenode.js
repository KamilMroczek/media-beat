var tempoTiming = 3000
  , transitionTiming = 350

var getTrackMood = function(cb) {
  var url = "http://mhd.gracenote.io";
  url += "/artist/" + encodeURIComponent(getCurrentArtist());
  url += "/track/" + encodeURIComponent(getCurrentTrackName());

  $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(results){
        var trackData = extractRelevantTrackData(results);
        tempoTiming = getTempoTiming(trackData["tempo"])
        transitionTiming = getTempoTransitionTime()
        console.log('gracenode -> time-between-photos: %s  transition-time: %s', tempoTiming, transitionTiming)
        cb({"mood": trackData["mood"], "tempo": tempoTiming})
      }
  });
};

window.getTempoTimeBetweenImages = function() {
  return tempoTiming;
}
window.getTempoTransitionTime = function() {
  return transitionTiming
}


function extractRelevantTrackData(results) {
  var trackData = {}
  if(results) {
    if(results["mood"] && results["mood"]["1"]) {
      trackData["mood"] = results["mood"]["1"]["TEXT"];
    } else {
      console.log("no mood!");
    }
    if(results["tempo"] && results["tempo"]["1"]) {
      trackData["tempo"] = results["tempo"]["1"]["TEXT"];
    } else {
      console.log("no tempo!");
    }
  } else {
    console.log("results is null!");
  }

  return trackData;
};

function getTempoTiming(tempo) {
  if(tempo == "Slow Tempo") {
    return 6000;
  } else if(tempo == "Medium Tempo") {
    return 3000;
  } else if(tempo == "Fast Tempo") {
    return 1800;
  } else {
    return 3000;
  }
}
function getTempoTransitionTime(tempo) {
  if(tempo == "Slow Tempo") {
    return 700;
  } else if(tempo == "Medium Tempo") {
    return 350;
  } else if(tempo == "Fast Tempo") {
    return 150;
  } else {
    return 350;
  }
}

