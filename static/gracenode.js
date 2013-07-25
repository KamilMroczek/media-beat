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
        var trackData = extractRelevantTrackData(results)
          , tempo = trackData.tempo
        console.log('gracenode tempo -> %s', tempo)
        tempoTiming = setTempoTime(tempo)
        transitionTiming = setTransitionTime(tempo)
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
  //console.log('gracenote results:%s', JSON.stringify(results))
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

function setTempoTime(tempo) {
  if(tempo == "Slow Tempo") {
    return 4500;
  } else if(tempo == "Medium Tempo") {
    return 2000;
  } else if(tempo == "Fast Tempo") {
    return 1100;
  } else {
    return 2000;
  }
}
function setTransitionTime(tempo) {
  if(tempo == "Slow Tempo") {
    return 500;
  } else if(tempo == "Medium Tempo") {
    return 300;
  } else if(tempo == "Fast Tempo") {
    return 120;
  } else {
    return 300;
  }
}

