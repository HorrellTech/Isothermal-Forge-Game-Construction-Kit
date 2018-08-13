// CONSTANTS
const pi = Math.PI;

var gameObjects = []; // The game object list
var context;
var dt;
var room_width;
var room_height;

// Start the game
function gameStart()
{
    //dt = (Date.now - Date.last) / (1000 / 120);
    game.start(640, 480);

    context = game.canvas.getContext('2d');
    // Test game object
    var obj = object_add();
    obj.width = 32;
    obj.height = 32;

    obj.draw = function()
    {
        this.x += 1;
        if(this.x > room_width)
        {
            this.x = -31;
        }
        context.fillStyle = 'red';
        for(var i = this.width; i > 0; i -= 1)
        {
            context.fillStyle = rgb(255, (i * 10), (i * 10));
            context.fillRect(this.x - i, this.y + (i / 2), this.width - i, this.height - i);
        }
    };

    instance_create(64, 64, obj);
    instance_create(64 + 32, 64 + 32, obj);
    instance_create(64, 64 + 32 + 32, obj);
    instance_create(64 + 32, 64 + 32 + 32 + 32, obj);
    instance_create(64 + 32 + 32, 64 + 32 + 32 + 32 + 32, obj);
    instance_create(64 + 32, 64 + 32 + 32 + 32 + 32 + 32, obj);
}

// The main game area where the canvas will be held
var game = 
{
    canvas : createCanvas(),
    start : function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        room_width = width;
        room_height = height;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000 / 60);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// Create an new instance of an object
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
    this.xstart = x;
    this.ystart = y;
    this.xprevious = x;
    this.yprevious = y;
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
    {};

    // Perform on every loop
    this.loop = function() 
    {};

    // Perform before every loop
    this.loop_begin = function() 
    {};

    // Perform after every loop
    this.loop_end = function() 
    {};

    // Draw on every loop
    this.draw = function()
    {};

    // The update called in the game update method (DO NOT OVER WRITE)
    this.update = function()
    {
        if(!this.hasWoken)
        {
            this.awake();
            this.hasWoken = true;
            this.xstart = this.x;
            this.ystart = this.y;
        }
        this.xprevious = this.x;
        this.yprevious = this.y;

        this.loop_begin();
        this.loop();

        if(this.speed != 0)
        {
            this.hspeed = lengthdir_x(this.speed, this.direction);
            this.vspeed = lengthdir_y(this.speed, this.direction);
        }

        if(this.hspeed != 0)
        {
            this.x += this.hspeed;
        }
        if(this.vspeed != 0)
        {
            this.y += this.vspeed;
        }

        this.loop_end();
    }

    // The draw called in the game update method (DO NOT OVER WRITE)
    this.mainDraw = function()
    {
        this.draw();
    }

    // Add a new instance to this object
    this.instantiate = function(x, y)
    {
        var temp = new gameObject(x, y, this.width, this.height);
        temp.awake = this.awake;
        temp.update = this.update;
        temp.draw = this.draw;

        this.instances.push(temp);

        return(temp);
    };

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
    };
}

// Main update loop
function updateGameArea()
{
    if(context != game.context)
    {
        context = game.context;
    }

    game.clear();
        // This is the main game loop
        for (var i = 0; i < this.gameObjects.length; i += 1) 
        {
            for(var j = 0; j < this.gameObjects[i].instances.length; j += 1)
            {
                this.gameObjects[i].instances[j].update();
            }
        }
        for (var x = 0; x < this.gameObjects.length; x += 1) 
        {
            for(var y = 0; y < this.gameObjects[x].instances.length; y += 1)
            {
                this.gameObjects[x].instances[y].mainDraw();
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
        canv = (document.createElement("canvas"));
        canv.oncontextmenu = function(e){ return false; }; // Disable the context menu on right click

        return(canv);
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


// DRAWING STUFF

// Get color from rgb color values
function rgb(r, g, b)
{
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(",r,",",g,",",b,")"].join("");
}


// MATH STUFF

// Returns the greatest integer less than or equal to its numeric argument
function floor(x)
{
    return (Math.floor(x));
}

// Returns the smallest integer greater than or equal to its numeric argument
function ceil(x)
{
    return (Math.ceil(x));
}

// Returns the absolute value of a number
function abs(x)
{
    return (Math.abs(x));
}

// Returns a supplied numeric expression rounded to the nearest number
function round(x)
{
    return (Math.round(x));
}

// Returns the sine of a number
function sin(x)
{
    return (Math.sin(x));
}

// Returns the cosine of a number
function cos(x)
{
    return (Math.cos(x));
}

// Returns the cosine of a number from degrees to radians
function dcos(x)
{
    return(cos(degtorad(x)));
}

// Returns degrees to radians
function degtorad(x)
{
    return ((Math.PI * 2) / 360);
}

// Snap a position to a grid position
function snap(position, grid_size)
{
    return (floor(position / grid_size) * grid_size);
}

// Return the distance between 2 points
function point_distance(x1, y1, x2, y2)
{
    return (Math.sqrt(Math.pow(x2 - x2, 2) + Math.pow(y2 - y1, 2)));
}

// Return the direction from one point to another
function point_direction(x1, y1, x2, y2)
{
    var xdiff = x2 - x1;
    var ydiff = y2 - y1;

    return (-(Math.atan2(ydiff, xdiff) * 180.0 / Math.PI));
}

// Returns the length and direction on the x axis
function lengthdir_x(length, direction)
{
    return (length * cos(direction * degtorad()));
}

// Returns the length and direction on the y axis
function lengthdir_y(length, direction)
{
    return (length * sin(direction * degtorad()));
}

// Lerp a value towards another value
function lerp(from, to, amount)
{
    return (from + amount * (to - from)); 
}

// Returns a random floating point from 1 to max value
function random(max)
{
    return ((Math.random() * max) + 1);
}

// Returns a random floating point from min to max value
function random_range(min, max)
{
    return (Math.random() * (max - min) + min);
}

// Returns a random integer from 1 to max value
function irandom(max)
{
    return (floor((Math.random() * max) + 1));
}

// Returns a random integer from min to max value
function irandom_range(min, max)
{
    return (floor(Math.random() * (max - min) + min));
}

// Returns either true or false
function random_bool()
{
    return (Math.random() >= 0.5);
}

// Returns a value as a string
function string(val)
{
    return (val.toString());
}

// Converts a string to an integer
function real(val)
{
    return (parseInt(val));
}