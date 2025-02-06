import { Diedric } from "./diedric/diedric";
import { DiedricLine } from "./diedric/line";
import { DiedricNumber } from "./diedric/number";
import { DiedricPlane } from "./diedric/plane";
import { DiedricPoint } from "./diedric/point";
import { DiedricVector } from "./diedric/vector";
import { Block, blocks, objects, SubBlock } from "./tempConstants";
import { compareArrays } from "./utils/compareArrays";

interface ExpressionListener {
    delete: (() => void)[];
    update: (() => void)[];
    errorUpdate: ((e: boolean) => void)[];
}
export class Expression {
    private _text: string = "";
    private _values: (
        | DiedricVector
        | DiedricNumber
        | DiedricPlane
        | DiedricPoint
        | DiedricLine
    )[] = [];
    private _name: string | undefined;
    private _params: (string | number)[];
    private _expressions: Expression[];
    private _error: boolean = true;
    private _listeners: ExpressionListener = {
        delete: [],
        update: [],
        errorUpdate: [],
    };
    private _parsedParams: (
        | DiedricVector
        | DiedricNumber
        | DiedricPlane
        | DiedricPoint
        | DiedricLine
    )[];
    private _diedric: Diedric;

    constructor({
        text,
        expressions,
        diedric,
    }: {
        text?: string;
        expressions: Expression[];
        diedric: Diedric;
    }) {
        this._text = text ?? "";
        this._expressions = expressions;
        this._diedric = diedric;
        this.parseText();
    }

    parseText() {
        const match = this._text.match(
            /^([A-Za-z_][A-Za-z0-9_]*)?\s*=?\s*\(([^)]*)\)|^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(\S+)$/
        );
        if (!match) {
            console.warn("Syntax error");
            this.error = true;
            return;
        }
        this.error = false;

        this._name = match[1] || match[3];
        this._params = this.parseParams(match[2] || match[4]);

        // Check special case where the expression is only a number.
        if (this._params.length == 1 && typeof this._params[0] == "number") {
            if (
                this._values.length == 1 &&
                this._values[0] instanceof DiedricNumber
            ) {
                this._values[0].x = Number(this._params[0]);
            } else {
                this._values = [
                    new DiedricNumber({ x: Number(this._params[0]) }),
                ];
            }
        } else {
            this._parsedParams = this._params.map((param) => {
                const result = this._expressions.find(
                    (expression) => expression._name == param
                );
                if (result?._values.length == 1) {
                    return result?._values[0];
                } else {
                    console.error(
                        "this._parsedParams = this._params.map should not be more than one"
                    );
                }
            });
            // If a parsed parameter is undefined because the expression doesn't exists or exists but it's value is undefined, set error to true.
            if (this._parsedParams.includes(undefined)) {
                console.warn("There is a _parsedParams that is undefined");



                this.error = true;
                
                this._expressions.forEach((expression) => {
                    if (expression._params && expression._params.includes(this._name)) {
                        expression.parseText();
                    }
                });
                return;
            }

            const parsedParamsTypesSorted = this._parsedParams.map(
                (param) => param.type
            );
            parsedParamsTypesSorted.sort();

            // Get matches by getting the blocks that have the same inputs as the parameters in the text.
            const matches = blocks.filter((block) => {
                const blockInputTypesSorted = block.inputs.map(
                    (input) => input.type
                );
                blockInputTypesSorted.sort();

                return compareArrays(
                    parsedParamsTypesSorted,
                    blockInputTypesSorted
                );
            });

            // If there are no matches set error to true.
            if (matches.length == 0) {
                console.warn("No maches found");
                this.error = true;
                return;
            }
            const match = matches[0]; // Temporary get always first match

            // If there are multiple outputs, the expression cannot be set to a variable. Until lists are implemented.
            if (match.outputs.length > 1 && this._name) {
                console.warn(
                    "Unable to asing multiple objects to one variable"
                );
                this.error = true;
                return;
            }

            const updatedValues = [];

            match.outputs.map((output) => {
                const parsedInputs = { ...output.inputs } as SubBlock["inputs"] | { [key: string]: DiedricVector | DiedricNumber };

                Object.entries(output.inputs).map((input, index) => {
                    const blockId = input[1][0];

                    let block: SubBlock | undefined
                    block = match.blocks.find(
                        (block) => block.id == blockId
                    );
                    if (!block) {
                        block = match.inputs.find(
                            (block) => block.id == blockId
                        );
                    }

                    if (!block) {
                        console.warn("Block not found. searching for", blockId)
                        this.error = true
                        return
                    }
                    if (block.type == "calc") {
                        parsedInputs[input[0]] = this.evalCalcBlock(
                            match,
                            block
                        );
                    } else if (block.type == "calcVect") {
                        parsedInputs[input[0]] = this.evalCalcVectBlock(
                            match,
                            block
                        );
                    } else if (block.type == "DiedricPoint" && this._parsedParams[index] instanceof DiedricPoint) {
                        // TODO - This condition has to be checked with other examples
                        parsedInputs[input[0]] = this._parsedParams[index].r
                    } else { console.warn("Unkwown block.type", block.type) }
                });


                const valueToUpdate = this._values.find((value) => {
                    return (
                        value instanceof objects[output.type].prototype &&
                        !updatedValues.includes(value)
                    );
                });
                if (valueToUpdate) {
                    // console.log("Object updated", valueToUpdate);
                    updatedValues.push(valueToUpdate);
                    Object.entries(parsedInputs).map((param) => {
                        valueToUpdate[param[0]] = param[1];
                    });
                } else {
                    // console.log("New object created");
                    // @ts-expect-error Extremely hard to type parsedInputs.
                    const newValue = new objects[output.type].prototype({
                        diedric: this._diedric,
                        ...parsedInputs,
                    });
                    updatedValues.push(newValue);
                    this._values.push(newValue);
                }
            });
        }
        this._expressions.forEach((expression) => {
            if (expression._params && expression._params.includes(this._name)) {
                expression.parseText();
            }
        });



    }

    evalCalcBlock(match: Block, block: SubBlock) {
        console.warn("evalCalcBlock");
        console.warn(match, block);

        return new DiedricNumber({ x: 52 })

    }

    evalCalcVectBlock(match: Block, block: SubBlock): DiedricVector {
        let variableDeclaration = "";

        // Search in inputs
        Object.entries(block.inputs).map((input, index) => {
            const a = match.inputs.find((_input) => _input.id == input[1][0]);

            if (!a) return

            if (
                a.type == "DiedricNumber" &&
                this._parsedParams[index] instanceof DiedricNumber
            ) {
                variableDeclaration += `let ${input[0]}=${this._parsedParams[index].x};`;

            } else if (a.type == "DiedricPoint" &&
                this._parsedParams[index] instanceof DiedricPoint) {
                variableDeclaration += `let ${input[0]}={x:${this._parsedParams[index].r.x.x}, y:${this._parsedParams[index].r.y.x}, z:${this._parsedParams[index].r.z.x}};`;
            } else {
                console.warn("To implment");
            }
        });

        // Search in blocks
        // TODO





        return new DiedricVector({
            x: new DiedricNumber({
                x: eval(variableDeclaration + block.outputs[0]),
            }),
            y: new DiedricNumber({
                x: eval(variableDeclaration + block.outputs[1]),
            }),
            z: new DiedricNumber({
                x: eval(variableDeclaration + block.outputs[2]),
            }),
        });
    }

    private parseParams(paramString: string): (string | number)[] {
        if (!paramString) return [];
        return paramString.split(/\s*,\s*/).map((value) => {
            return isNaN(Number(value)) ? value : Number(value);
        });
    }

    set text(value: string) {
        const oldName = this._name;

        this._text = value;

        this.parseText();

        this._expressions.forEach((expression) => {
            if (expression._params && expression._params.includes(oldName) && oldName != this._name) {
                console.warn("Variable doesn't exist")
                expression.error = true;
            }
            if (expression._params && expression._params.includes(this._name)) {
                expression.parseText();
            }
        });
    }

    get text() {
        return this._text;
    }

    set error(value: boolean) {
        this._error = value;
        if (value == true) {
            this._values.map((value) => value.delete());
            this._values = [];
        }
        this._listeners.errorUpdate.forEach((callback) =>
            callback(this._error)
        );
    }
    get error() {
        return this._error;
    }

    get values() {
        return this._values;
    }
    addEventListener(
        eventName: "delete" | "update" | "errorUpdate",
        callback: (e?: boolean) => void
    ) {
        this._listeners[eventName].push(callback);
    }
}
