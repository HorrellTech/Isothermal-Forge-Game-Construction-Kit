(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

// CONSTANTS
const pi = Math.PI; // PI
const t = 1; // True
const f = 0; // False
const self = -1; // The instance which is executing the current block of code
const other = -2; // The other instance involved in a collision event, or the other instance from a with function
const all = -3; // All instances currently active in the room
const noone = -4; // No instance at all

gameObjects = []; // The game object list
context = null;
keys = []; // Keyboard keys

// GLOBAL VARIABLES
room_speed = 30;
room_width = 640;
room_height = 480;
view_xview = 0;
view_yview = 0;
view_wview = 640;
view_hview = 480;
mouse_x = 0;
mouse_y = 0;
score = 0;
health = 100;
lives = 3;

// Input events
document.body.addEventListener('keydown', function(e) 
{
    keys[e.keyCode] = true;
});
 
document.body.addEventListener('keyup', function(e) 
{
    keys[e.keyCode] = false;
});

document.body.addEventListener('mousemove', function(e)
{
    mouse_x = e.x - game.canvas.offsetLeft;
    mouse_y = e.y - game.canvas.offsetTop;
});

// Scale the canvas relative to it's current size (1 = normal)
function scaleCanvas(xscale, yscale)
{
    if(context != null)
    {
        game.canvas.width *= xscale;
        game.canvas.height *= yscale;
        context.scale(xscale, yscale);
    }
}

// Keeps track of the resources loaded in the game
function resourceManager()
{
    var images = [];
    var sounds = [];

    loadImage = function(src, callback) {
        var img = document.createElement('img');
        img.addEventListener('load', function() { callback(img); } , false);
        img.src = src;
     }
}

resm = new resourceManager();

// Start the game
function gameStart()
{
    game.start(640, 480, '2d');

    context = game.context;

    // Test game object
    var obj = object_add();
    obj.width = 32;
    obj.height = 32;
    
    var obj2 = object_add();
    obj2.width = 32;
    obj2.height = 32;

    obj.draw = function()
    {
        this.motion_set(this.direction + random_range(-10, 10), random_range(10, 10));
        this.x = mouse_x;
        if(this.x > room_width)
        {
            this.x = -31;
        }
        if(this.x + this.width < 0)
        {
            this.x = room_width;
        }
        if(this.y > room_height)
        {
            this.y = -31;
        }
        if(this.y + this.height < 0)
        {
            this.y = room_height;
        }
        context.fillStyle = rgb(255, 0, 0);
        context.fillRect(this.x, this.y, this.width, this.height);
        //context.drawImage(rMan.images[img], this.x, this.y);
    };

    obj2.draw = function()
    {
        this.motion_set(this.direction + random_range(-10, 10), random_range(0, 3));
        this.depth = 1;
        
        if(this.x > room_width)
        {
            this.x = -31;
        }
        if(this.x + this.width < 0)
        {
            this.x = room_width;
        }
        if(this.y > room_height)
        {
            this.y = -31;
        }
        if(this.y + this.height < 0)
        {
            this.y = room_height;
        }
        context.fillStyle = rgb(0, 255, 0);
        context.fillRect(this.x - 16, this.y - 16, this.width, this.height);
    };

    for(var i = 0; i < 10; i += 1)
    {
        instance_create(random(room_width), random(room_height), obj);
    }

    for(var i = 0; i < 100; i += 1)
    {
        instance_create(random(room_width), random(room_height), obj2);
    }
}

// The main game area where the canvas will be held
var game = 
{
    cont : '2d', // The context
    canvas : createCanvas(),
    start : function(width, height, cont) {
        this.canvas.width = width;
        this.canvas.height = height;
        room_width = width;
        room_height = height;
        this.cont = cont;
        this.context = this.canvas.getContext(cont);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //this.frameNo = 0;
        //this.interval = setInterval(updateGameArea, (1000 / room_speed));
        updateGameArea();
        },
    clear : function() {
        if(this.cont == '2d')
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } 
        else if(this.cont == 'webgl')
        {
            this.context.clearColor(1.0, 1.0, 1.0, 1.0);
            this.context.clearDepth(1.0);
            this.context.enable(this.context.DEPTH_TEST);
            this.context.depthFunc(this.context.LEQUAL);
            this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        }
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
    this.object_id = noone;
    this.id = 0;
    this.need_removed = false;
    this.has_sorted_depth = true;
    this.need_sorted = false;

    this.active = true;
    this.visible = true;

    this.x = x;
    this.y = y;
    this.xstart = x;
    this.ystart = y;
    this.xprevious = x;
    this.yprevious = y;
    this.depth = 0;
    this.bbox_left = x;
    this.bbox_top = y;
    this.bbox_right = x + width;
    this.bbox_bottom = y + height;
    this.width = width;
    this.height = height;
    this.hspeed = 0;
    this.vspeed = 0; 
    this.friction = 0;   
    this.speed = 0;
    this.direction = 0;
    this.gravity = 0;
    this.gravity_direction = 270;

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
        var oldDepth = this.depth;

        this.xprevious = this.x;
        this.yprevious = this.y;

        this.loop_begin();
        this.loop();

        // The speed functionality
        if(this.speed != 0)
        {
            this.hspeed = lengthdir_x(this.speed, this.direction);
            this.vspeed = lengthdir_y(this.speed, this.direction);
        }

        // Horizontal speed and vertical speed functionality
        if(this.hspeed != 0)
        {
            this.x += this.hspeed;
        }
        if(this.vspeed != 0)
        {
            this.y += this.vspeed;
        }

        // Gravity functionality
        if(this.gravity != 0)
        {
            this.hspeed += lengthdir_x(this.gravity, this.gravity_direction);
            this.vspeed += lengthdir_y(this.gravity, this.gravity_direction);
        }

        this.loop_end();

        // Stop direction from exceeding 360 degrees
        this.direction = (this.direction % 360.0);

        // Friction
        if (this.hspeed > 0)
        {
            this.hspeed -= this.friction;
            if(this.hspeed < 0)
            {
                this.hspeed = 0;
            }
        }
        if (this.hspeed < 0)
        {
            this.hspeed += this.friction;
            if (this.hspeed > 0)
            {
                this.hspeed = 0;
            }
        }
        if (this.vspeed > 0)
        {
            this.vspeed -= this.friction;
            if (this.vspeed < 0)
            {
                this.vspeed = 0;
            }
        }
        if (this.vspeed < 0)
        {
            this.vspeed += this.friction;
            if (this.vspeed > 0)
            {
                this.vspeed = 0;
            }
        }

        // Rearrange based on new depth
        if(this.depth != oldDepth)
        {
            //object_id.has_sorted_depth = false;
            object_id.need_sorted = true;
        }

        // If the object hasn't sorted by depth
        if(this.need_sorted)
        {
            this.sort_by_depth();
        }
    };

    // Sort the instances based on their depth
    this.sort_by_depth = function()
    {
        var len = this.instances.length;

        for(var i = len - 1; i >= 0; i -= 1) // Loop through instances
        {
            for(var j = 1; j <= i; j += 1)
            {
                var d1 = this.instances[j].depth;
                var d2 = this.instances[j - 1].depth;
                if(d2 < d1)
                {
                    var temp2 = this.instances[j - 1];
                    this.instances[j - 1] = this.instances[j];
                    this.instances[j] = temp2;
                }
            }
        }

        this.has_sorted_depth = true;
        this.need_sorted = false;
    }

    // The draw called in the game update method (DO NOT OVER WRITE)
    this.mainDraw = function()
    {
        this.draw();
    };

    // Add a new instance to this object
    this.instantiate = function(x, y)
    {
        var temp = new gameObject(x, y, this.width, this.height);
        temp.hasWoken = false;
        temp.awake = this.awake;
        temp.update = this.update;
        temp.draw = this.draw;
        temp.object_id = this;
        temp.id = this.id + 1;

        this.instances.push(temp);

        this.id += 1;

        return(temp);
    };

    // Check if there are inactive instaces waiting to be removed, and if so, remove them
    this.clean_up_instances = function()
    {
        for(var i = 0; i < instances.length; i += 1)
        {
            var ins = this.instances[i];
            if(!ins.active)
            {
                if(ins.need_removed)
                {
                    this.instances.splice(i, 1);
                }
            }
        }
    };

    // Remove this instance from the object_id instances list
    this.instance_destroy = function()
    {
        this.active = false;
        this.need_removed = true;
        object_id.clean_up_instances();
    };

    // Add motion towards a direction
    this.motion_add = function(direction, speed)
    {
        this.speed += speed;
        this.direction = direction;
    };

    // Set motion in a direction
    this.motion_set = function(direction, speed)
    {
        this.speed = speed;
        this.direction = direction;
    };

    // Move the object towards a point at a speed
    this.move_towards_point = function(x, y, speed)
    {
        var pos = point_direction(this.x, this.y, x, y);
        this.motion_set(pos, speed);
    }

    // Snap the object to a grid
    this.move_snap = function(hsnap, vsnap)
    {
        this.x = snap(this.x, hsnap);
        this.y = snap(this.y, vsnap);
    };
}

// A sprite object
function sprite(im)
{

}



// Sort all of the objects based on their top instances depth
function sortObjectsByDepth()
{
    if(objectHasSortedDepth())
    {
    var len = this.gameObjects.length;

        for(var i = len - 1; i >= 0; i -= 1) // Loop through instances
        {
            for(var j = 1; j <= i; j += 1)
            {
                var d1 = this.gameObjects[j].instances[0].depth;
                var d2 = this.gameObjects[j - 1].instances[0].depth;
                if(d2 < d1)
                {
                    var temp2 = this.gameObjects[j - 1];
                    this.gameObjects[j - 1] = this.gameObjects[j];
                    this.gameObjects[j] = temp2;
                }
            }
        }
    }
}

// Check if one of the objects has sorted by depth
function objectHasSortedDepth()
{
    for(var i = 0; i < gameObjects.length; i += 1)
    {
        if(gameObjects[i].has_sorted_depth)
        {
            gameObjects[i].has_sorted_depth = false;
            return (true);
        }
    }
    return (false);
}

// Main update loop
function updateGameArea()
{
    sortObjectsByDepth();
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
                var ins = this.gameObjects[i].instances[j];
                if(ins != null && ins.active)
                {
                    ins.update();
                }
            }
        }
        for (var x = 0; x < this.gameObjects.length; x += 1) 
        {
            for(var y = 0; y < this.gameObjects[x].instances.length; y += 1)
            {
                var ins = this.gameObjects[x].instances[y];
                if(ins != null && ins.visible && ins.active)
                {
                    ins.mainDraw();
                }
            }
        }
        requestAnimationFrame(updateGameArea);
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
function degtorad2()
{
    return ((pi * 2) / -360);
}

// Returns degrees to radians
function degtorad(x)
{
    return (x * pi / 180);
}

// Returns radians to degrees
function radtodeg(x)
{
    return (x * 180 / pi);
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
    return (length * cos(direction * degtorad2()));
}

// Returns the length and direction on the y axis
function lengthdir_y(length, direction)
{
    return (length * sin(direction * degtorad2()));
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

// Execute javascript code from a string
function execute_string(string)
{
    var script = document.createElement("script");
    script.onload = script.onerror = function(){ this.remove(); };
    script.src = "data:text/plain;base64," + btoa(source);
    document.body.appendChild(script);
}