import { useLayoutEffect, useRef } from "react";
import { Block, objects, SubBlock } from "./tempConstants";
import EquationEditor from "equation-editor-react";
function BlockInput({ input }: { input: SubBlock }) {
    return (
        <div
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
}

function BlockBlock({ block }: { block: SubBlock }) {
    return (
        <div
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
                    {Object.entries(block.inputs).map((input, index) => {
                        return (
                            <label
                                id={input[1][0] + "-" + input[1][1]}
                                key={"input-param-" + index}
                                className="line-connector in bg-black/15 rounded-r-lg p-1 w-[70px] text-left px-2"
                            >
                                <EquationEditor
                                    value={input[0]}
                                    onChange={() => {}}
                                    autoCommands={"pi"}
                                    autoOperatorNames={"sin"}
                                />
                            </label>
                        );
                    })}
                </div>
                <div className="min-w-3" />
                <div className="flex flex-col gap-y-1 w-fit">
                    <label
                        id={block.id + "-value"}
                        className="line-connector out bg-black/15 rounded-l-lg p-1  text-right px-2"
                    >
                        <EquationEditor
                            value={
                                "\\left(" +
                                block.outputs.join(",\\ \\ ") +
                                "\\right)"
                            }
                            onChange={() => {}}
                            autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
                            autoOperatorNames="sin cos tan"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

function BlockOutput({ block }: { block: SubBlock }) {
    {
        return (
            <div
                className="text-white py-2  w-fit rounded-lg shadow-md absolute"
                style={{
                    backgroundColor: block.color,
                    top: `${block.y}px`,
                    left: `${block.x}px`,
                }}
            >
                <label className="px-2">{block.type}</label>
                <div className="flex flex-col gap-y-1 w-fit">
                    {Object.entries(block.inputs).map((input, index) => {
                        return (
                            <label
                                id={input[1][0] + "-" + input[1][1]}
                                key={"input-param-" + index}
                                className="line-connector in bg-black/15 rounded-r-lg p-1 text-left pl-2 pr-2"
                            >
                                {input[0]}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export function BlockBuilder({ block }: { block: Block }) {
    // const colors = [
    //     "#c74440",
    //     "#2d70b3",
    //     "#388c46",
    //     "#6042a6",
    //     "#fa7e19",
    //     "#000000",
    // ];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        canvasRef.current.width = canvasRef.current.offsetWidth;

        ctx.fillStyle = "white";
        ctx.fillRect(
            0,
            0,
            canvasRef.current.offsetWidth,
            canvasRef.current.offsetHeight
        );

        const canvasBoundaries = canvasRef.current.getBoundingClientRect();

        document
            .querySelectorAll(".line-connector.out")
            .forEach((outElement) => {
                document
                    .querySelectorAll(`#${outElement.id}.line-connector.in`)
                    .forEach((inElement) => {
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
    }, [canvasRef, block]);

    return (
        <div className="w-full h-full max-w-full max-h-full absolute bg-white flex flex-col">
            <div className="p-1 flex flex-row gap-x-1 items-center">
                <label className="text-xl font-semibold text-black">
                    {block ? block.name : "No block selected"}
                </label>
            </div>
            <div className="bg-red-200 relative w-full min-h-0 max-h-full h-full">
                <canvas className="absolute w-full h-full" ref={canvasRef} />
                {block &&
                    block.inputs.map((input, index) => {
                        return (
                            <BlockInput
                                key={"input-" + index + "-" + block.name}
                                input={input}
                            ></BlockInput>
                        );
                    })}

                {block &&
                    block.blocks.map((subBlock: SubBlock, index) => (
                        <BlockBlock
                            block={subBlock}
                            key={"block-" + index + "-" + block.name}
                        />
                    ))}
                {block &&
                    block.outputs?.map((subBlock, index) => (
                        <BlockOutput
                            block={subBlock}
                            key={"output-" + index + "-" + block.name}
                        />
                    ))}
            </div>
        </div>
    );
}
