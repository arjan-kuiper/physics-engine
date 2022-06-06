import { Vector2 } from "../datatypes";

export default class Circle {
    private _oldPosition: Vector2;
    private _position: Vector2;
    private _color: string;
    private _radius: number;
    private _bounce: number;
    private _friction: number;
    private _gravity: number;

    constructor(x: number, y: number, radius: number) {
        this._oldPosition = new Vector2(x - 5, y - 2);
        this._position = new Vector2(x, y);
        this._color = Math.floor(Math.random() * 16777215).toString(16);
        this._radius = radius;
        this._bounce = 0.8;
        this._friction = 0.995;
        this._gravity = 0.5;
    }

    public calculatePosition(): void {
        const vX = (this._position.x - this._oldPosition.x) * this._friction;
        const vY = (this._position.y - this._oldPosition.y) * this._friction;

        this._oldPosition.copy(this._position);
        this._position.set(this._position.x + vX, this._position.y + vY + this._gravity);

        // Border collision detection
        if (this._position.x + this._radius > 500) {
            this._position.setX(500 - this._radius);
            this._oldPosition.setX(this._position.x + vX * this._bounce);
        } else if (this._position.x - this._radius < 0) {
            this._position.setX(0 + this._radius);
            this._oldPosition.setX(this._position.x + vX * this._bounce);
        }
        if (this._position.y + this._radius > 500) {
            this._position.setY(500 - this._radius);
            this._oldPosition.setY(this._position.y + vY * this._bounce);
        } else if (this._position.y - this._radius < 0) {
            this._position.setY(0 + this._radius);
            this._oldPosition.setY(this._position.y + vY * this._bounce);
        }
    }

    public calculateCollisions(otherCircles: Circle[]): void {
        // Other entity collision detection
        const vX = (this._position.x - this._oldPosition.x) * this._friction;
        const vY = (this._position.y - this._oldPosition.y) * this._friction;

        for (const other of otherCircles) {
            const distance = this._position.distanceTo(other.position);
            if (distance < this._radius + other.radius) {
                // TODO - Collision detection between balls
                const vOX = (other.position.x - other._oldPosition.x) * other._friction;
                const vOY = (other.position.y - other._oldPosition.y) * other._friction;
            }
        }
    }

    get color(): string {
        return this._color;
    }

    get position(): Vector2 {
        return this._position;
    }

    get radius(): number {
        return this._radius;
    }
}