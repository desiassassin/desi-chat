const dots = [];
let MAX_DOTS = 0;
const MAX_DISTANCE = 150;
const TARGET_DENSITY = 0.00018;

function setup() {
     createCanvas(windowWidth, windowHeight, P2D);
     MAX_DOTS = floor(width * height * TARGET_DENSITY);
     // create dots
     for (let i = 0; i < MAX_DOTS; i++) dots.push(new Dot());
}

function draw() {
     background(18, 22, 28);
     for (let i = 0; i < dots.length; i++) {
          dots[i].show();
          dots[i].update();
     }
}

function windowResized() {
     resizeCanvas(windowWidth, windowHeight);
     let NEW_MAX_DOTS = floor(width * height * TARGET_DENSITY);
     const difference = NEW_MAX_DOTS - MAX_DOTS;
     if (difference < 0) dots.splice(0, -difference);
     else {
          for (let i = 0; i < difference; i++) dots.push(new Dot());
     }
     MAX_DOTS = NEW_MAX_DOTS;
}

class Dot {
     constructor() {
          this.maxSpeed = 2;
          this.thickness = random(1, 10);
          this.pos = { x: random(width), y: random(height) };
          this.velocity = { x: random(-this.maxSpeed, this.maxSpeed), y: random(-this.maxSpeed, this.maxSpeed) };
          const variableSpeed = this.maxSpeed / 10;
          this.randomness = { x: random(-variableSpeed, variableSpeed), y: random(-variableSpeed, variableSpeed) };
     }

     show() {
          stroke(31, 163, 108);
          strokeWeight(this.thickness);
          point(this.pos.x, this.pos.y);
     }

     update() {
          // offscreen
          if (this.pos.x > width) this.pos.x = 0;
          else if (this.pos.x < 0) this.pos.x = width;
          else if (this.pos.y > height) this.pos.y = this.pos.x;
          else if (this.pos.y < 0) this.pos.y = height;

          // update position
          this.pos.x += this.velocity.x + this.randomness.x;
          this.pos.y += this.velocity.y + this.randomness.y;

          // parallax effect
          // this.pos.x += map(movedX, 0, width, 0, 100);
          // this.pos.y += map(movedY, 0, height, 0, 100);

          if (frameCount % 100 === 0) {
               const variableSpeed = this.maxSpeed / 5;
               this.randomness.x = random(-variableSpeed, variableSpeed);
               this.randomness.y = random(-variableSpeed, variableSpeed);
          }
     }
}
