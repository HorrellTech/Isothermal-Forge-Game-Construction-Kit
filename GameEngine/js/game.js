//(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
//})();
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// CONSTANTS
const pi = Math.PI; // PI
const t = 1; // True
const f = 0; // False
const self = -1; // The instance which is executing the current block of code
const other = -2; // The other instance involved in a collision event, or the other instance from a with function
const all = -3; // All instances currently active in the room
const noone = -4; // No instance at all

// FONT CONSTANTS
const fa_start = "start";
const fa_end = "end";
const fa_left = "left";
const fa_center = "center";
const fa_right = "right";

// COLOR CONSTANTS
const c_red = rgb(255, 0, 0);
const c_white = rgb(255, 255, 255);
const c_black = rgb(0, 0, 0);
const c_ltgray = rgb(176, 176, 176);
const c_gray = rgb(128, 128, 128);
const c_dkgray = rgb(64, 64, 64);
const c_blue = rgb(0, 0, 255);
const c_lime = rgb(0, 255, 0);
const c_green = rgb(0, 145, 0);
const c_yellow = rgb(255, 255, 0);
const c_orange = rgb(255, 176, 0);
const c_purple = rgb(255, 0, 255);

gameObjects = []; // The game object list
context = null;
keys = []; // Keyboard keys
animationFrame = null;
mx = 0; // Base mouse x
my = 0; // Base mouse y

// GLOBAL VARIABLES
room_speed = 30;
room_width = 640;
room_height = 480;
view_xview = 0;
view_yview = 0;
view_wview = room_width;
view_hview = room_height;
view_angle = 0;
mouse_x = 0;
mouse_y = 0;
score = 0;
health = 100;
lives = 3;
instance_count = 0;
font_size = 12;
font_style = "Arial";

// Input events
document.body.addEventListener('keydown', function(e) 
{
    keys[e.keyCode] = true;
});
 
document.body.addEventListener('keyup', function(e) 
{
    keys[e.keyCode] = false;
});


var textEditor = document.getElementById('tbcode');

document.body.addEventListener('mousemove', function(e)
{
    var el = document.getElementById('canvasdiv');
    mx = e.x - el.offsetLeft - game.canvas.offsetLeft;// - document.scrollLeft;
    my = e.y - el.offsetTop - game.canvas.offsetTop;// - document.scrollTop;
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
    cancelAnimationFrame(animationFrame);
    game.start(view_wview, view_hview, '2d');

    context = game.context;

    draw_set_font(24, 'Calibri');
    draw_set_align(fa_start);
    draw_set_color(c_white);

    // Game logic here
    var object0 = object_add();
    var object1 = object_add();

    object0.awake = function()
    {
        this.orbDir = 0;
    }

    object0.draw = function()
    {
        this.orbDir += 10;
        draw_set_color(c_red);
        draw_text(view_xview, view_yview, "Instance Count: " + instance_count);
        draw_set_color(c_black);
        draw_text_outline(view_xview, view_yview, "Instance Count: " + instance_count);
        draw_set_color(c_white);

        view_xview += 1;

        // Draw things around the cursor
        draw_circle(mouse_x + lengthdir_x(64, this.orbDir), mouse_y + lengthdir_y(64, this.orbDir), 8, false);
    }

    object1.awake = function()
    {
        var col = irandom_range(0, 255);
        this.color = rgb(irandom_range(0, 255), irandom_range(0, 255), irandom_range(0, 255));
        this.depth = 1;
    }

    object1.draw = function()
    {
        var len = 8;
        draw_set_color(this.color);
        //draw_circle(this.x, this.y, len, false);
        draw_rectangle(this.x - len, this.y - len, this.x + len, this.y + len, false);
        draw_set_color(c_white);
        //draw_line(this.x, this.y, this.x + lengthdir_x(len, this.direction), this.y + lengthdir_y(len, this.direction))
        draw_set_color(c_white);

        //this.motion_set(this.direction + random_range(-10, 10), random_range(0, 5));
    
        if(this.x > room_width)
        {
            //this.x = 0;
            //this.move_bounce(false, false, true);
        }
        if(this.y > room_height)
        {
            //this.y = 0;
            //this.move_bounce(false, false, true);
        }
        if(this.x < 0)
        {
            //this.x = room_width;
            //this.move_bounce(false, false, true);
        }
        if(this.y < 0)
        {
            //this.y = room_height;
            //this.move_bounce(false, false, true);
        }

        var dist = point_distance(this.x, this.y, mouse_x, mouse_y);
        var dir = point_direction(this.x, this.y, mouse_x, mouse_y);
        if(dist < 48)
        {
            this.motion_set(-dir, 3);
        }
    }

    instance_create(32, 32, object0);

    for(var i = 0; i < 4500; i += 1)
    {
        var th = instance_create(random(room_width), random(room_height), object1);
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
        updateGameArea();
        view_angle = 0;
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

    // Reverse the directions, takes in booleans
    this.move_bounce = function(hbounce, vbounce, dirbounce)
    {
        if(hbounce)
        {
            this.hspeed *= -1;
        }
        if(vbounce)
        {
            this.vspeed *= -1;
        }
        if(dirbounce)
        {
            this.direction = 2 * 0 - this.direction - 180;
        }
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
                if(gameObjects[j].instances.length > 0)
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
    var oldViewAngle = view_angle; // Store the view angle
    var oldViewW = view_wview;
    var oldViewH = view_hview;
    sortObjectsByDepth();
    if(context != game.context)
    {
        context = game.context;
    }

    game.clear();
    var insCount = 0; // InstanceCount
        // This is the main game loop
        for (var i = 0; i < gameObjects.length; i += 1) 
        {
            if(gameObjects[i].instances != null)
            {
                for(var j = 0; j < gameObjects[i].instances.length; j += 1)
                {
                    var ins = gameObjects[i].instances[j];
                    if(ins != null && ins.active)
                    {
                        ins.update();
                        insCount += 1;
                    }
                }
            }
        }
        for (var x = 0; x < gameObjects.length; x += 1) 
        {
            if(gameObjects[x].instances != null)
            {
                for(var y = 0; y < gameObjects[x].instances.length; y += 1)
                {
                    var ins = gameObjects[x].instances[y];
                    if(ins != null && ins.visible && ins.active)
                    {
                        ins.mainDraw();
                    }
                }
            }
        }

        instance_count = insCount;

        mouse_x = mx + view_xview;
        mouse_y = my + view_yview;

        // If the view angle has changed, change the canvas angle
        /*if(oldViewAngle != view_angle)
        {
            context.translate(game.canvas.width / 2, game.canvas.height / 2);
            context.rotate(degtorad(view_angle));
            context.translate(-game.canvas.width / 2, -game.canvas.height / 2);
        }

        if(oldViewH != view_hview)
        {
            game.canvas.height = view_hview;
        }
        if(oldViewW != view_wview)
        {
            game.canvas.width = view_wview;
        }

        view_angle % 360;*/

        animationFrame = requestAnimationFrame(updateGameArea);
}

// Gets the number of instances of the given object
function instance_number(object_id)
{
    return(object_id.instances.length);
}

// If the canvas exists, use it, otherwise create a new one
function createCanvas()
{
    var canv = document.getElementById("canvas");

    if(canv == null)
    {
        canv = document.createElement('canvas');
    }
    canv.oncontextmenu = function(e){ return false; };

    return(canv);
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

// Set the drawing color
function draw_set_color(color)
{
    context.fillStyle = color;
    context.strokeStyle = color;
}

// Draw a rectangle as outline or filled
function draw_rectangle(x1, y1, x2, y2, outline)
{
    context.beginPath();
    if(outline)
    {
        context.strokeRect(x1 - view_yview, y1 - view_xview, x2 - x1, y2 - y1);
    }
    else
    {
        context.fillRect(x1 - view_yview, y1 - view_xview, x2 - x1, y2 - y1);
    }   
    context.closePath();
}

// Draw a rectangle as outline or filled
function draw_rectangle_color(x1, y1, x2, y2, col1, col2, outline)
{
    context.beginPath();
    var fillStylePrev = context.fillStyle;
    var strokeStylePrev = context.strokeStyle;
    var gradient = context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, col1);
    gradient.addColorStop(1, col2);
    if(outline)
    {
        context.strokeStyle = gradient;
        context.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
    else
    {
        context.fillStyle = gradient;
        context.fillRect(x1, y1, x2 - x1, y2 - y1);
    }   
    context.strokeStyle = strokeStylePrev;
    context.fillStyle = fillStylePrev;
    context.closePath();
}

// Draw a line from one point to another
function draw_line(x1, y1, x2, y2)
{
    context.beginPath();
    context.moveTo(x1 - view_xview, y1 - view_yview);
    context.lineTo(x2 - view_xview, y2 - view_yview);
    context.stroke();
    context.closePath();
}

// Draw a line from one point to another
function draw_line_width(x1, y1, x2, y2, width)
{
    context.beginPath();
    context.lineWidth(width);
    context.moveTo(x1 - view_xview, y1 - view_yview);
    context.lineTo(x2 - view_xview, y2 - view_yview);
    context.stroke();
    context.lineWidth(1);
    context.closePath();
}

// Set the text font, '30' 'Arial' for example
function draw_set_font(size, name)
{
    context.beginPath();
    context.font = size.toString() + 'px ' + name;
    font_size = size;
    font_style = name;
    context.closePath();
}

// Align the text using fa_*
function draw_set_align(align)
{
    context.textAlign = align;
}

// Draw a text to the screen
function draw_text(x, y, text)
{
    context.fillText(text, x - view_xview, y - view_yview + font_size);
}

// Draw a text to the screen
function draw_text_outline(x, y, text)
{
    context.strokeText(text, x - view_xview, y - view_yview + font_size);
}

// Draw a circle
function draw_circle(x, y, r, outline)
{
    if(outline)
    {
        context.beginPath();
        context.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
        context.closePath();
        context.stroke();
    }
    else
    {
        var oldLineWidth = context.lineWidth;
        context.lineWidth = 0;
        context.beginPath();
        context.arc(x - view_xview, y - view_yview, r, 0, 2 * pi);
        context.closePath();
        context.fill();
        context.lineWidth = oldLineWidth;
    }
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
    var a = (x1) - (x2);
    var b = (y1) - (y2);
    return (Math.sqrt(a * a + b * b));
}

// Return the direction from one point to another
function point_direction(x1, y1, x2, y2)
{
    var xdiff = (x2) - x1;
    var ydiff = (y2) - y1;

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
    eval(string);
}