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

    var radii_low = [];
    var radii_lowmid = [];
    var radii_mid = [];
    var radii_midhigh = [];
    var radii_high = [];
    for (var i = 0; i < 5; i++) {
      radii_low.push(0);
      radii_lowmid.push(0);
      radii_mid.push(0);
      radii_midhigh.push(0);
      radii_high.push(0);
    }

    circle_count = 0
    function renderFrame() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      radii_low[circle_count] = dataArray.slice(0, bufferLength/5).reduce((previous, current) => current += previous) / dataArray.length;
      radii_lowmid[circle_count] = dataArray.slice(bufferLength/5, 2*bufferLength/5).reduce((previous, current) => current += previous) / dataArray.length;
      radii_mid[circle_count] = dataArray.slice(2*bufferLength/5, 3*bufferLength/5).reduce((previous, current) => current += previous) / dataArray.length;
      radii_midhigh[circle_count] = dataArray.slice(3*bufferLength/5, 4*bufferLength/5).reduce((previous, current) => current += previous) / dataArray.length;
      radii_high[circle_count] = dataArray.slice(4*bufferLength/5, bufferLength).reduce((previous, current) => current += previous) / dataArray.length;

      for (var i = 0; i < 5; i++) {
        //Draw low
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(WIDTH/2, HEIGHT/2, 5*radii_low[i], 0, 2 *Math.PI);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.closePath();

        //Draw lowmid
        ctx.beginPath();
        ctx.arc(WIDTH/2, HEIGHT/2, 5*radii_lowmid[i], 0, 2 *Math.PI);
        ctx.strokeStyle = "purple";
        ctx.stroke();
        ctx.closePath();

        //Draw mid
        ctx.beginPath();
        ctx.arc(WIDTH/2, HEIGHT/2, 5*radii_mid[i], 0, 2 *Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();

        //Draw midhigh
        ctx.beginPath();
        ctx.arc(WIDTH/2, HEIGHT/2, 5*radii_midhigh[i], 0, 2 *Math.PI);
        ctx.strokeStyle = "pink";
        ctx.stroke();
        ctx.closePath();

        //Draw high
        ctx.beginPath();
        ctx.arc(WIDTH/2, HEIGHT/2, 5*radii_high[i], 0, 2 *Math.PI);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
      }

      circle_count += 1;
      if (circle_count == 5){
        circle_count = 0;
      }

    }

    audio.play();
    renderFrame();
  };
};