var gameObjects = []; // The game object list

// Start the game
function gameStart()
{
    game.start();

    // Test game object
    var obj = object_add();

    instance_create(64, 64, obj);
}

// The main game area where the canvas will be held
var game = {
    canvas : createCanvas(),
    start : function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function instance_create(x, y, object)
{
    var temp = object.instantiate(x, y);

    return(temp);
}

// Create a new instance of an object
function object_add()
{
    var temp = new gameObject(0, 0, 0, 0);

    gameObjects.push(temp);

    return(temp);
}

// Game object
function gameObject(x, y, width, height) 
{
    this.instances = [];

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hspeed = 0;
    this.vspeed = 0; 
    this.friction = 0;   
    this.speed = 0;
    this.direction = 0;
    this.gravity = 0;
    this.gravity_direction = 0;

    this.hasWoken = false;

    // When the object is first created
    this.awake = function()
    {}

    // Perform on every loop
    this.update = function() 
    {
        if(!hasWoken)
        {
            awake();
            hasWoken = true;
        }
    }

    // Draw on every loop
    this.draw = function()
    {
        game.context.beginPath();
        game.context.lineWidth = "6";
        game.context.strokeStyle = "red";
        game.context.rect(5,5,290,140);
        game.context.stroke();
    }

    // Add a new instance to this object
    this.instantiate = function(x, y)
    {
        var temp = new gameObject(x, y, width, height);

        instances.push(temp);

        return(temp);
    }

    // Collision with another game object
    this.collides_with = function(other) 
    {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = other.x;
        var otherright = other.x + (other.width);
        var othertop = other.y;
        var otherbottom = other.y + (other.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
        {
            crash = false;
        }
        return crash;
    }
}

// Main update loop
function updateGameArea()
{
    game.clear();
    game.frameNo += 1;
    if (game.frameNo == 1 || everyinterval(150)) 
    {
        // This is the main game loop
        for (i = 0; i < gameObjects.length; i += 1) 
        {
            for(j = 0; j < gameobjects[i].instances.length; j += 1)
            {
                gameobjects[i].instances[j].update();
            }
        }
        for (i = 0; i < gameObjects.length; i += 1) 
        {
            for(j = 0; j < gameobjects[i].instances.length; j += 1)
            {
                gameobjects[i].instances[j].draw();
            }
        }
    }
}

// If the canvas exists, use it, otherwise create a new one
function createCanvas()
{
    var canv = document.getElementById("canvas");

    if(canv != null)
    {
        return(canv);
    }
    else
    {
        return(document.createElement("canvas"));
    }
}

// Every timer tick
function everyinterval(n) 
{
    if ((game.frameNo / n) % 1 == 0) 
    {
        return true;
    }
    return false;
}