

RAFMeter = function () {

  var displayNode,
      curentTime,
      previousTime = Date.now(),
      previousDisplayTime = 0,
      maxHistoryCount = 20,
      durations = [],
      rafCallCounts = [0],
      mozPaintCounts = [],
      displayInterval = 1000,
      originalRequestAnimationFrame = requestAnimationFrame;


  var tick = function() {
    curentTime = Date.now();

    if (durations.length === maxHistoryCount) {
      durations.shift();
      mozPaintCounts.shift();
    }
    durations.push(curentTime - previousTime);
    mozPaintCounts.push(window.mozPaintCount);

    display(durations, rafCallCounts);

    if (rafCallCounts.length === maxHistoryCount) {
      rafCallCounts.shift();
    }
    rafCallCounts.push(0);

    previousTime = curentTime;
    originalRequestAnimationFrame(tick);
  };


  var display = function(durations, rafCallCounts) {
    var duration = durations.reduce(sum, 0),
        meanDuration = duration / durations.length,
        meterRafCallsPerSec = (1000 / meanDuration).toFixed(1),
        appRafCalls = rafCallCounts.reduce(function(total, count){return total+count;}, 0),
        appRafCallsPerSec = (1000 * appRafCalls / duration).toFixed(1),
        mozFrames = mozPaintCounts[mozPaintCounts.length - 1] - mozPaintCounts[0],
        browserFps = (1000 * mozFrames / duration).toFixed(1);
        message = 'spied raf calls / sec: ' + appRafCallsPerSec + '<br />' +
                  'meter raf calls / sec: ' + meterRafCallsPerSec + '<br />' +
                  'browser frames / sec: ' + browserFps,
        elapsedTimeSinceLastDisplay = curentTime - previousDisplayTime;
    if (!displayNode) {
      displayNode = tryCreateDisplayNode();
    }
    if (displayNode && (elapsedTimeSinceLastDisplay > displayInterval)) {
      displayNode.innerHTML = message;
      previousDisplayTime = curentTime;
    }
  };


  var sum = function(a, b) {
    return a + b;
  };


  var insertFirst = function(parent, newChild) {
    if (parent.firstChild) {
      parent.insertBefore(newChild, parent.firstChild);
    } else {
      parent.appendChild(newChild);
    }
  };


  var tryCreateDisplayNode = function() {
    var target = document.body, displayNode;
    if (target) {
        displayNode = document.createElement('div');
        displayNode.className = 'rafMeter';

        insertFirst(target, displayNode);
    }
    return displayNode;
  };


  var fakeRequestAnimationFrame = function(fn) {
    rafCallCounts[rafCallCounts.length - 1] += 1;
    originalRequestAnimationFrame(fn);
  };


  requestAnimationFrame(tick);
  requestAnimationFrame = fakeRequestAnimationFrame;
}


if (typeof exports !== 'undefined' && module.exports) {
  module.exports = RAFMeter;
} else {
  window.rafMeter = new RAFMeter();
}
