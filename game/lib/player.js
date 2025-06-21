import GameObject from "./gameobject.js";
import Vec2d from "./vec2d.js";

export default class Player extends GameObject {
    constructor(position, velocity, isLocalPlayer = false) {
        super(position, velocity);
        this.type = 'player'; // Type of the game object
        this.game = null; // Will be set when added to the game
        this.width = 50; // Default width
        this.height = 50; // Default height
        this.originX = 0.5; // Default origin X (centered)
        this.originY = 0.5; // Default origin Y (centered)
        this.isLocalPlayer = isLocalPlayer; // Flag to indicate if this is the local player
        this.playerId = null; // Unique identifier for the player
    }

    getState() {
        return {
            position: {x: this.position.x, y: this.position.y},
            velocity: {x: this.velocity.x, y: this.velocity.y},
        }
    }

    setState(state) {
        if (state.position) {
            this.position = new Vec2d(state.position.x, state.position.y);
        }
        if (state.velocity) {
            this.velocity = new Vec2d(state.velocity.x, state.velocity.y);
        }
    }

    update(deltaTime) {
        if(this.isLocalPlayer) {
            // Handle player input
            const input = this.game.inputActions;
            const speed = 200; // Speed of the player in pixels per second
            if (input.left) {
                this.velocity = this.velocity.add(new Vec2d(-speed * deltaTime, 0));
            }
            if (input.right) {
                this.velocity = this.velocity.add(new Vec2d(speed * deltaTime, 0));
            }
            if (input.up) {
                this.velocity = this.velocity.add(new Vec2d(0, -speed * deltaTime));
            }
            if (input.down) {
                this.velocity = this.velocity.add(new Vec2d(0, speed * deltaTime));
            }
            if (input.space) {
                // Example action for space key, e.g., shoot or jump
                console.log("Space key pressed");
            }
        }
        // Update player position based on velocity
        super.update(deltaTime);
    }

}