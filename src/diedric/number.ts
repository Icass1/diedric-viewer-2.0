export class DiedricNumber {
    type = "DiedricNumber";
    private _x: number;
    constructor({ x }: { x: number }) {
        // console.log("DiedricNumber", x);
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set x(newX: number) {
        // console.log("Update DiedricNumber", this._x, "->", newX);
        this._x = newX;
    }
    delete() {
        console.warn("DiedricNumber Implement delete");
    }
}
