import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Block, objects, SubBlock } from "./tempConstants";
import { EditableMathField, StaticMathField } from "react-mathquill";
import { makeid } from "./utils/createId";

function BlockInput({
    block,
    forDisplay = false,
    onClick,
}: {
    block: SubBlock;
    forDisplay?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={
                "text-white p-2 pr-0 w-fit  rounded-lg shadow-md select-none " +
                (typeof block.x == "number" && typeof block.y == "number"
                    ? " absolute "
                    : "") +
                (forDisplay ? " hover:scale-[1.02] transition-transform " : "")
            }
            style={{
                backgroundColor: "#c74440",
                top: `${block.y}px`,
                left: `${block.x}px`,
            }}
        >
            <label className="pr-2 text-nowrap">
                {block.type}
                <label className="text-sm">
                    {" id:"}
                    {block.id}
                </label>
            </label>
            <div className="flex flex-col gap-y-1 mr-0 ml-auto w-fit">
                {Object.entries(objects[block.type].params).map(
                    (param, index) => {
                        // console.log(param[1] == DiedricVector); // TODO - show that is a vector with an arrow on top of the letter

                        return (
                            <label
                                key={"input-param-" + index}
                                id={block.id + "-" + param[0]}
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

function BlockBlock({
    block,
    forDisplay = false,
    onClick,
}: {
    block: SubBlock;
    forDisplay?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={
                "text-white py-2 w-fit rounded-lg shadow-md select-none " +
                (typeof block.x == "number" && typeof block.y
                    ? " absolute "
                    : "") +
                (forDisplay ? " hover:scale-[1.02] transition-transform " : "")
            }
            style={{
                backgroundColor: "#388c46",
                top: `${block.y}px`,
                left: `${block.x}px`,
            }}
        >
            <label className="px-2 text-nowrap">
                {block.type}
                <label className="text-sm">
                    {" id:"}
                    {block.id}
                </label>
            </label>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-y-1 w-fit">
                    {block.inputs &&
                        Object.entries(block.inputs).map((input, index) => {
                            return (
                                <label
                                    id={input[1][0] + "-" + input[1][1]}
                                    key={"input-param-" + index}
                                    className="line-connector in bg-black/15 rounded-r-lg p-1 w-[70px] text-left px-2"
                                >
                                    <EditableMathField
                                        id="blockbuilder-mathquill-styles"
                                        latex={input[0]}
                                        onChange={() => {}}
                                    />
                                </label>
                            );
                        })}
                </div>
                <div className="min-w-3" />
                <div className="flex flex-col gap-y-1 w-fit">
                    <label
                        id={block.id + "-value"}
                        className="line-connector relative out bg-black/15 rounded-l-lg p-1  text-right px-2"
                    >
                        {block.outputs ? (
                            <EditableMathField
                                id="blockbuilder-mathquill-styles"
                                latex={
                                    "\\left(" +
                                    block.outputs.join(",\\ \\ ") +
                                    "\\right)"
                                }
                                onChange={() => {}}
                            />
                        ) : (
                            <StaticMathField>
                                {block.type == "calc" ? "a" : "\\bar v"}
                            </StaticMathField>
                        )}
                        <div className="w-2 h-2 -right-1 hover:scale-150 transition-all cursor-pointer bg-[#43c559] rounded-full absolute top-1/2 -translate-y-1/2"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

function BlockOutput({
    block,
    forDisplay = false,
    onClick,
}: {
    block: SubBlock;
    forDisplay?: boolean;
    onClick?: () => void;
}) {
    {
        const [selected, setSelected] = useState(false);

        return (
            <div
                onClick={() =>
                    forDisplay
                        ? onClick && onClick()
                        : setSelected((value) => !value)
                }
                className={
                    "text-white py-2  w-fit  rounded-lg shadow-md select-none transition-all outline  " +
                    (typeof block.x == "number" && typeof block.y
                        ? " absolute "
                        : "") +
                    (forDisplay ? " hover:scale-[1.02] " : "") +
                    (selected ? " outline-blue-900 " : " outline-transparent ")
                }
                style={{
                    backgroundColor: "#2d70b3",
                    top: `${block.y}px`,
                    left: `${block.x}px`,
                }}
            >
                <label className="px-2 text-nowrap">
                    {block.type}
                    <label className="text-sm">
                        {" id:"}
                        {block.id}
                    </label>
                </label>
                <div className="flex flex-col gap-y-1 w-fit">
                    {Object.entries(block.inputs).map((input, index) => {
                        return (
                            <StaticMathField
                                onMouseUp={() => console.log("handleMouseUp")}
                                id={input[1][0] + "-" + input[1][1]}
                                key={"input-param-" + index}
                                className="line-connector in bg-black/15 rounded-r-lg p-1 text-left pl-2 pr-2"
                            >
                                {input[0]}
                            </StaticMathField>
                        );
                    })}
                </div>
            </div>
        );
    }
}

function InptusForDisplay({
    setDraggingObject,
}: {
    setDraggingObject: React.Dispatch<
        React.SetStateAction<{
            blockInfo: SubBlock;
            blockType: "input" | "output" | "block";
        }>
    >;
}) {
    const handleClick = (object: string) => {
        setDraggingObject({
            blockInfo: {
                ...{ type: object, id: "" },
                x: 1,
                y: 1,
            },
            blockType: "input",
        });
    };

    return (
        <>
            {[
                "DiedricNumber",
                "DiedricPoint",
                "DiedricLine",
                "DiedricPlane",
            ].map((object) => (
                <BlockInput
                    key={object}
                    onClick={() => handleClick(object)}
                    block={{
                        id: "",
                        type: object,
                    }}
                    forDisplay
                />
            ))}
        </>
    );
}

function BlocksForDisplay({
    setDraggingObject,
}: {
    setDraggingObject: React.Dispatch<
        React.SetStateAction<{
            blockInfo: SubBlock;
            blockType: "input" | "output" | "block";
        }>
    >;
}) {
    const handleClick = (block: SubBlock) => {
        setDraggingObject({
            blockInfo: {
                ...{ type: block.type, id: "" },
                x: 1,
                y: 1,
                inputs: block.inputs,
                outputs: block.outputs,
            },
            blockType: "block",
        });
    };

    const blocks: SubBlock[] = [
        {
            id: "",
            type: "calc",
            inputs: {
                "\\bar r_1": ["asad", "r"],
                "\\bar p_2": ["aasf", "r"],
            },
        },
        {
            id: "",
            type: "calcVect",
            inputs: {
                "\\bar v_1": ["asad", "r"],
                a: ["aasf", "r"],
            },
            outputs: ["a \\cdot v_1.x", "a \\cdot v_1.y", "a \\cdot v_1.z"],
        },
        {
            id: "",
            type: "corssVect",
            inputs: {
                "\\bar v_1": ["asad", "r"],
                "\\bar v_2": ["aasf", "r"],
            },
        },
    ];

    return blocks.map((block) => (
        <BlockBlock
            key={block.type}
            block={block}
            onClick={() => handleClick(block)}
        />
    ));
}

function OutputsForDisplay({
    setDraggingObject,
}: {
    setDraggingObject: React.Dispatch<
        React.SetStateAction<{
            blockInfo: SubBlock;
            blockType: "input" | "output" | "block";
        }>
    >;
}) {
    const handleClick = (block: SubBlock) => {
        setDraggingObject({
            blockInfo: {
                ...{ type: block.type, id: "" },
                x: 1,
                y: 1,
                inputs: block.inputs,
            },
            blockType: "output",
        });
    };

    const blocks: SubBlock[] = [
        {
            id: "",
            type: "DiedricPoint",
            inputs: {
                "\\bar r": ["asad", "r"],
            },
        },
        {
            id: "",
            type: "DiedricPlane",
            inputs: {
                "\\bar r": ["asad", "r"],
                d: ["aasf", "r"],
            },
        },
        {
            id: "",
            type: "DiedricLine",
            inputs: {
                "\\bar r": ["asad", "r"],
                "\\bar v": ["aasf", "r"],
            },
        },
        {
            id: "",
            type: "DiedricSegment",
            inputs: {
                "\\bar r_1": ["asad", "r"],
                "\\bar r_2": ["aasf", "r"],
            },
        },
    ];

    return (
        <>
            {blocks.map((block) => (
                <BlockOutput
                    block={block}
                    key={block.type}
                    onClick={() => handleClick(block)}
                    forDisplay
                />
            ))}
        </>
    );
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
    const [canvasScroll, setCanvasScroll] = useState<[number, number]>([0, 0]);

    const [inBlock, setBlock] = useState(block);

    const [draggingObject, setDraggingObject] = useState<
        | { blockInfo: SubBlock; blockType: "input" | "output" | "block" }
        | undefined
    >();

    useEffect(() => {
        setBlock(block);
    }, [block]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!draggingObject) {
                return;
            }
            const canvasBoundaries = canvasRef.current.getBoundingClientRect();

            setDraggingObject({
                blockInfo: {
                    ...draggingObject.blockInfo,
                    x: e.clientX - canvasBoundaries.x,
                    y: e.clientY - canvasBoundaries.y,
                },
                blockType: draggingObject.blockType,
            });
        };
        const handleMouseUp = () => {
            if (!draggingObject) return;

            if (draggingObject.blockType == "input") {
                setBlock({
                    name: inBlock.name,
                    inputs: [
                        ...inBlock.inputs,
                        { ...draggingObject.blockInfo, id: makeid(10) },
                    ],
                    outputs: inBlock.outputs,
                    blocks: inBlock.blocks,
                });
            } else if (draggingObject.blockType == "block") {
                setBlock({
                    name: inBlock.name,
                    inputs: inBlock.inputs,
                    blocks: [
                        ...inBlock.blocks,
                        { ...draggingObject.blockInfo, id: makeid(10) },
                    ],
                    outputs: inBlock.outputs,
                });
            } else if (draggingObject.blockType == "output") {
                setBlock({
                    name: inBlock.name,
                    inputs: inBlock.inputs,
                    blocks: inBlock.blocks,
                    outputs: [
                        ...inBlock.outputs,
                        { ...draggingObject.blockInfo, id: makeid(10) },
                    ],
                });
            }

            setDraggingObject(undefined);
        };

        // const ref = canvasRef.current;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggingObject, inBlock]);

    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const setupLines = () => {
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
                            const inBoundaries =
                                inElement.getBoundingClientRect();
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
        };

        setTimeout(() => {
            setupLines();
        }, 100);

        window.addEventListener("resize", () => {
            setupLines();
        });
    }, [canvasRef, block, canvasScroll]);

    const renderDraggingObject = () => {
        if (!draggingObject) {
            return;
        }

        if (draggingObject.blockType == "input") {
            return <BlockInput block={draggingObject.blockInfo} />;
        } else if (draggingObject.blockType == "output") {
            return <BlockOutput block={draggingObject.blockInfo} />;
        } else if (draggingObject.blockType == "block") {
            return <BlockBlock block={draggingObject.blockInfo} />;
        }
    };

    return (
        <div className="w-full h-full max-w-full max-h-full absolute bg-white grid grid-rows-[min-content_min-content_1fr]">
            <div className="p-1 flex flex-row gap-x-1 items-center">
                <label className="text-xl font-semibold text-black">
                    {inBlock ? inBlock.name : "No block selected"}
                </label>
            </div>
            <div className="relative bg-gradient-to-b from-white to-[#ebebeb] border-b border-[#cacaca] p-1 min-w-10 min-h-10 flex flex-row gap-x-2 overflow-x-auto">
                <InptusForDisplay setDraggingObject={setDraggingObject} />
                <div className="min-w-[1px] h-full bg-gradient-to-b from-[#c0c0c0] to-[#7a7a7a]" />
                <BlocksForDisplay setDraggingObject={setDraggingObject} />
                <div className="min-w-[1px] h-full bg-gradient-to-b from-[#c0c0c0] to-[#7a7a7a]" />
                <OutputsForDisplay setDraggingObject={setDraggingObject} />
            </div>
            <div
                className="bg-red-200 relative w-full min-h-0 max-h-full h-full overflow-auto"
                onScroll={(e) =>
                    setCanvasScroll([
                        e.currentTarget.scrollLeft,
                        e.currentTarget.scrollTop,
                    ])
                }
            >
                <canvas
                    className="sticky top-0 left-0 w-full h-full"
                    ref={canvasRef}
                />
                {inBlock &&
                    inBlock.inputs.map((input, index) => {
                        return (
                            <BlockInput
                                key={"input-" + index + "-" + inBlock.name}
                                block={input}
                            />
                        );
                    })}

                {inBlock &&
                    inBlock.blocks.map((subBlock: SubBlock, index) => (
                        <BlockBlock
                            block={subBlock}
                            key={"block-" + index + "-" + inBlock.name}
                        />
                    ))}
                {inBlock &&
                    inBlock.outputs?.map((subBlock, index) => (
                        <BlockOutput
                            block={subBlock}
                            key={"output-" + index + "-" + inBlock.name}
                        />
                    ))}

                {renderDraggingObject()}
            </div>
        </div>
    );
}
