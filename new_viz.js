window.onload = function() {
  
  var file = document.getElementById("music_file");
  var audio = document.getElementById("audio");
  
  file.onchange = function() {
    //Keep all of these variables from original code
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    //This is all good
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      var avg_freq = dataArray.reduce((previous, current) => current += previous) / dataArray.length;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.arc(WIDTH/2, HEIGHT/2, avg_freq, 0, 2 * Math.PI);
      ctx.strokeStyle = "red";
      ctx.stroke();
    }

    audio.play();
    renderFrame();
  };
};