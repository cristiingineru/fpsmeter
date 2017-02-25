

RAFMeter = function () {

  var displayNode,
      curentTime,
      previousTime = Date.now(),
      previousDisplayTime = 0,
      maxHistoryCount = 20,
      durations = [],
      rafCallCounts = [0],
      displayInterval = 500,
      originalRequestAnimationFrame = requestAnimationFrame;


  var tick = function() {
    curentTime = Date.now();

    if (durations.length === maxHistoryCount) {
      durations.shift();
    }
    durations.push(curentTime - previousTime);

    display(durations, rafCallCounts);

    if (durations.length === maxHistoryCount) {
      durations.shift();
      rafCallCounts.shift();
    }
    rafCallCounts.push(0);

    previousTime = curentTime;
    originalRequestAnimationFrame(tick);
  };


  var display = function(durations, rafCallCounts) {
    var duration = durations.reduce(sum, 0),
        meanDuration = duration / durations.length,
        fps = (1000 / meanDuration).toFixed(1),
        rafWithCalls = rafCallCounts.reduce(function(total, count){return total+count;}, 0),
        rafCallsPerSec = (1000 * rafWithCalls / duration).toFixed(1),
        message = fps + ' fps, ' + rafCallsPerSec + ' raf/sec',
        elapsedTimeSinceLastDisplay = curentTime - previousDisplayTime;
    if (!displayNode) {
      displayNode = tryCreateDisplayNode();
    }
    if (displayNode && (elapsedTimeSinceLastDisplay > displayInterval)) {
      displayNode.nodeValue = message;
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
        displayNode = document.createTextNode('raf meter is gathering data...');

        var para = document.createElement('p');
        para.className = 'rafMeter';
        para.appendChild(displayNode);

        insertFirst(target, para);
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
