import { DiedricLine } from "./diedric/line";
import { DiedricNumber } from "./diedric/number";
import { DiedricPlane } from "./diedric/plane";
import { DiedricPoint } from "./diedric/point";
import { DiedricSegment } from "./diedric/segment";
import { DiedricVector } from "./diedric/vector";

export interface SubBlock {
    type: string;
    id: string;
    x?: number;
    y?: number;
    outputs?: string[];
    inputs?: { [key: string]: [string, string] };
}

export interface Block {
    name: string;
    inputs: SubBlock[];
    blocks: SubBlock[];
    outputs: SubBlock[];
}

export const blocks: Block[] = [
    {
        name: "Point OAC",
        inputs: [
            {
                type: "DiedricNumber",
                id: "MhHXZzLv",
                x: 10,
                y: 50,
            },
            {
                type: "DiedricNumber",
                id: "jfUkvEjp",
                x: 10,
                y: 150,
            },
            {
                type: "DiedricNumber",
                id: "FbQQmwoW",
                x: 10,
                y: 250,
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "calcVect",
                outputs: ["x", "y", "z"],
                inputs: {
                    x: ["MhHXZzLv", "x"],
                    y: ["jfUkvEjp", "x"],
                    z: ["FbQQmwoW", "x"],
                },
                x: 250,
                y: 30,
            },
        ],
        outputs: [
            {
                type: "DiedricPoint",
                id: "PclobZUk",
                inputs: {
                    r: ["fawefvawtr", "value"],
                },
                x: 500,
                y: 60,
            },
        ],
    },
    {
        name: "Line from two points",
        inputs: [
            {
                type: "DiedricPoint",
                x: 10,
                y: 10,
                id: "input-point-1",
            },
            {
                type: "DiedricPoint",
                x: 10,
                y: 100,
                id: "input-point-2",
            },
        ],
        outputs: [
            {
                type: "DiedricLine",
                id: "output-line-1",
                inputs: {
                    r: ["input-point-1", "r"],
                    v: ["fawefvawtr", "value"],
                },
                x: 700,
                y: 30,
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "calcVect",
                outputs: ["r_1.x-r_2.x", "r_1.y - r_2.y", "r_1.z - r_2.z"],
                inputs: {
                    r_1: ["input-point-1", "r"],
                    r_2: ["input-point-2", "r"],
                },
                x: 250,
                y: 100,
            },
        ],
    },
    {
        name: "Plane from two lines",
        inputs: [
            {
                type: "DiedricLine",
                x: 10,
                y: 10,
                id: "input-line-1",
            },
            {
                type: "DiedricLine",
                x: 10,
                y: 200,
                id: "input-line-2",
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "crossVect",
                inputs: {
                    v_1: ["input-line-1", "v"],
                    v_2: ["input-line-2", "v"],
                },
                x: 200,
                y: 50,
            },
            {
                id: "umtzvotapk",
                type: "calc",
                outputs: [
                    "v_1.x \\cdot r_1.x+v_1.y \\cdot r_1.y+v_1.z \\cdot r_1.z",
                ],
                inputs: {
                    v_1: ["fawefvawtr", "value"],
                    r_1: ["input-line-2", "r"],
                },
                x: 650,
                y: 200,
            },
        ],
        outputs: [
            {
                type: "DiedricPlane",
                id: "output-line-1",
                inputs: {
                    v: ["fawefvawtr", "value"],
                    d: ["umtzvotapk", "value"],
                },
                x: 1100,
                y: 100,
            },
        ],
    },
    {
        name: "Plane from three points",
        inputs: [
            {
                type: "DiedricPoint",
                x: 10,
                y: 50,
                id: "input-point-1",
            },
            {
                type: "DiedricPoint",
                x: 10,
                y: 200,
                id: "input-point-2",
            },
            {
                type: "DiedricPoint",
                x: 10,
                y: 350,
                id: "input-point-3",
            },
        ],
        blocks: [
            {
                id: "calcVect-1",
                type: "calcVect",
                outputs: ["r_1.x-r_2.x", "r_1.y - r_2.y", "r_1.z - r_2.z"],
                inputs: {
                    r_1: ["input-point-1", "r"],
                    r_2: ["input-point-2", "r"],
                },
                x: 200,
                y: 50,
            },
            {
                id: "calcVect-2",
                type: "calcVect",
                outputs: ["r_1.x-r_2.x", "r_1.y - r_2.y", "r_1.z - r_2.z"],
                inputs: {
                    r_1: ["input-point-2", "r"],
                    r_2: ["input-point-3", "r"],
                },
                x: 200,
                y: 200,
            },
            {
                id: "crossVect-1",
                type: "crossVect",
                inputs: {
                    v_1: ["calcVect-1", "value"],
                    v_2: ["calcVect-2", "value"],
                },
                x: 650,
                y: 50,
            },
            {
                id: "calc-1",
                type: "calc",
                outputs: [
                    "v_1.x \\cdot r_1.x+v_1.y \\cdot r_1.y+v_1.z \\cdot r_1.z",
                ],
                inputs: {
                    v_1: ["crossVect-1", "value"],
                    r_1: ["input-point-3", "r"],
                },
                x: 850,
                y: 300,
            },
        ],
        outputs: [
            {
                type: "DiedricPlane",
                id: "output-line-1",
                inputs: {
                    v: ["crossVect-1", "value"],
                    d: ["calc-1", "value"],
                },
                x: 1300,
                y: 100,
            },
        ],
    },

    {
        name: "Segment",
        inputs: [
            {
                type: "DiedricPoint",
                x: 10,
                y: 10,
                id: "input-point-1",
            },
            {
                type: "DiedricPoint",
                x: 10,
                y: 100,
                id: "input-point-2",
            },
        ],
        outputs: [
            {
                type: "DiedricSegment",
                id: "output-line-1",
                inputs: {
                    r1: ["input-point-1", "r"],
                    r2: ["input-point-2", "r"],
                },
                x: 700,
                y: 30,
            },
        ],
        blocks: [],
    },
];

export const objects: {
    [key: string]: {
        prototype:
            | typeof DiedricNumber
            | typeof DiedricVector
            | typeof DiedricPlane
            | typeof DiedricLine
            | typeof DiedricSegment
            | typeof DiedricPoint;
        params: { [key: string]: "DiedricNumber" | "DiedricVector" };
    };
} = {
    DiedricNumber: {
        prototype: DiedricNumber,
        params: {
            x: "DiedricNumber",
        },
    },
    DiedricVector: {
        prototype: DiedricVector,
        params: {
            x: "DiedricNumber",
            y: "DiedricNumber",
            z: "DiedricNumber",
        },
    },
    DiedricPlane: {
        prototype: DiedricPlane,
        params: {
            v: "DiedricVector",
            d: "DiedricNumber",
        },
    },
    DiedricLine: {
        prototype: DiedricLine,
        params: {
            v: "DiedricVector",
            r: "DiedricVector",
        },
    },
    DiedricPoint: {
        prototype: DiedricPoint,
        params: {
            r: "DiedricVector",
        },
    },
    DiedricSegment: {
        prototype: DiedricSegment,
        params: {
            p1: "DiedricVector",
            p2: "DiedricVector",
        },
    },
};
