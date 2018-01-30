
var playerShip;
var mapBuildings = [];


function startGame() {
    playerShip = new component(20, 10, "red", 10, 10);
    gameWindow.start();
}

var gameWindow = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 250;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        $(this.canvas).attr('id', 'cityCanvas');
        window.addEventListener('keydown', function (e) {
            gameWindow.keys = (gameWindow.keys || []);
            gameWindow.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            gameWindow.keys[e.keyCode] = false;
        })
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameWindow.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitSide();
    }
    this.hitSide = function() {
      var bottom = gameWindow.canvas.height - this.height;
      var top = 0;
      var left = 0;
      var right = gameWindow.canvas.width - this.width;
      if (this.y > bottom) {this.y = bottom;}
      if (this.y < top) {this.y = top;}
      if (this.x < left) {this.x = left;}
      if (this.x > right) {this.x = right;}
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < mapBuildings.length; i += 1) {
        if (playerShip.crashWith(mapBuildings[i])) {
            gameWindow.stop();
            return;
        }
    }
    gameWindow.clear();
    gameWindow.frameNo += 1;
    if (gameWindow.frameNo == 1 || everyinterval(20)) {
        x = gameWindow.canvas.width;
        y = gameWindow.canvas.height
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 100;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        mapBuildings.push(new component(20, -100, "green", x, y));
        // mapBuildings.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < mapBuildings.length; i += 1) {
        mapBuildings[i].x += -12;
        mapBuildings[i].update();
    }
    playerShip.speedX = 0;
    playerShip.speedY = 0;
    if (gameWindow.keys && gameWindow.keys[37]) {playerShip.speedX = -5; }
    if (gameWindow.keys && gameWindow.keys[39]) {playerShip.speedX = 5; }
    if (gameWindow.keys && gameWindow.keys[38]) {playerShip.speedY = -5; }
    if (gameWindow.keys && gameWindow.keys[40]) {playerShip.speedY = 5; }
    playerShip.newPos();
    playerShip.update();
    console.log(gameWindow.frameNo);
}

function everyinterval(n) {
    if ((gameWindow.frameNo / n) % 1 == 0) {return true;}
    return false;
}

$(document).ready(function() {
  startGame();
})
