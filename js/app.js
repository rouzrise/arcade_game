var allEnemies = [];
var score = 20;
var scoreEl = document.getElementById('score');
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
};
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
//step - 101
var xOptions = [0, 101, 202, 303, 404];
//step - 83
var yOptions = [400, 317, 234, 151, 68, -15];
var yOptionsForGems = [0, 0, 284, 201, 118, 0];


///TODO - Set generic class "Entity" so that Enemy, Player, future Gems could inherit from it

///ENEMY

var Enemy = function(speed, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
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

var Enemies = function () {
    this.preliminaryEnemiesArray = [];
}

Enemies.prototype.create = function (num) {

    for(var i = 0; i < num; i++) {
        // debugger
        var speed = getRandomArbitary(50, 400);
       
        var position = randomInteger(2, 4);
      
        this.preliminaryEnemiesArray[allEnemies.length] = new Enemy(speed, yOptions[position]);
       allEnemies.push(this.preliminaryEnemiesArray[allEnemies.length]);
      
    }
}

Enemies.prototype.reset = function() {
    allEnemies = [];
};

var enemies = new Enemies();

enemies.create(5);

var myMusic;
myMusic = new sound("music/portal.mp3");
myMusic.play();
myGemCollect = new sound("music/gemCollect.mp3");
myWin = new sound("music/win.mp3");
myWater = new sound ("music/water.mp3");
myOuch = new sound("music/ouch.mp3");
myGameover = new sound("music/gameover.mp3");

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
    }
    this.stop = function(){
        this.sound.pause();
    }
}

setInterval(function() {
         
        let k = randomInteger(2, 5);
        allEnemies.forEach(function(enemy) {
            if (enemy.width > canvas.width) { 
            allEnemies.splice(enemy, 1);
            }
        });
        allEnemies = [];
        enemies.create(k);

    
  }, 5000);

  function startGame () {

  }

//// PLAYER
var Player = function() {
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

var player = new Player();

//create Gems

var allGems = [];
var Gem = function(x, y) {
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

var Gems = function () {
    this.preliminaryGemsArray = [];
}

Gems.prototype.create = function (num) {
//    debugger;

    for(var i = 0; i < num; i++) {
       
        var positionX = randomInteger(0, 4);
        var positionY = randomInteger(2, 4);
      
        this.preliminaryGemsArray[allGems.length] = new Gem (xOptions[positionX], yOptionsForGems[positionY]);
       allGems.push(this.preliminaryGemsArray[allGems.length]);
      
        
    }
}

Gems.prototype.reset = function() {
    allGems = [];
};

var gems = new Gems();

gems.create(3);

setInterval(function() {
    if (allGems.length === 0) {
        let k = randomInteger(1, 3)
        setTimeout (gems.create(k), 1000);
    } 
  }, 500);





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

var gameOver = document.querySelector('.gameOver');

function gameover() {

    player.reset();
    enemies.reset();
    gems.reset();
    gameOver.classList.add('show');
    myGameover.play();
}




function restart() {
    score = 20;
    player.reset();
    enemies.reset();
    gems.reset();
}

const restartButton = document.querySelector('.restartButton');

restartButton.addEventListener('click', function(e) {
    e.preventDefault();
    // debugger
    restart();
});

var restartAfterGameover = document.getElementById('restartAfterGameover');
var restartAfterWin = document.getElementById('restartAfterWin');
var congratMessage = document.querySelector('.congratMessage');
var scoreCount = document.getElementById('scoreCount');

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


   
