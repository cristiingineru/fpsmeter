

RAFMeter = function () {

  var displayNode,
      curentTime,
      previousTime = Date.now(),
      previousDisplayTime = 0,
      maxDurationCount = 20,
      durations = [],
      displayInterval = 500;


  var tick = function() {
    curentTime = Date.now();

    if (durations.length === maxDurationCount) {
      durations.shift();
    }
    durations.push(curentTime - previousTime);

    display(durations);

    previousTime = curentTime;
    requestAnimationFrame(tick);
  };


  var display = function(durations) {
    var duration = durations.reduce(sum, 0),
        meanDuration = duration / durations.length,
        fps = (1000 / meanDuration).toFixed(1),
        message = fps + ' fps',
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
        displayNode = document.createTextNode('x fps');

        var para = document.createElement('p');
        para.className = 'rafMeter';
        para.appendChild(displayNode);

        insertFirst(target, para);
    }
    return displayNode;
  };


  requestAnimationFrame(tick);
}

if (typeof exports !== 'undefined' && module.exports) {
  module.exports = RAFMeter;
} else {
  window.rafMeter = new RAFMeter();
}
