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