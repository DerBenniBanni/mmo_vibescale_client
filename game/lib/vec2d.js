export default class Vec2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromAngle(angle) {
        return new Vec2d(Math.cos(angle), Math.sin(angle));
    }
    static fromPolar(angle, radius) {
        return new Vec2d(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    static fromPolarElipse(angle, radiusX, radiusY) {
        // Find the intersection of the ellipse and the line at the given angle from the center
        // x = r * cos(angle), y = r * sin(angle)
        // (x/radiusX)^2 + (y/radiusY)^2 = 1
        // Substitute x and y:
        // (r*cos(angle)/radiusX)^2 + (r*sin(angle)/radiusY)^2 = 1
        // r^2 * (cos^2(angle)/radiusX^2 + sin^2(angle)/radiusY^2) = 1
        // r^2 = 1 / (cos^2(angle)/radiusX^2 + sin^2(angle)/radiusY^2)
        // r = sqrt(1 / (cos^2(angle)/radiusX^2 + sin^2(angle)/radiusY^2))
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const denom = (cosA * cosA) / (radiusX * radiusX) + (sinA * sinA) / (radiusY * radiusY);
        const r = Math.sqrt(1 / denom);
        return new Vec2d(r * cosA, r * sinA);
    }
    clone() {
        return new Vec2d(this.x, this.y);
    }

    add(v) {
        return new Vec2d(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vec2d(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vec2d(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vec2d(this.x / scalar, this.y / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) {
            return new Vec2d(0, 0);
        }
        return new Vec2d(this.x / len, this.y / len);
    }

    perpendicular() {
        return new Vec2d(-this.y, this.x);
    }

    perpendicularLeft() {
        return new Vec2d(this.y, -this.x);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    angleBetween(v) {
        const dot = this.dot(v);
        const len1 = this.length();
        const len2 = v.length();
        if (len1 === 0 || len2 === 0) {
            return 0;
        }
        return Math.acos(dot / (len1 * len2));
    }

    angleBetweenSigned(v) {
        const angle = this.angle();
        const angleV = v.angle();
        const diff = angleV - angle;
        if (diff > Math.PI) {
            return diff - 2 * Math.PI;
        } else if (diff < -Math.PI) {
            return diff + 2 * Math.PI;
        }
        return diff;
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vec2d(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    rotateAround(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return new Vec2d(
            v.x + dx * cos - dy * sin,
            v.y + dx * sin + dy * cos
        );
    }

    distance(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }

    distanceSquared(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }

}