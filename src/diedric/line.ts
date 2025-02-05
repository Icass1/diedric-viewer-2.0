import { Diedric } from "./diedric";
import { DiedricVector } from "./vector";

export class DiedricLine {
    private _r: DiedricVector;
    private _v: DiedricVector;
    private _diedric: Diedric;
    type = "DiedricLine";
    constructor({
        r,
        v,
        diedric,
    }: {
        r: DiedricVector;
        v: DiedricVector;
        diedric: Diedric;
    }) {
        this._r = r;
        this._v = v;
        this._diedric = diedric;
    }
    delete() {
        console.warn("DiedricLine Implement delete");
    }
}
