// CONSTANTS
const canvasId = 'canvas';
const pi = Math.PI; // PI
const t = 1; // True
const f = 0; // False
const self = -1; // The instance which is executing the current block of code
const other = -2; // The other instance involved in a collision event, or the other instance from a with function
const all = -3; // All instances currently active in the room
const noone = -4; // No instance at all

// FONT CONSTANTS
const fa_start = 'start';
const fa_end = 'end';
const fa_left = 'left';
const fa_center = 'center';
const fa_right = 'right';

// FILTER CONSTANTS
const fl_blur = 'blur';
const fl_brightness = 'brightness';
const fl_contrast = 'contrast';
const fl_grayscale = 'grayscale';
const fl_hue = 'hue-rotate';
const fl_invert = 'invert';
const fl_opacity = 'opacity';
const fl_saturate = 'saturate';
const fl_sepia = 'sepia';

const fl_calc_blur = 'px';
const fl_calc_brightness = '%';
const fl_calc_contrast = '%';
const fl_calc_grayscale = '%';
const fl_calc_hue = 'deg';
const fl_calc_invert = '%';
const fl_calc_opacity = '%';
const fl_calc_saturate = '%';
const fl_calc_sepia = '%';

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
const a_100 = 1.0; // Alpha full
const a_50 = 0.5; // Alpha half
const a_0 = 0.0; // Alpha none
const a_25 = 0.25; // Alpha 1/4
const a_75 = 0.75; // Alpha 3/4

// HIDDEN GLOBAL VARIABLES
gameObjects = []; // The game object list
context = null;
animationFrame = null; // How we will talk to the animation frame requests
mx = 0; // Base mouse x
my = 0; // Base mouse y
lastTick = 0; // Last time the frame ticked
font_size = 12;
font_style = "Arial";
globalObj = noone;

// GLOBAL VARIABLES
global = noone; // The global instance
room_speed = 30;
room_width = 640;
room_height = 480;
background_color = c_ltgray;
fps = 0;
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
object_count = 0;
delta_time = 0;
time_scale = 1.0; // The time scale can be used for slow motion or game pausing

function gameRestart()
{
	gameStart(640, 480);
}

function gameRestartEval()
{
	var c = document.getElementById('tbcode').value;
	gameStart();
    execute_string(c);
}

function room_begin(width, height)
{
    room_width = width;
    room_height = height;
}

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
    gameObjects = [];
    room_width = 640;
    room_height = 480;
    view_xview = 0;
    view_yview = 0;
    view_wview = room_width;
    view_hview = room_height;
    time_scale = 1.0;
    game.start(view_wview, view_hview, '2d');
    lastTick = new Date().getTime();

    context = game.context;

    draw_set_font(24, 'Calibri');
    draw_set_align(fa_start);
    draw_set_color(c_white);

    // Game logic here
    globalObj = object_add();

    globalObj.awake = function()
    {
        this.debug_mode = true;
        this.text_color = c_red;
    }

    globalObj.draw_gui = function()
    {
        if(this.debug_mode)
        {
            draw_set_color(this.text_color);
            draw_set_alpha(a_100);
            draw_text(view_xview, view_yview, "Obj Count: " + object_count + "; Inst Count: " + instance_count + "; FPS: " + string(fps));
            draw_set_color(c_white);
        }
    }

    global = instance_create(0, 0, globalObj);
}

function skinColor()
{
    var col = '#FFFFFF';
    switch (irandom(3))
    {
        case 0:
            col = ('#FFE0BD');
        break;
        case 1:
            col = ('#FFCD94');
        break;
        case 2:
            col = ('#FFE39F');
        break;

        case 3:
            col = ('#633C1D');
        break;
    }

    return(col);
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
            draw_set_color(background_color);
            draw_rectangle(view_xview, view_yview, view_xview + view_wview, view_yview + view_hview);
            draw_set_color(c_white);
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
    temp.isParent = false;

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
    this.isParent = true;
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
    this.width = width;
    this.height = height;
    this.hspeed = 0;
    this.vspeed = 0; 
    this.friction = 0;   
    this.speed = 0;
    this.direction = 0;
    this.gravity = 0;
    this.gravity_direction = 270;

    this.image_index = 0;
    this.image_number = 1;

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

    // Will be drawn very last, and on top of every normal draw event
    this.draw_gui = function()
    {};

    // The update called in the game update method (DO NOT OVER WRITE)
    this.updateMain = function()
    {
        //if(!isParent)
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

            //this.image_index += 1 % this.image_number;

            this.loop_begin();
            this.loop();

            // The speed functionality
            if(this.speed != 0)
            {
                this.hspeed = lengthdir_x(this.speed, this.direction) * time_scale;
                this.vspeed = lengthdir_y(this.speed, this.direction) * time_scale;
            }

            // Horizontal speed and vertical speed functionality
            if(this.hspeed != 0)
            {
                this.x += this.hspeed * time_scale;
            }
            if(this.vspeed != 0)
            {
                this.y += this.vspeed * time_scale;
            }

            // Gravity functionality
            if(this.gravity != 0)
            {
                this.hspeed += lengthdir_x(this.gravity, this.gravity_direction) * time_scale;
                this.vspeed += lengthdir_y(this.gravity, this.gravity_direction) * time_scale;
            }
            
            if(this.object_id.instances[0] == this) // If we are the first object in the line
            {
                this.object_id.sort_by_depth();
            }

            this.loop_end();

            // Stop direction from exceeding 360 degrees
            this.direction = (this.direction % 360.0);

            // Friction
            if (this.hspeed > 0)
            {
                this.hspeed -= this.friction * time_scale;
                if(this.hspeed < 0)
                {
                    this.hspeed = 0;
                }
            }
            if (this.hspeed < 0)
            {
                this.hspeed += this.friction * time_scale;
                if (this.hspeed > 0)
                {
                    this.hspeed = 0;
                }
            }
            if (this.vspeed > 0)
            {
                this.vspeed -= this.friction * time_scale;
                if (this.vspeed < 0)
                {
                    this.vspeed = 0;
                }
            }
            if (this.vspeed < 0)
            {
                this.vspeed += this.friction * time_scale;
                if (this.vspeed > 0)
                {
                    this.vspeed = 0;
                }
            }
        }
    };

    // Sort the instances based on their depth
    this.sort_by_depth = function()
    {
        var len = this.instances.length;
        if(len > 1)
        {
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
        }
    }

    // The draw called in the game update method (DO NOT OVER WRITE)
    this.mainDraw = function()
    {
        this.draw();
    };

    // This is called after every other event, so everything will be drawn last in this event
    this.mainDrawGui = function()
    {
        this.draw_gui();
    }

    // Add a new instance to this object
    this.instantiate = function(x, y)
    {
        var temp = new gameObject(x, y, this.width, this.height);
        temp.hasWoken = false;
        temp.awake = this.awake;
        temp.loop = this.loop;
        temp.loop_begin = this.loop_begin;
        temp.loop_end = this.loop_end;
        temp.draw = this.draw;
        temp.draw_gui = this.draw_gui;
        temp.object_id = this;
        temp.id = this.id;
        temp.isParent = false;

        this.instances.push(temp);

        this.id += 1;

        return(temp);
    };

    // Check if there are inactive instaces waiting to be removed, and if so, remove them
    this.clean_up_instances = function()
    {
        for(var i = 0; i < this.instances.length; i += 1)
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
        //object_id.clean_up_instances(); // Make the parent object clean up resources
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
            if(dirbounce)
            {
                this.direction = 2 * 0 - this.direction - 180;
            }
            else
            {
                this.hspeed *= -1;
            }
        }
        if(vbounce)
        {
            if(dirbounce)
            {
                this.direction = 2 * 90 - this.direction - 180;
            }
            else
            {
                this.vspeed *= -1;
            }
        }
    };

    // Check if the object is within the view bounds
    this.within_view = function()
    {
        var x1, y1, x2, y2;
        x1 = this.x;
        y1 = this.y;
        x2 = this.x + this.width;
        y2 = this.y + this.height;
        return (x2 > 0 && y2 > 0 && x1 < view_xview + view_wview && y1 < view_yview + view_hview);
    }

    // Check if the mouse is within the instances bounds
    this.mouse_over = function()
    {
        return (mouse_x > this.x && mouse_y > this.y && mouse_x < this.x + this.width && mouse_y < this.y + this.height);
    }

    // Detect collision with another instance of object type
    this.collision_with = function(object)
    {
        if(!this.isParent)
        {
            for(var i = 0; i < object.instances.length; i += 1)
            {
                if(this != object.instances[i] && object.instances[i].active)
                {
                    if(checkCollision(object.instances[i], this))
                    {
                        //alert('this = ' + this.id + ', other = ' + object.instances[i].id);
                        return(object.instances[i]);
                    }
                }
            }
        }
        return(noone);
    }

    // Get the nearest instance of an object to a point
    this.instance_nearest = function(x, y, object)
    {
        var nearest = noone;
        var dist = 9999999;
        for(var i = 0; i < object.instances.length; i += 1)
        {
            if(object.instances[i] != this && object.instances[i].active)
            {
                var dist2 = point_distance(x, y, object.instances[i].x, object.instances[i].y);
                if(dist2 < dist)
                {
                    dist = dist2;
                    nearest = object.instances[i];
                }
            }
        }

        return(nearest);
    }
}

function checkCollision(object1, object2)
    {
        if(object1.active && object2.active)
        {
            if(object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
            object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)
            {
                return(true);
            }
            else
            {
                return(false);
            }
        }
        else
        {
            return(false);
        }
    }

// A sprite object
function sprite(im)
{

}

// Sort all of the objects based on their top instances depth
function sortObjectsByDepth()
{
    if(gameObjects.length > 0)
    {
    var len = gameObjects.length;

        for(var i = len - 1; i >= 0; i -= 1) // Loop through instances
        {
            for(var j = 1; j <= i; j += 1)
            {
                if(gameObjects[j].instances.length > 0)
                {
                    //gameObjects[j].instances[0].object_id.sort_by_depth();
                    var d1 = gameObjects[j].instances[0].depth;
                    var d2 = gameObjects[j - 1].instances[0].depth;
                    if(d2 < d1)
                    {
                        var temp2 = gameObjects[j - 1];
                        gameObjects[j - 1] = gameObjects[j];
                        gameObjects[j] = temp2;
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
    // FPS CALCULATION
    var delta = (new Date().getTime() - lastTick) / 1000;
    lastTick = new Date().getTime();
    fps = ceil(1 / delta);

    var oldViewAngle = view_angle; // Store the view angle
    var oldViewW = view_wview;
    var oldViewH = view_hview;
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
                        ins.updateMain();
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
        for (var x = 0; x < gameObjects.length; x += 1) 
        {
            if(gameObjects[x].instances != null)
            {
                for(var y = 0; y < gameObjects[x].instances.length; y += 1)
                {
                    var ins = gameObjects[x].instances[y];
                    if(ins != null && ins.visible && ins.active)
                    {
                        ins.mainDrawGui();
                    }
                }
            }
        }

        instance_count = insCount;
        object_count = gameObjects.length;

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
        sortObjectsByDepth();

        animationFrame = requestAnimationFrame(updateGameArea);
		
		delta_time += 1 % 2;
}

// Gets the number of instances of the given object
function instance_number(object_id)
{
    return(object_id.instances.length);
}

// If the canvas exists, use it, otherwise create a new one
function createCanvas()
{
    var canv = document.getElementById(canvasId);

    if(canv == null)
    {
        canv = document.createElement(canvasId);
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

//#newfile BasicDrawing

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

// Set the drawing alpha 0.0 - 1.0
function draw_set_alpha(alpha)
{
    context.globalAlpha = alpha;
}

// Draw a rectangle as outline or filled
function draw_rectangle(x1, y1, x2, y2, outline)
{
    context.beginPath();
    if(outline)
    {
        context.strokeRect(x1 - view_xview, y1 - view_yview, x2 - x1, y2 - y1);
    }
    else
    {
        context.fillRect(x1 - view_xview, y1 - view_yview, x2 - x1, y2 - y1);
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

// Start drawing a primivite shape, from the x and y position
function draw_primitive_begin()
{
    context.beginPath();
}

// Point to draw to next
function draw_vertex(x, y)
{
    context.lineTo(x - view_xview, y - view_yview);
}

// End the primitive and set if it is filled or not
function draw_primitive_end(fill)
{
    context.closePath();
    if(fill)
    {
        context.fill();
    }
    else
    {
        context.stroke();
    }
}

// Set the drawing filter  using fl_* and fl_calc_*
function draw_set_filter(filter, value, calc_type)
{
    var fil = filter.toString() + '(' + value.toString() + calc_type.toString() + ')';
    //if(context.filter == 'none')
    //{
        context.filter = fil;
    //}
}

// Reset the drawing filter
function draw_reset_filter()
{
    context.filter = 'none';
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
	if(r > 0)
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
}

//#newfile MathHelper

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

// Returns the value of a base expression taken to a specific power
function power(x, y)
{
    return (Math.pow(x, y));
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
    return (Math.sqrt((a * a) + (b * b)));
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

// Get the max value from the array
function max(...values)
{
    return (Math.max(values));
}

// Get the min value from the array
function min(...values)
{
    return (Math.min(values));
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

// Returns a value pulsing at the rate of delay to a maximum number
/*
	var red = pulse(10, 255);
*/
function pulse(delay, max)
{
    var val = sin(delta_time / delay) * max;
	return (val);
}

// Returns a value pulsing at the rate of delay from 0 to a maximum number
function pulse_positive(delay, max)
{
	var val = sin(delta_time / delay) * max;
	return (keep_positive(val));
}

// Returns a value pulsing at the rate of delay from 0 to a maximum number
function pulse_negative(delay, max)
{
	var val = sin(delta_time / delay) * max;
	return (keep_negative(val));
}

// Clamp a value to a max and min value
function clamp(value, min, max)
{
    if(value > max) { value = max; }
    if(value < min) { value = min; }

    return (value);
}

// Execute javascript code from a string
function execute_string(string)
{
    eval(string);
}

// Returns the width of the screen
function screen_get_width()
{
    return (screen.width);
}

// Returns the height of the screen
function screen_get_height()
{
    return (screen.height);
}

// Return a number that is always positive
function keep_positive(x)
{
    if(x < 0)
    {
        x *= -1;
    }

    return (x);
}

// Return a number that is always negative
function keep_negative(x)
{
    if(x > 0)
    {
        x *= -1;
    }

    return (x);
}

// Returns whether or not a rectangle is inside the view bounds
function within_view(x1, y1, x2, y2)
{
    var xx, yy, w, h; // View bounds
    xx = view_xview;
    yy = view_yview;
    w = view_xview + view_wview;
    h = view_yview + view_hview;
    return (
        x1 + (x2) >= xx && y1 + (y2) >= yy && x1 <= w && y1 <= h
    );
}

// Create a new vector2
function vec2(x, y)
{
    this.x = x;
    this.y = y;
}

// Create a new vector2
function vec3(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                console.log("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
};

//#newfile Fake3D

// F3D FUNCTIONS FOR FAKE 3D (Based off w3d by TheSnidr on Game Maker Forums)

// Calculate the natural depth of the instance
// depth = f3d_depth(x, y, 0);
function f3d_depth(x, y, aditional_depth)
{
    return ((point_distance(view_xview + (view_wview / 2), view_yview + (view_hview / 2), x, y) / 10) + aditional_depth);
}

// To make a better feel of 3d, this function should be used
function f3d_calculate_z(z)
{
    if(z <= 0)
    {
        return ((-10 * z) / (0.02 * z - 10));
    }
    return (power(0.8 * z, (0.0008 * z + 1)));
}

function f3d_get_hor(x)
{
    return ((view_xview + view_wview / 2 - x) / 500);
}

function f3d_get_ver(y)
{
    return ((view_yview + view_hview / 2 - y) / 500);
}

function f3d_get_x(x, z)
{
    return (x - f3d_calculate_z(z) * f3d_get_hor(x));
}

function f3d_get_y(y, z)
{
    return (y - f3d_calculate_z(z) * f3d_get_ver(y));
}

// Draw a fake 3d line
function f3d_draw_line(x1, y1, z1, x2, y2, z2)
{
    var z11,z22;
    z11=f3d_calculate_z(z1)
    z22=f3d_calculate_z(z2)
    draw_line(
        x1-(z11 * f3d_get_hor(x1)), 
        y1-(z11 * f3d_get_ver(y1)), 
        x2-(z22 * f3d_get_hor(x2)), 
        y2-(z22 * f3d_get_ver(y2))
    );
}

// Draw a text in fake 3d space
function f3d_draw_text(x, y, z, text)
{
    var tempZ = f3d_calculate_z(z);
    var hor = f3d_get_hor(x);
    var ver = f3d_get_ver(y);

    draw_text(x - (tempZ * hor), y - (tempZ * ver), text);
}

// Draw a circle in fake 3d
function f3d_draw_circle(x, y, z, r, outline)
{
    var tempZ = f3d_calculate_z(z);
    var hor = f3d_get_hor(x);
    var ver = f3d_get_ver(y);

    draw_circle(x - (tempZ * hor), y - (tempZ * ver), r, outline);
}

// Draw a vertext point in 3D
function f3d_draw_vertex(x, y, z)
{
    var zz = f3d_calculate_z(z);

    draw_vertex(x - (zz * f3d_get_hor(x)), y - (zz * f3d_get_ver(y)));
}

// Draw a cylinder in fake 3d 
function f3d_draw_cylinder(x, y, z, r, height, outline)
{
    var xx, yy;

    draw_primitive_begin();
        for(var i = -360 / 10; i < 360; i += 360 / 10)
        {
            xx = x + lengthdir_x(r, i);
            yy = y + lengthdir_y(r, i);

            f3d_draw_vertex(xx, yy, z);
            f3d_draw_vertex(xx, yy, z + height);
        }
    draw_primitive_end(!outline);
}

// Draw a floor or fake 3d rectangle
function f3d_draw_floor(x1, y1, x2, y2, z, outline)
{
    draw_primitive_begin();
        f3d_draw_vertex(x1, y1, z);
        f3d_draw_vertex(x1, y2, z);
        f3d_draw_vertex(x2, y2, z);
        f3d_draw_vertex(x2, y1, z);
    draw_primitive_end(!outline);

    if(outline)
    {
        //f3d_draw_line(x1, y2, z, x2, y1, z);
        f3d_draw_line(x1, y1, z, x2, y2, z);
    }
}

// Draw a fake 3d wall
function f3d_draw_wall(x1, y1, x2, y2, z, height, outline)
{
    draw_primitive_begin();
        f3d_draw_vertex(x1, y1, z);
        f3d_draw_vertex(x1, y1, z + height);
        f3d_draw_vertex(x2, y2, z + height);
        f3d_draw_vertex(x2, y2, z);
    draw_primitive_end(!outline);

    if(outline)
    {
        //f3d_draw_line(x1, y2, z, x2, y1, z + height);
        f3d_draw_line(x2, y1, z, x1, y2, z + height);
    }
}

// Draw a fake 3d cube
function f3d_draw_cube(x1, y1, x2, y2, z, height, outline)
{
    //f3d_draw_floor(x1, y1, x2, y2, z, outline); // The floor (not needed)
    var n, e, s, w, vx, vy; // corners
    n = y1; // up
    e = x2; // right
    s = y2; // down
    w = x1; // left

    vx = view_xview + (view_wview / 2); // Center along the x view
    vy = view_yview + (view_hview / 2); // Center along the y view

    if(n >= vy)
    {
        f3d_draw_wall(x1, y1, x2, y1, z, height, outline); // Top wall
    }
    if(e <= vx)
    {
        f3d_draw_wall(x2, y1, x2, y2, z, height, outline); // Right wall
    }
    if(s <= vy)
    {
        f3d_draw_wall(x2, y2, x1, y2, z, height, outline); // Bottom wall
    }
    if(w >= vx)
    {
        f3d_draw_wall(x1, y2, x1, y1, z, height, outline); // Left wall
    }
    f3d_draw_floor(x1, y1, x2, y2, z + height, outline); // The roof
}

// Draw a fake 3d cube with basic looking lighting
function f3d_draw_test_cube(x1, y1, x2, y2, z, height, outline)
{
    var n, e, s, w, vx, vy; // corners
    n = y1; // up
    e = x2; // right
    s = y2; // down
    w = x1; // left

    vx = view_xview + (view_wview / 2); // Center along the x view
    vy = view_yview + (view_hview / 2); // Center along the y view

    if(n >= vy)
    {
        draw_set_color(rgb(128, 128, 128));
        f3d_draw_wall(x1, y1, x2, y1, z, height, outline); // Top wall
    }
    if(e <= vx)
    {
        draw_set_color(rgb(64, 64, 64));
        f3d_draw_wall(x2, y1, x2, y2, z, height, outline); // Right wall
    }
    if(s <= vy)
    {
        draw_set_color(rgb(156, 156, 156));
        f3d_draw_wall(x2, y2, x1, y2, z, height, outline); // Bottom wall
    }
    if(w >= vx)
    {
        draw_set_color(rgb(200, 200, 200));
        f3d_draw_wall(x1, y2, x1, y1, z, height, outline); // Left wall
    }
    draw_set_color(c_white);
    f3d_draw_floor(x1, y1, x2, y2, z + height, outline);
}

//#newfile PlayerInput

keys = []; // Keyboard keys

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
    var el = document.getElementById('canvasdiv');
    mx = e.x - el.offsetLeft - game.canvas.offsetLeft;// - document.scrollLeft;
    my = e.y - el.offsetTop - game.canvas.offsetTop;// - document.scrollTop;
});

// PLAYER INPUT
function keyboard_check(key)
{
    return(keys[key]);
}

// KEYBOARD KEYS
var KEY = {
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    SPACE:    32,
    PAGEUP:   33,
    PAGEDOWN: 34,
    END:      35,
    HOME:     36,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    INSERT:   45,
    DELETE:   46,
    ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
    A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    TILDA:    192
  };