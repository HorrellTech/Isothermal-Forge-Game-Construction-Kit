
// Get color from rgb color values
function rgb(r, g, b)
{
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(",r,",",g,",",b,")"].join("");
}