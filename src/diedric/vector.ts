import { DiedricNumber } from "./number";

export class DiedricVector {
    type = "DiedricVector";
    private _x: DiedricNumber;
    private _y: DiedricNumber;
    private _z: DiedricNumber;
    constructor({
        x,
        y,
        z,
    }: {
        x: DiedricNumber;
        y: DiedricNumber;
        z: DiedricNumber;
    }) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    set x(newX: DiedricNumber) {
        this._x = newX;
    }
    set y(newY: DiedricNumber) {
        this._y = newY;
    }
    set z(newZ: DiedricNumber) {
        this._z = newZ;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }

    normalize() {
        const vectorModule = Math.sqrt(
            this._x.x ** 2 + this._y.x ** 2 + this._z.x ** 2
        );
        this._x.x = this._x.x / vectorModule;
        this._z.x = this._z.x / vectorModule;
        this._y.x = this._y.x / vectorModule;

        return this;
    }

    delete() {
        console.warn("DiedricVector Implement delete");
    }
}
