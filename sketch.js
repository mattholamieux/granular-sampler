let player;
let scl = 100;
let scl2 = 50;
let scl4 = 25;
let isTriggered = false;
let samp;
let reverb, delay, chorus, compressor, filter;
let dropzone;
let sound;
let detuneSliderVal = 0;
let grainSizeSliderVal = 0.5;
let overlapSliderVal = 0.1;
let rateSliderVal = 1;
let startSliderVal = 0;
let endSliderVal = 1;
let sampDuration;


function preload() {
  samp = loadSound('loops/loop0.wav');
}

function setup() {
  dropzone = select('#dropZone');
  noCanvas();
  initFX();
  frameRate(30);
  cnv = createCanvas(windowWidth, 50);
  player = new Player();
  player.loadSamp(samp.url);
  player.player.chain(delay,filter);
  player.settings();
  dropzone.drop(gotFile);
  sampDuration = samp.buffer.duration;
  endSliderVal = sampDuration;
}

// JQUERY STuFfs
$( function() {
  // dropzone = $('#dropZone');
  let $detuneSlider = $( "#detuneSlider" ).slider({
    max: 1200,
    min: -1200
  });
  let $grainSizeSlider = $('#grainSizeSlider').slider({
    max: 2,
    min: 0.01,
    step: 0.01,
    value: 0.5
  });
  let $overlapSlider = $('#overlapSlider').slider({
    max: 2,
    min: 0.01,
    step: 0.01,
    value: 0.1
  });
  let $rateSlider = $('#rateSlider').slider({
    max: 2,
    min: 0.000001,
    step: 0.125,
    value: 1
  });
  let $startSlider = $('#startSlider').slider({
    max: 1,
    min: 0,
    step: 0.01,
    value: 0
  });
  let $endSlider = $('#endSlider').slider({
    max: 4,
    min: 0,
    step: 0.01,
    value: 4
  });
  $($detuneSlider).on('slide', function(){
    detuneSliderVal = ($($detuneSlider).slider('value'));
    player.settings();
  });
  $($grainSizeSlider).on('slide', function(){
    grainSizeSliderVal = ($($grainSizeSlider).slider('value'));
    player.settings();
  });
  $($overlapSlider).on('slide', function(){
    overlapSliderVal = ($($overlapSlider).slider('value'));
    player.settings();
  });
  $($rateSlider).on('slide', function(){
    rateSliderVal = ($($rateSlider).slider('value'));
    player.settings();
  });
  $($startSlider).on('slide', function() {
    $($startSlider).slider( "option", "max", sampDuration );
    startSliderVal = ($(startSlider).slider('value'));
    player.settings();
  });
  $($endSlider).on('slide', function() {
    $($endSlider).slider( "option", "max", sampDuration);
    endSliderVal = ($(endSlider).slider('value'));
    player.settings();
  });
  $('#checkbox-1').on('click', function(){
    if($(this).is(":checked")){
      player.player.reverse = true;
    } else {
      player.player.reverse = false;
    }
  })
});

function draw() {
  background(200);
}

function mousePressed() {
  player.start();
}

class Player {
  constructor() {
    this.player = new Tone.GrainPlayer();
  }

  settings() {
    this.player.playbackRate = rateSliderVal;
    this.player.detune = detuneSliderVal;
    this.player.grainSize = grainSizeSliderVal;
    this.player.overlap = overlapSliderVal;
    this.player.loop = true;
    this.player.loopStart = startSliderVal;
    this.player.loopEnd = endSliderVal;
    this.player.reverse = false;
  }

  start() {
    this.player.start();
  }

  stop() {
    this.player.stop();
  }

  loadSamp(s) {
    this.player.buffer.load(s);
  }

}


function initFX() {
  compressor = new Tone.Compressor({
    ratio: 12,
    threshold: -24,
    release: 0.25,
    attack: 0.003,
    knee: 30
  });
  compressor.connect(Tone.Master);
  reverb = new Tone.Freeverb().connect(compressor);
  delay = new Tone.PingPongDelay().connect(compressor);
  chorus = new Tone.Chorus().connect(compressor);
  filter = new Tone.Filter(1000, 'lowpass').connect(compressor);

  delay.wet.value = 1;
  delay.delayTime.value = "16n";
  delay.feedback.value = 0.5;
  reverb.wet.value = 0.5;
  reverb.roomSize.value = 0.2;
  reverb.dampening.value = 3000;
  chorus.frequency.value = 1;
  chorus.delayTime = 3;
  chorus.depth = 0.5;
}

function gotFile(file) {
  // console.log('got file');
  sound = loadSound(file.data, loadIt);
  // console.log(sound);
}

function loadIt() {
  player.loadSamp(sound.url);
  player.loopEnd = sound.buffer.duration;
}