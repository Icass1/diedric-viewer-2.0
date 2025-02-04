import { useEffect, useLayoutEffect, useRef, useState } from "react";

class DiedricNumber {
    constructor() {}
}

class DiedricVector {
    constructor() {}
}

function Expression({
    expressions,
    setExpressions,
}: {
    expressions: { [key: string]: DiedricNumber | DiedricVector }[];
    setExpressions: React.Dispatch<
        React.SetStateAction<
            {
                [key: string]: DiedricNumber | DiedricVector;
            }[]
        >
    >;
}) {
    const [value, setValue] = useState("Px = 5");
    const [sliderValue, setSliderValue] = useState(5);

    const [expression, setExpression] = useState<DiedricNumber | DiedricVector>(
        undefined
    );
    useEffect(() => {
        if (expressions.includes(expression)) return;
        if (!expression) return;

        setExpressions((value) => [...value, { Px: expression }]);
    }, [expression, expressions, setExpressions]);
    return (
        <div className="bg-neutral-300 p-2 rounded">
            <input
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                className="bg-neutral-300 focus:outline-none border-b-2 w-full border-neutral-600 border-solid"
            />
            <div className="flex flex-row items-center">
                <label>-10</label>
                <input
                    type="range"
                    min={-10}
                    max={10}
                    value={sliderValue}
                    onChange={(e) =>
                        setSliderValue(Number(e.currentTarget.value))
                    }
                ></input>
                <label>10</label>
            </div>
        </div>
    );
}
function BlockBuilder() {
    // const colors = [
    //     "#c74440",
    //     "#2d70b3",
    //     "#388c46",
    //     "#6042a6",
    //     "#fa7e19",
    //     "#000000",
    // ];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const objects: {
        [key: string]: {
            params: { [key: string]: DiedricNumber | DiedricVector };
        };
    } = {
        DiedricNumber: {
            params: {
                x: DiedricNumber,
            },
        },
        DiedricVector: {
            params: {
                x: DiedricNumber,
                y: DiedricNumber,
                z: DiedricNumber,
            },
        },
        DiedricPlane: {
            params: {
                v: DiedricVector,
                d: DiedricNumber,
            },
        },
        DiedricLine: {
            params: {
                v: DiedricVector,
                r: DiedricVector,
            },
        },
        DiedricPoint: {
            params: {
                r: DiedricVector,
            },
        },
    };

    const block = {
        inputs: [
            {
                type: "DiedricNumber",
                id: "sffaweva",
                color: "#2d70b3",
                x: 10,
                y: 50,
            },
            {
                type: "DiedricNumber",
                id: "feafva",
                color: "#2d70b3",
                x: 10,
                y: 150,
            },
            {
                type: "DiedricNumber",
                id: "vasrfew",
                color: "#2d70b3",
                x: 10,
                y: 250,
            },
        ],
        ouputs: [
            {
                type: "DiedricPoint",
                id: "fafghswffv",
                color: "#c74440",
                inputs: {
                    r: ["fawefvawtr", "value"],
                },
                x: 500,
                y: 120,
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "calcVect",
                outputs: ["math exp", "math exp", "math exp"],
                inputs: {
                    x: ["sffaweva", "x"],
                    y: ["feafva", "x"],
                    z: ["vasrfew", "x"],
                },
                color: "#fa7e19",
                x: 250,
                y: 120,
            },
        ],
    };

    useLayoutEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        canvasRef.current.width = canvasRef.current.offsetWidth;

        ctx.fillStyle = "white";
        ctx.fillRect(
            0,
            0,
            canvasRef.current.offsetHeight,
            canvasRef.current.offsetWidth
        );

        const canvasBoundaries = canvasRef.current.getBoundingClientRect();

        document
            .querySelectorAll(".line-connector.out")
            .forEach((outElement: HTMLLabelElement) => {
                document
                    .querySelectorAll(`#${outElement.id}.line-connector.in`)
                    .forEach((inElement: HTMLLabelElement) => {
                        const inBoundaries = inElement.getBoundingClientRect();
                        const outBoundaries =
                            outElement.getBoundingClientRect();

                        ctx.beginPath();
                        ctx.moveTo(
                            outBoundaries.x -
                                canvasBoundaries.x +
                                outBoundaries.width,
                            outBoundaries.y -
                                canvasBoundaries.y +
                                outBoundaries.height / 2
                        );
                        ctx.lineTo(
                            inBoundaries.x - canvasBoundaries.x,
                            inBoundaries.y -
                                canvasBoundaries.y +
                                inBoundaries.height / 2
                        );
                        ctx.stroke();
                    });
            });
    }, [canvasRef]);

    return (
        <div className="bg-white w-full h-full relative">
            <canvas
                className="absolute top-0 left-0 w-full h-full"
                ref={canvasRef}
            />
            {block.inputs.map((input, index) => {
                return (
                    <div
                        key={"input-" + index}
                        className="text-white p-2 pr-0 w-fit rounded-lg shadow-md absolute"
                        style={{
                            backgroundColor: input.color,
                            top: `${input.y}px`,
                            left: `${input.x}px`,
                        }}
                    >
                        <label className="pr-2">{input.type}</label>
                        <div className="flex flex-col gap-y-1 mr-0 ml-auto w-fit">
                            {Object.entries(objects[input.type].params).map(
                                (param, index) => {
                                    // console.log(param[1] == DiedricVector); // TODO - show that is a vector with an arrow on top of the letter

                                    return (
                                        <label
                                            key={"input-param-" + index}
                                            id={input.id + "-" + param[0]}
                                            className="line-connector out bg-black/15 rounded-l-lg p-1 w-[30px] text-right pr-2"
                                        >
                                            {param[0]}
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </div>
                );
            })}

            {block.blocks.map((block, index) => {
                return (
                    <div
                        key={"input-" + index}
                        className="text-white py-2  w-fit rounded-lg shadow-md absolute"
                        style={{
                            backgroundColor: block.color,
                            top: `${block.y}px`,
                            left: `${block.x}px`,
                        }}
                    >
                        <label className="px-2">{block.type}</label>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col gap-y-1 w-fit">
                                {Object.entries(block.inputs).map(
                                    (input, index) => {
                                        return (
                                            <label
                                                id={
                                                    input[1][0] +
                                                    "-" +
                                                    input[1][1]
                                                }
                                                key={"input-param-" + index}
                                                className="line-connector in bg-black/15 rounded-r-lg p-1 w-[70px] text-left px-2"
                                            >
                                                {input[0]}
                                            </label>
                                        );
                                    }
                                )}
                            </div>
                            <div className="min-w-3" />
                            <div className="flex flex-col gap-y-1 w-fit">
                                <label
                                    id={block.id + "-value"}
                                    className="line-connector out bg-black/15 rounded-l-lg p-1 w-[70px] text-right px-2"
                                >
                                    Out
                                </label>
                            </div>
                        </div>
                    </div>
                );
            })}
            {block.ouputs.map((block, index) => {
                return (
                    <div
                        key={"input-" + index}
                        className="text-white py-2  w-fit rounded-lg shadow-md absolute"
                        style={{
                            backgroundColor: block.color,
                            top: `${block.y}px`,
                            left: `${block.x}px`,
                        }}
                    >
                        <label className="px-2">{block.type}</label>
                        <div className="flex flex-col gap-y-1 w-fit">
                            {Object.entries(block.inputs).map(
                                (input, index) => {
                                    return (
                                        <label
                                            id={input[1][0] + "-" + input[1][1]}
                                            key={"input-param-" + index}
                                            className="line-connector in bg-black/15 rounded-r-lg p-1 text-left pl-2 pr-2"
                                        >
                                            {input[0]}
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function App() {
    const [expressions, setExpressions] = useState<
        { [key: string]: DiedricNumber | DiedricVector }[]
    >([]);

    return (
        <div className="grid grid-cols-[400px_1fr] h-full">
            <div className="bg-red-400 flex flex-col p-2">
                <Expression
                    expressions={expressions}
                    setExpressions={setExpressions}
                ></Expression>
            </div>
            <BlockBuilder />
        </div>
    );
}

export default App;
