let allEnemies = [];
let allGems = [];
let score = 20;

const scoreEl = document.getElementById('score');
//step - 101
const xOptions = [0, 101, 202, 303, 404];
//step - 83
const yOptions = [400, 317, 234, 151, 68, -15];
const yOptionsForGems = [0, 0, 284, 201, 118, 0];
const positionX = randomInteger(0, 4);
const positionY = randomInteger(2, 4);

const gameOver = document.querySelector('.gameOver');
const restartButton = document.querySelector('.restartButton');
const restartAfterGameover = document.getElementById('restartAfterGameover');
const restartAfterWin = document.getElementById('restartAfterWin');
const congratMessage = document.querySelector('.congratMessage');
const scoreCount = document.getElementById('scoreCount');

//Give random numbers between min and max
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
};

//Give random integer numbers between min and max
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

//////Constructor for music
function Sound(src) {
    // debugger
    this.sound = document.createElement("audio");
    this.sound.src = src;
    // document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
};

const myMusic = new Sound("music/portal.mp3");
const myGemCollect = new Sound("music/gemCollect.mp3");
const myWin = new Sound("music/win.mp3");
const myWater = new Sound ("music/water.mp3");
const myOuch = new Sound("music/ouch.mp3");
const myGameover = new Sound("music/gameover.mp3");

///TODO - Set generic class "Entity" so that Enemy, Player, 
//future Gems could inherit from it

//ENTITY///////////////////////////////////

class Entity {
    //constructor for Entity
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
    // Draw the Entity on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

///ENEMY CLASS////////////////////////////////

class Enemy extends Entity {
    //constructor for Enemy
    constructor(x, y, sprite, speed) {
        super(x, y, sprite, speed);
        this.speed = speed;
    }

    //Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt) {
        this.x = this.x + this.speed * dt;
        if(this.x > canvas.width) {
        this.x = getRandomArbitary(-1000, -50);
        }
    }
}
///////////////////////////////////////////////////////////////////////

//Create preliminary array for enemies - constructor for multiple enemies
const Enemies = function () {
    this.preliminaryEnemiesArray = [];
};

//Update allEnemies array by transferring enemies from preliminary array 
//with random speed and Y-position on the pavement
Enemies.prototype.create = function (num) {
    for(let i = 0; i < num; i++) {
        // debugger
        const speed = getRandomArbitary(50, 300);
        const position = randomInteger(2, 4);
        this.preliminaryEnemiesArray[allEnemies.length] = new Enemy(-100, yOptions[position], 'images/enemy-bug.png', speed);
        allEnemies.push(this.preliminaryEnemiesArray[allEnemies.length]);
    }
};

//Clear all enemies
Enemies.prototype.reset = function() {
    allEnemies = [];
};

const enemies = new Enemies();

//// PLAYER CLASS//////////////////////////////////////////

class Player extends Entity {
    //constructor for Player
    constructor(x, y, sprite) {
        super(x, y, sprite);
    }

    //Update Player position
    update() {
        this.xNow = this.x;
        this.yNow = this.y;
    }

    //Return Player to start position
    reset() {
        this.x = 203;
        this.y = 400;
    }

    //Return Player to the bottom grass to random position
    returnToStart() {
    const position = randomInteger(0, 4);
    this.x = xOptions[position];
    this.y = 400;
    }

    //Move player after keys are pressed and 
    //prevent Player to move out of the canvas
    handleInput(pressedKey) {
        if (pressedKey === 'left' && this.x >= 101) {
            this.x -= 101;
        }
        if (pressedKey === 'up' && this.y >= 68) {
           this.y -= 83;
        }
        if (pressedKey === 'right' && this.x <= 304) {
            this.x += 101;
        }
        if (pressedKey === 'down' && this.y <= 317) {
            this.y += 83;
        }
    }
}

const player = new Player(203, 400, 'images/char-cat-girl.png');

//// GEM CLASS//////////////////////////////////////////

class Gem extends Entity {
    //constructor for Enemy
    constructor(x, y, sprite) {
        super(x, y, sprite);
    }

    //Update Gem position
    update() {
        this.xNow = this.x;
        this.yNow = this.y;
    }
}
///////////////////////////////////////////////////////////////////////

//Create preliminary array for gems - constructor for multiple gems
const Gems = function () {
    this.preliminaryGemsArray = [];
};

//Update allGems array by transferring gems from preliminary array 
//with random X- and Y-position on the pavement
Gems.prototype.create = function (num) {
//    debugger
    for(let i = 0; i < num; i++) {
        this.preliminaryGemsArray[allGems.length] = new Gem (xOptions[positionX], yOptionsForGems[positionY], 'images/gem-orange.png');
        allGems.push(this.preliminaryGemsArray[allGems.length]); 
    }
};

Gems.prototype.reset = function() {
    allGems = [];
};

const gems = new Gems();

///////////////////////////////////////////////////////////////////////

// Listen for key presses and send the keys to
// Player.handleInput() method.
document.addEventListener('keydown', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

///////////////////////////////////////////////////////////////////////

//This is responsible for what happens after the page is loaded
function start() {
    //Create 6 enemies
    enemies.create(6);
    //Create 2 gems
    gems.create(2);
}
//Invoke start function
start();

///////////////////////////////////////////////////////////////////////

//What happens after Gameover (score <= 0)
function gameover() {
    // clearInterval(enemiesInterval);
    // clearInterval(gemsInterval);
    player.reset();
    enemies.reset();
    gems.reset();
    gameOver.classList.add('show');
    myGameover.play();
}

//What happens after Win (score >= 35)
function toWin() {
    // clearInterval(enemiesInterval);
    // clearInterval(gemsInterval);
    player.reset();
    enemies.reset();
    gems.reset();
    congratMessage.classList.add('show');
    scoreCount.innerHTML = score;
}

//Restart game
function restart() {
    score = 20;
    player.reset();
    enemies.reset();
    gems.reset();
    start()
}

//Event Listener to 'Play again' button (regular restart button)
restartButton.addEventListener('click', function(e) {
    // clearInterval(enemiesInterval);
    // clearInterval(gemsInterval);
    e.preventDefault();
    // debugger
    restart();
});

//Event Listener to 'Once more' button (restart button on 'gameover' modal window)
restartAfterGameover.addEventListener('click', function(e) {
//  debugger
    e.preventDefault();
    gameOver.classList.remove('show');
    restart();
});

//Event Listener to 'Once more' button (restart button on 'win' modal window)
restartAfterWin.addEventListener('click', function(e) {
    //  debugger
    e.preventDefault();
    congratMessage.classList.remove('show');
    restart();
});


   