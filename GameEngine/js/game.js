var $container = document.getElementById('container');

// Create base game class
function Game() {
    this.viewport = document.createElement('canvas');
    this.context = viewport.getContext('2d');

    this.viewport.width = 800;
    this.viewport.height = 600;

    // Append the canvas node to our container
    $container.insertBefore(this.viewport, $container.firstChild);

    // Toss some text into our canvas
    this.context.font = '32px Arial';
    this.context.fillText('Boo!', 5, 50, 800);

    return this;
}

// Instantiate the game in a global
window.game = new Game();

// Export the game as a module
module.exports = game;