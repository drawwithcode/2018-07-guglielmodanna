/* Rest In Peace. You'll Awlays Be My Brother. */

var mic;
var portraitMode;

var started = false;

var stage;
var blush;

var one;
var two;
var three;
var four;

var pleasureLevel;
var climaxHappened = false;

function preload() {
  one = loadImage("assets/1.png");
  two = loadImage("assets/2.png");
  three = loadImage("assets/3.png");
  four = loadImage("assets/4.png");
  oneBlush = loadImage("assets/1-blush.png");
  twoBlush = loadImage("assets/2-blush.png");
  threeBlush = loadImage("assets/3-blush.png");
  fourBlush = loadImage("assets/4-blush.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (width < height) {
    portraitMode = true;
  } else {
    portraitMode = false;
  }



  stage = one;

  pleasureLevel = new PleasureLevel(height*0.0185, height*0.0185, width/2, height-10);

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {

  background(255);

  fill(242, 206, 230);
  rect(0, height,width,pleasureLevel.position.y+pleasureLevel.height/2-height);

  if (pleasureLevel.position.y < 0) {
    stage = four;
    blush = fourBlush;
  } else if (pleasureLevel.position.y < height/3) {
    stage = three;
    blush = threeBlush;
  } else if (pleasureLevel.position.y < height/3*2) {
    stage = two;
    blush = twoBlush;
  } else {
    stage = one;
    blush = oneBlush;
  }

  if (portraitMode) {
    image(stage,
      0,
      (height-(width*stage.height/stage.width))/2,
      width,
      width*stage.height/stage.width);
  } else {
    image(stage,
      (width-(height*stage.width/stage.height))/2,
      0,
      height*stage.width/stage.height,
      height);
  }

  if (pleasureLevel.velocity.y < -1 || pleasureLevel.position.y < 0) {
    if (portraitMode) {
      image(blush,
        0,
        (height-(width*stage.height/stage.width))/2,
        width,
        width*stage.height/stage.width);
    } else {
      image(blush,
        (width-(height*stage.width/stage.height))/2,
        0,
        height*stage.width/stage.height,
        height);
    }
  }


  var drop;
  if (!climaxHappened) {
    drop = createVector(0, 0.05*pleasureLevel.decrease);
  } else {
    drop = createVector(0,0);
  }
  var vol = mic.getLevel();

  var pleasure = createVector(0,-vol*pleasureLevel.decrease*0.1);

  pleasureLevel.applyForce(pleasure);
  pleasureLevel.applyForce(drop);

  pleasureLevel.update();
  pleasureLevel.display();
  pleasureLevel.checkEdges();

  if (!started) {
    background(0);

    fill(255);

    if (width < 375) {
      textSize(12);
    } else if (width < 500) {
      textSize(16);
    } else {
      textSize(20);
    }

    textFont("Bree Serif");
    textAlign(CENTER);
    text("Press against your device's microphone and rub it", width/2, height/2);

    textSize(12);
    textFont("sans-serif");
    text("Original drawings by Milo Manara", width/2, height-22);
  }

  if (pleasureLevel.velocity.y < -1 || pleasureLevel.position.y < 0) {
    console.log(started);
    started = true;
  }
}

function PleasureLevel(w,h,x,y) {
  this.decrease = 200;
  this.width = w;
  this.height = h;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);
}

PleasureLevel.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force,this.decrease);
  this.acceleration.add(f);
};

PleasureLevel.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
};

PleasureLevel.prototype.display = function() {
  noStroke();
  fill(0,0,0,0);
  ellipse(this.position.x,this.position.y,this.width,this.height);
};

// Bounce off bottom of window
PleasureLevel.prototype.checkEdges = function() {
  if (this.position.y > (height-this.height/2)) {
    this.velocity.y *= -0.01;
    this.position.y = height-this.height/2;
  } else if (this.position.y < -this.height/2) {
    this.velocity.y = 0;
    this.position.y = -this.height/2;
    climaxHappened = true;
  }
};
