

FPSMeter = function () {

  var textNode,
      paused = false,
      previousTime = Date.now(),
      maxDurationCount = 20,
      durations = [];


  var tick = function() {
    var curentTime = Date.now(),
        duration = curentTime - previousTime;

    if (durations.length === maxDurationCount) {
      durations.shift();
    }
    durations.push(duration);

    display(durations);

    previousTime = curentTime;
    if (!paused) {
      requestAnimationFrame(tick);
    }
  };


  var display = function(durations) {
    var duration = durations.reduce(sum, 0),
        meanDuration = duration / durations.length,
        fps = Math.round(1000 / meanDuration),
        message = fps + ' fps';
    if (textNode) {
      textNode.nodeValue = message;
    } else {
      console.log(message);
    }
  };


  var sum = function(a, b) {
    return a + b;
  };


  this.display = function(target) {
    target = target || document.body;

    textNode = document.createTextNode('x fps');

    var para = document.createElement('p');
    para.className = 'fpsMeter';
    para.appendChild(textNode);

    target.appendChild(para);
  };


  this.pause = function() {
    paused = true;
  }


  requestAnimationFrame(tick);
}

window.fpsMeter = new FPSMeter();
