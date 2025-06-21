import Game from './game.js';
import MMOHandler from './lib/mmohandler.js';
import Player from './lib/player.js';
import Vec2d from './lib/vec2d.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');

    const game = new Game(canvas);
    window.game = game; // Expose the game instance globally for debugging

    const mmoHandler = new MMOHandler(game, 'js13k-poc-derbennibanni');
    window.mmoHandler = mmoHandler; // Expose the MMOHandler instance globally for debugging
    //mmoHandler.connect();
    game.registerMMOHandler(mmoHandler, 2); // Register the MMO handler with 2 updates per second

    game.registerKeyboardEvents();

    let player = game.addGameObject(new Player(new Vec2d(100, 100), new Vec2d(0, 0), true));
    player.setDimensions(50, 50, 0.5, 0.5); // Set dimensions and origin


    game.start();
});