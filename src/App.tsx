import { useReducer, useState } from "react";
import { useEffect, useRef } from "react";
import { Expression } from "./expression";
import { ExpressionRender } from "./ExpressionRender";
import { BlockBuilder } from "./BlockBuilder";
import { Diedric } from "./diedric/diedric";
import * as THREE from "three";
import { Block, blocks } from "./tempConstants";

function App() {
    const expressions = useRef<Expression[]>([]);
    const [newExpression, setNewExpression] = useState<Expression>();
    const [, updater] = useReducer((x) => x + 1, 0);

    const [currentTab, setCurrentTab] = useState<
        "block-builder" | "3d" | "2d" | undefined
    >(undefined);

    useEffect(() => {
        let tempCurrentTab: "block-builder" | "3d" | "2d" = "3d";
        switch (localStorage.getItem("currentTab")) {
            case "block-builder":
                tempCurrentTab = "block-builder";
                break;
            case "3d":
                tempCurrentTab = "3d";
                break;
            case "2d":
                tempCurrentTab = "2d";
                break;
        }
        setCurrentTab(tempCurrentTab);
    }, []);

    const canvas3dRef = useRef<HTMLCanvasElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    const [diedric, setDiedric] = useState<Diedric>();

    const [block, setBlock] = useState<Block | undefined>({
        outputs: [],
        inputs: [],
        blocks: [],
        name: "New block",
    });

    useEffect(() => {
        if (!currentTab) return;
        localStorage.setItem("currentTab", currentTab);
    }, [currentTab]);

    useEffect(() => {
        if (!canvas3dRef.current || !canvas2dRef.current) return;
        const newDiedric = new Diedric(
            200,
            canvas3dRef.current,
            canvas2dRef.current
        );

        newDiedric.createStaticLabel(
            "x",
            new THREE.Vector3(newDiedric.size, 0, 0)
        );
        newDiedric.createStaticLabel(
            "y",
            new THREE.Vector3(0, newDiedric.size, 0)
        );
        newDiedric.createStaticLabel(
            "z",
            new THREE.Vector3(0, 0, newDiedric.size)
        );

        setDiedric(newDiedric);
    }, [canvas2dRef, canvas3dRef]);

    useEffect(() => {
        if (!diedric) return;
        if (!expressions) return;

        const expressionsText = [
            {
                text: "A=-21",
            },
            {
                text: "B=117",
            },
            {
                text: "C=3",
            },
            {
                text: "p=\\left(A,\\ B,\\ C\\right)",
                preferredMatch: "Point OAC",
            },
            {
                text: "b=\\left(C,\\ A,\\ B\\right)",
                preferredMatch: "Point OAC",
            },
            {
                text: "s=\\left(p,\\ b\\right)",
                preferredMatch: "Segment",
            },
        ];

        expressionsText.map((expr) =>
            expressions.current.push(
                new Expression({
                    text: expr.text,
                    expressions: expressions.current,
                    diedric: diedric,
                    preferredMatch: expr.preferredMatch,
                })
            )
        );

        setNewExpression(
            new Expression({
                text: "",
                expressions: expressions.current,
                diedric: diedric,
            })
        );

        updater();
    }, [expressions, diedric]);

    const deleteExpression = (expression: Expression) => {
        expressions.current = expressions.current.filter(
            (expr) => expr != expression
        );

        updater();
    };

    return (
        <div className="grid grid-cols-[300px_1fr] h-full">
            <div className="bg-white border-r border-[#d7d7d7] border-solid">
                <div className="w-full h-10 bg-gradient-to-b from-[#fcfcfc] to-[#ebebeb] border-b border-[#cacaca]">
                    <button className="p-1 bg-neutral-400 rounded">
                        Plus icon
                    </button>
                    <button
                        className="p-1 bg-neutral-400 rounded"
                        onClick={() => {
                            console.log(
                                expressions.current.map((expr) => {
                                    return {
                                        text: expr.text,
                                        preferredMatch: expr.preferredMatch,
                                    };
                                })
                            );
                        }}
                    >
                        Save
                    </button>
                </div>
                <div className="flex flex-col  overflow-y-auto ">
                    {expressions.current.map((expression, index) => (
                        <ExpressionRender
                            key={"expression-" + expression.id}
                            index={index}
                            expression={expression}
                            deleteExpression={deleteExpression}
                        />
                    ))}
                    <div
                        className="relative"
                        onClick={() => {
                            expressions.current.push(
                                new Expression({
                                    text: "",
                                    expressions: expressions.current,
                                    diedric: diedric,
                                })
                            );
                            updater();
                        }}
                    >
                        {newExpression && (
                            <ExpressionRender
                                index={expressions.current.length}
                                expression={newExpression}
                                deleteExpression={deleteExpression}
                            />
                        )}
                        <div className="w-full h-full absolute bg-gradient-to-b from-transparent to-white top-0"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row gap-x-2 p-1">
                    <button
                        className="p-1 rounded bg-green-400 text-green-800 disabled:bg-green-500 disabled:text-green-900 font-semibold"
                        disabled={currentTab == "block-builder"}
                        onClick={() => setCurrentTab("block-builder")}
                    >
                        Block builder
                    </button>
                    {currentTab == "block-builder" && (
                        <div className="flex flex-row gap-x-1 items-center">
                            {blocks.map((block) => (
                                <label
                                    key={"block-selection-" + block.name}
                                    onClick={() => {
                                        setBlock(block);
                                    }}
                                    className="bg-neutral-400 rounded text-white p-1"
                                >
                                    {block.name}
                                </label>
                            ))}
                            <label
                                key={"block-selection-" + block.name}
                                onClick={() => {
                                    setBlock({
                                        outputs: [],
                                        inputs: [],
                                        blocks: [],
                                        name: "New block",
                                    });
                                }}
                                className="bg-neutral-400 rounded text-white p-1"
                            >
                                New
                            </label>
                        </div>
                    )}

                    <button
                        className="p-1 rounded bg-green-400 text-green-800 disabled:bg-green-500 disabled:text-green-900 font-semibold"
                        disabled={currentTab == "3d"}
                        onClick={() => setCurrentTab("3d")}
                    >
                        3D
                    </button>
                    <button
                        className="p-1 rounded bg-green-400 text-green-800 disabled:bg-green-500 disabled:text-green-900 font-semibold"
                        disabled={currentTab == "2d"}
                        onClick={() => setCurrentTab("2d")}
                    >
                        Diedric
                    </button>
                </div>
                <div className="w-full h-full relative min-h-0 max-h-full ">
                    {currentTab == "block-builder" && (
                        <BlockBuilder block={block} />
                    )}
                    <canvas
                        ref={canvas3dRef}
                        className={
                            "w-full h-full max-w-full max-h-full absolute " +
                            (currentTab == "3d" ? "" : "-z-50")
                        }
                    />
                    <canvas
                        ref={canvas2dRef}
                        className={
                            "w-full h-full absolute " +
                            (currentTab == "2d" ? "" : "-z-50")
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
