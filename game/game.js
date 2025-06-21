import Player from "./lib/player.js";
import Vec2d from "./lib/vec2d.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.running = false;
        this.lastUpdateTime = 0;

        this.gameobjects = []; // Array to hold game objects

        this.inputActions = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false,
        }
        this.keyMap = {
            ArrowLeft: 'left',
            ArrowRight: 'right',
            ArrowUp: 'up',
            ArrowDown: 'down',
            'Space': 'space',
            'KeyA': 'left',
            'KeyD': 'right',
            'KeyW': 'up',
            'KeyS': 'down',
        };

        this.mmoHandler = null; // Placeholder for MMOHandler instance
        this.mmoUpdateInterval = 1 / 2; // 2 FPS update rate for MMO
        this.mmoNextUpdateTime = 0; // Last MMO update time
    }

    registerMMOHandler(mmoHandler, updatesPerSecond = 2) {
        this.mmoHandler = mmoHandler;
        this.mmoUpdateInterval = 1 / updatesPerSecond; // Convert FPS to milliseconds per update
        this.mmoNextUpdateTime = 0; // Initialize the next update time for MMO
        this.mmoHandler.registerUpdateListener((playerData) => {
            // Handle player state updates from the MMO handler
            const playerId = playerData.id; // Assuming playerData contains a playerId
            if (!playerId) {
                console.error('Player data does not contain playerId:', playerData);
                return;
            }
            let gameObject = this.gameobjects.find(obj => obj.playerId === playerId);
            if (gameObject) {
                gameObject.setState(playerData); // Update the game object's state
            } else if (playerData.isLocal) {
                // If the player is local and not found, create a new game object
                let player = this.gameobjects.find(obj => obj.isLocalPlayer);
                if (!player) {
                    console.error('Local player not found in game objects:', this.gameobjects);
                    return;
                } 
                player.playerId = playerId; // Set the playerId for the local player
            } else {
                // Create a new remote player game object with the received state
                let position = playerData.position ? new Vec2d(playerData.position.x, playerData.position.y) : new Vec2d(0, 0);
                let velocity = playerData.velocity ? new Vec2d(playerData.velocity.x, playerData.velocity.y) : new Vec2d(0, 0);
                let remotePlayer = this.addGameObject(
                    new Player(
                        new Vec2d(position.x, position.y),
                        new Vec2d(velocity.x, velocity.y)
                    )
                );
                remotePlayer.playerId = playerId;
                remotePlayer.fillStyle = '#a00'; // Set a different color for remote players
            }
        }
        );
        this.mmoHandler.connect(); // Establish the WebSocket connection
    }

    registerKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            const action = this.keyMap[event.code];
            if (action) {
                this.inputActions[action] = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            const action = this.keyMap[event.code];  
            if (action) {
                this.inputActions[action] = false;
            }
        });
    }

    addGameObject(gameObject) {
        this.gameobjects.push(gameObject);
        gameObject.game = this; // Set the game reference in the game object
        return gameObject;
    }

    loop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;

        this.update(deltaTime);
        this.render();

        if(this.mmoHandler) {
            this.mmoNextUpdateTime += deltaTime; 
            if(this.mmoNextUpdateTime >= this.mmoUpdateInterval) {
                let localPlayer = this.gameobjects.find(obj => obj.isLocalPlayer);
                if (localPlayer) {
                    // Send the local player's state to the MMO handler
                    this.mmoHandler.updatePlayer(localPlayer.getState());
                }
                this.mmoNextUpdateTime = 0; // Reset the MMO update timer
            }
        }

        if (this.running) {
            requestAnimationFrame(() => this.loop());
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastUpdateTime = performance.now();
            this.loop();
        }
    }

    stop() {
        this.running = false;
    }

    update(deltaTime) {
        this.gameobjects.forEach(gameObject => {
            gameObject.update(deltaTime);
        });
    }

    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.gameobjects.forEach(gameObject => {
            gameObject.render(this.ctx);
        });
    }

}