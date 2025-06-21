import Vec2d from "./vec2d.js";

export default class GameObject {
    constructor(position = new Vec2d(0, 0), velocity = new Vec2d(0, 0)) {
        this.type = 'gameobject'; // Type of the game object
        this.game = null; // Reference to the game instance
        this.position = position; // Position of the game object
        this.velocity = velocity; // Velocity of the game object
        this.origin = new Vec2d(0, 0); // Origin point for rendering
        this.width = 0; // Width of the game object
        this.height = 0; // Height of the game object
        this.fillStyle = '#fff'; // Default fill style for rendering
    }

    setDimensions(width, height, originXPercent = 0.5, originYPercent = 0.5) {
        this.width = width;
        this.height = height;
        this.origin = new Vec2d(width * originXPercent, height*originYPercent);
    }

    update(deltaTime) {
        // Update position based on velocity and deltaTime
        this.position = this.position.add(this.velocity.multiply(deltaTime));
    }

    render(ctx) {
        // Default render method, can be overridden by subclasses
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.position.x-this.origin.x, this.position.y-this.origin.y, this.width, this.height);
    }
}