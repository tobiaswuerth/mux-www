export const getBestMatchingTrack = function(data) {
  if (!data || 1 > data.length) {
    return null;
  }
  
  // sum them up
  let scores = {};
  for (let d of data) {
    let score = d.Score;
    if (score === 1.0) {
      // perfect match
      return {track: d.Track, match: d.Score};
    }
    
    let track = d.Track;
    let id = track.UniqueId;
    
    let entry = scores[id];
    if (null == entry) {
      scores[id] = {
        count: 1, sum: score, object: d,
      };
      continue;
    }
    
    entry.count++;
    entry.sum += score;
  }
  
  // calculate mean for each
  let means = Object.keys(scores).map(id => {
    let calcObj = scores[id];
    return {
      id: id, mean: (calcObj.sum / calcObj.count).toFixed(6),
    };
  });
  
  let bestGuess = means.sort((a, b) => a.mean < b.mean ? 1 : -1)[0];
  
  return {
    track: scores[bestGuess.id].object.Track, match: bestGuess.mean,
  };
};

export const getCurrentPlaylistEntryTimeMs = function(entry) {
  let now = new Date();
  let pausedAt = entry.pausedAt || now;
  pausedAt = pausedAt.getTime();
  let startedAt = entry.startedAt || now;
  startedAt = startedAt.getTime();
  return Math.abs(pausedAt - startedAt);
};
