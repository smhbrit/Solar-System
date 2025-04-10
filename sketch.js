class Character {
  constructor(name, x, y, imageSet) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sizex = 100;
    this.sizey = 100;
    this.velocityY = 0;
    this.gravity = 1.2;
    this.isJumping = false;
    this.isAttacking = false;
    this.isBlocking = false;
    this.isCharging = false;
    this.isHit = false;
    this.state = "idle";
    this.sprites = imageSet;
  }

  move(rightKey, leftKey) {
    if (this.isAttacking || this.isBlocking || this.isCharging) return;

    let leftBoundary = 0;
    let rightBoundary = 800 - this.sizex;

    if (keyIsDown(rightKey) && this.x < rightBoundary) {
      this.x += 15;
      if (!this.isJumping) this.state = 'right'; 
    } else if (keyIsDown(leftKey) && this.x > leftBoundary) {
      this.x -= 12;
      if (!this.isJumping) this.state = 'left';
    } else if (!this.isJumping && !this.isAttacking && !this.isBlocking && !this.isCharging) { 
      this.state = "idle";
    }
  }

  attack(attackKey) {
    if (keyIsDown(attackKey) && !this.isAttacking) {
      this.isAttacking = true;
      this.state = "attack";
      
      setTimeout(() => {
        this.isAttacking = false;
        if (!this.isJumping && !this.isBlocking && !this.isCharging) {
          this.state = "idle";
        }
      }, 350);
    }
  }

  display() { 
    if (this.name === "Blossom") {
      this.sizex = 80;
      this.sizey = 115;
    }

    if (this.isHit) {
      image(this.sprites.getHit, this.x, this.y, this.sizex, this.sizey);
    } else if (this.sprites[this.state]) {
      image(this.sprites[this.state], this.x, this.y, this.sizex, this.sizey);
    }
  }

  jump(jumpKey) {
    if (!this.isJumping && keyIsDown(jumpKey)) {
      this.velocityY = -15;
      this.isJumping = true;
      this.state = "jump";  
    }
  }

  applyGravity() {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.velocityY < 0 && !this.isAttacking && !this.isBlocking && !this.isCharging) {
      this.state = "jump";
    } else if (this.velocityY > 0 && this.isJumping && !this.isAttacking && !this.isBlocking && !this.isCharging) {
      this.state = "fall";
    }

    if (this.y >= 250) {
      this.y = 250;
      this.velocityY = 0;
      this.isJumping = false;
      if (!this.isAttacking && !this.isBlocking && !this.isCharging) {
        this.state = "idle";
      }
    }
  }

  collideWith(otherCharacter) {
    let left = this.x;
    let right = this.x + this.sizex;
    let top = this.y;
    let bottom = this.y + this.sizey;
    
    let otherLeft = otherCharacter.x;
    let otherRight = otherCharacter.x + otherCharacter.sizex;
    let otherTop = otherCharacter.y;
    let otherBottom = otherCharacter.y + otherCharacter.sizey;

    if (right > otherLeft && left < otherRight && bottom > otherTop && top < otherBottom) {
      if (this.isAttacking) {
        otherCharacter.isHit = true;
        setTimeout(() => otherCharacter.isHit = false, 500);
      }
    }
  }
}

let bubblesSprites = {};
let buttercupSprites = {};
let blossomSprites = {};
let map1;

function preload() {
  bubblesSprites.idle = loadImage('bubblesIdle.png');
  bubblesSprites.right = loadImage('bubblesWalkR.gif');
  bubblesSprites.left = loadImage('bubblesWalkL.gif');
  bubblesSprites.attack = loadImage('bubblesAttack.gif');
  bubblesSprites.jump = loadImage('bubblesJump.gif');
  bubblesSprites.fall = loadImage('bubblesJump.gif');
  bubblesSprites.getHit = loadImage('bubblesGethit.gif');
  
  buttercupSprites.idle = loadImage('buttercupIdle.png');
  buttercupSprites.left = loadImage('buttercupWalkL.gif');
  buttercupSprites.right = loadImage('buttercupWalkR.gif');
  buttercupSprites.attack = loadImage('buttercupTornado.gif');
  buttercupSprites.jump = loadImage('buttercupJump.gif');
  buttercupSprites.fall = loadImage('buttercupJump.gif');
  buttercupSprites.getHit = loadImage('buttercupGethit.gif');
  
  blossomSprites.idle = loadImage("blossomIdle.png");
  blossomSprites.left = loadImage("blossomWalkL.gif");
  blossomSprites.right = loadImage("blossomWalkR.gif");
  blossomSprites.attack = loadImage("blossomAttack.gif");
  blossomSprites.jump = loadImage("blossomJump.gif");
  blossomSprites.fall = loadImage("blossomJump.gif");
  blossomSprites.getHit = loadImage('blossomGethit.gif');

  map1 = loadImage('map.png');
}

let bubbles = new Character("Bubbles", 100, 250, bubblesSprites);
let buttercup = new Character("Buttercup", 200, 250, buttercupSprites);
let blossom = new Character("Blossom", 300, 250, blossomSprites);

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);
  image(map1, 0, 0, 800, 400);

  bubbles.move(RIGHT_ARROW, LEFT_ARROW);
  bubbles.attack(DOWN_ARROW);
  bubbles.display();
  bubbles.jump(UP_ARROW);
  bubbles.applyGravity();

  buttercup.move(76, 74);
  buttercup.attack(75);
  buttercup.display();
  buttercup.jump(73);
  buttercup.applyGravity();

  blossom.move(68, 65);
  blossom.attack(83);
  blossom.display();
  blossom.jump(87);
  blossom.applyGravity();

  bubbles.collideWith(buttercup);
  bubbles.collideWith(blossom);
  buttercup.collideWith(blossom);
}
