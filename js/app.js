let allEnemies = [];
let score = 20;
const scoreEl = document.getElementById('score');
//step - 101
const xOptions = [0, 101, 202, 303, 404];
//step - 83
const yOptions = [400, 317, 234, 151, 68, -15];
const yOptionsForGems = [0, 0, 284, 201, 118, 0];

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
};

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};


function sound(src) {
    // debugger
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
};

const myMusic = new sound("music/portal.mp3");
// myMusic.loop = true;
myMusic.play();
myMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);


const myGemCollect = new sound("music/gemCollect.mp3");
const myWin = new sound("music/win.mp3");
const myWater = new sound ("music/water.mp3");
const myOuch = new sound("music/ouch.mp3");
const myGameover = new sound("music/gameover.mp3");

///TODO - Set generic class "Entity" so that Enemy, Player, future Gems could inherit from it

///ENEMY

const Enemy = function(speed, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = y;
    this.speed = speed;
};

Enemy.prototype.update = function(dt) {

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
        if(this.x > canvas.width) {
        this.x = getRandomArbitary(-1000, -50);
        }

    };


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const Enemies = function () {
    this.preliminaryEnemiesArray = [];
};

Enemies.prototype.create = function (num) {

    for(var i = 0; i < num; i++) {
        // debugger
        const speed = getRandomArbitary(50, 250);
        const position = randomInteger(2, 4);
        this.preliminaryEnemiesArray[allEnemies.length] = new Enemy(speed, yOptions[position]);
        allEnemies.push(this.preliminaryEnemiesArray[allEnemies.length]);
    }
}

Enemies.prototype.reset = function() {
    allEnemies = [];
};

const enemies = new Enemies();

//// PLAYER
const Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 203;
    this.y =  400;
};

Player.prototype.update = function() {
    this.xNow = this.x;
    this.yNow = this.y;
};

Player.prototype.reset = function() {
    this.x = 203;
    this.y = 400;
};

Player.prototype.returnToStart = function() {

    var position = randomInteger(0, 4);
    this.x = xOptions[position];
    this.y = 400;
};

Player.prototype.handleInput = function (pressedKey) {
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

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const player = new Player();

//create Gems

let allGems = [];
const Gem = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/gem-orange.png';
};

Gem.prototype.update = function() {
    this.xNow = this.x;
    this.yNow = this.y;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const Gems = function () {
    this.preliminaryGemsArray = [];
}

Gems.prototype.create = function (num) {
//    debugger
    for(var i = 0; i < num; i++) {
        const positionX = randomInteger(0, 4);
        const positionY = randomInteger(2, 4);
        this.preliminaryGemsArray[allGems.length] = new Gem (xOptions[positionX], yOptionsForGems[positionY]);
        allGems.push(this.preliminaryGemsArray[allGems.length]); 
    }
}

Gems.prototype.reset = function() {
    allGems = [];
};

const gems = new Gems();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


function start() {
    enemies.create(6);
    //     this.enemiesInterval = setInterval(function() {
    //     let k = randomInteger(3, 6);
    //     allEnemies.forEach(function(enemy) {
    //         if (enemy.width > canvas.width) { 
    //         allEnemies.splice(enemy, 1);
    //         }
    //     });
    //     allEnemies = [];
    //     enemies.create(k);
    // }, 5000);

    // this.enemiesInterval = setInterval(function() {
    //         let k = randomInteger(1, 2);
    //         // allEnemies.forEach(function(enemy) {
    //         //     if (enemy.width > canvas.width) { 
    //         //     allEnemies.splice(enemy, 1);
    //         //     }
    //         // });
    //         enemies.create(k);
    //     }, 3000);

    gems.create(2);

    this.gemsInterval = setInterval(function() {
        if (allGems.length === 0) {
            let k = randomInteger(1, 2)
            setTimeout (gems.create(k), 1000);
        } 
      }, 500);
}

start();

const gameOver = document.querySelector('.gameOver');
const restartButton = document.querySelector('.restartButton');
const restartAfterGameover = document.getElementById('restartAfterGameover');
const restartAfterWin = document.getElementById('restartAfterWin');
const congratMessage = document.querySelector('.congratMessage');
const scoreCount = document.getElementById('scoreCount');

function gameover() {
    // clearInterval(enemiesInterval);
    clearInterval(gemsInterval);
    player.reset();
    enemies.reset();
    gems.reset();
    gameOver.classList.add('show');
    myGameover.play();
}

function toWin() {
    // clearInterval(enemiesInterval);
    clearInterval(gemsInterval);
    player.reset();
    enemies.reset();
    gems.reset();
    congratMessage.classList.add('show');
    scoreCount.innerHTML = score;
}

function restart() {
    score = 20;
    player.reset();
    enemies.reset();
    gems.reset();
    start()
}

restartButton.addEventListener('click', function(e) {
    // clearInterval(enemiesInterval);
    clearInterval(gemsInterval);
    e.preventDefault();
    // debugger
    restart();
});

restartAfterGameover.addEventListener('click', function(e) {
//  debugger
    e.preventDefault();
    gameOver.classList.remove('show');
    restart();
});

restartAfterWin.addEventListener('click', function(e) {
    //  debugger
    e.preventDefault();
    congratMessage.classList.remove('show');
    restart();
    });


   