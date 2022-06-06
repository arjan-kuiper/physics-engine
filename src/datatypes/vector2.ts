export default class Vector2 {
    private _x: number;
    private _y: number;
    
    constructor(x?: number, y?:number) {
        this._x = x || 0;
        this._y = y || 0;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    public set(x: number, y: number): void {
        this._x = x;
        this._y = y;
    }
    
    public setX(x: number): void {
        this._x = x;
    }

    public setY(y: number): void {
        this._y = y;
    }

    public copy(target: Vector2): void {
        this._x = target.x;
        this._y = target.y;
    }

    public distanceTo(target: Vector2): number {
        const distX = Math.pow(target.x - this._x, 2);
        const distY = Math.pow(target.y - this._y, 2);
        return Math.sqrt(distX + distY);
    }

    public multiplyScalar(scalar: number): void {
        this._x *= scalar;
        this._y *= scalar;
    }

    public divideScalar(scalar: number): void {
        this.multiplyScalar(1 / scalar);
    }

    public normalize(): void {
        this.divideScalar(Math.sqrt(this._x * this._x + this._y * this._y) || 1);
    }
}