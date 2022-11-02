const dots = [];
const MAX_DOTS = 50;
const MAX_DISTANCE = 150;

function setup() {
     createCanvas(windowWidth, windowHeight);
     stroke(255);

     for (let i = 0; i < MAX_DOTS; i++) {
          if (i === 0) dots.push(new Dot(true));
          else dots.push(new Dot());
     }
}

function draw() {
     background(18, 22, 28);

     for (const dot of dots) {
          dot.update();
          dot.show(dots);
     }
}

function windowResized() {
     resizeCanvas(windowWidth, windowHeight);
}

// Dot class
class Dot {
     constructor(userControlled = false) {
          const maxSpeed = 2;
          this.userControlled = userControlled;
          this.pos = userControlled ? createVector(mouseX, mouseY) : createVector(random(width), random(height));
          this.velocity = userControlled ? createVector(0, 0) : createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed));
          this.thickness = userControlled ? 5 : random(1, 5);
     }

     show(dots) {
          stroke(255);
          strokeWeight(this.thickness);
          point(this.pos.x, this.pos.y);

          for (const dot of dots) {
               const distance = dist(this.pos.x, this.pos.y, dot.pos.x, dot.pos.y);

               // if distance is less than MAX_DISTANCE, connect them through a line.
               if (distance <= MAX_DISTANCE) {
                    const opacity = map(distance, MAX_DISTANCE, 0, 40, 255);
                    strokeWeight(0.5);
                    stroke(opacity);
                    line(this.pos.x, this.pos.y, dot.pos.x, dot.pos.y);
               }
          }
     }

     update() {
          // if the dot is controlled by the user, just change it's X and Y.
          if (this.userControlled) {
               this.pos.x = mouseX;
               this.pos.y = mouseY;
               return;
          }

          // offscreen
          if (this.pos.x > width) this.pos = createVector(0, this.pos.y);
          else if (this.pos.x < 0) this.pos = createVector(width, this.pos.y);
          else if (this.pos.y > height) this.pos = createVector(this.pos.x, 0);
          else if (this.pos.y < 0) this.pos = createVector(this.pos.x, height);

          this.pos.add(this.velocity);
     }
}
