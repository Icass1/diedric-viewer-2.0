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

    const [block, setBlock] = useState<Block | undefined>(blocks[3]);

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

        expressions.current.push(
            new Expression({
                text: "A = 10",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "B = 55",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "C = -135",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "D = -135",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "E = -135",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "F = 16",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "G = 56",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "H = -100",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "I = 32",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "J = (A,\\ B,\\ C)",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "K = (D,\\ E,\\ F)",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        expressions.current.push(
            new Expression({
                text: "M = (G,\\ H,\\ I)",
                expressions: expressions.current,
                diedric: diedric,
            })
        );

        expressions.current.push(
            new Expression({
                text: "\\beta = (J,\\ K,\\ M)",
                expressions: expressions.current,
                diedric: diedric,
            })
        );

        expressions.current.push(
            new Expression({
                text: "t = (J,\\ K)",
                expressions: expressions.current,
                diedric: diedric,
            })
        );
        // expressions.current.push(
        //     new Expression({
        //         text: "s = (K,\\ M)",
        //         expressions: expressions.current,
        //         diedric: diedric,
        //     })
        // );
        // expressions.current.push(
        //     new Expression({
        //         text: "u = (J,\\ M)",
        //         expressions: expressions.current,
        //         diedric: diedric,
        //     })
        // );

        // expressions.current.push(
        //     new Expression({
        //         text: "\\alpha = (s,\\ u)",
        //         expressions: expressions.current,
        //         diedric: diedric,
        //     })
        // );
        updater();
    }, [expressions, diedric]);

    return (
        <div className="grid grid-cols-[300px_1fr] h-full">
            <div className="bg-indigo-900 flex flex-col p-2 gap-y-2 overflow-y-auto ">
                {expressions.current.map((expression, index) => (
                    <ExpressionRender
                        key={"expression-" + index}
                        expression={expression}
                    />
                ))}
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
                                        console.log(block);
                                    }}
                                    className="bg-neutral-400 rounded text-white p-1"
                                >
                                    {block.name}
                                </label>
                            ))}
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
