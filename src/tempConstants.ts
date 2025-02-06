import { DiedricLine } from "./diedric/line";
import { DiedricNumber } from "./diedric/number";
import { DiedricPlane } from "./diedric/plane";
import { DiedricPoint } from "./diedric/point";
import { DiedricVector } from "./diedric/vector";

export interface SubBlock {
    type: string;
    id: string;
    color: string;
    x: number;
    y: number;
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
                color: "#2d70b3",
                x: 10,
                y: 50,
            },
            {
                type: "DiedricNumber",
                id: "jfUkvEjp",
                color: "#2d70b3",
                x: 10,
                y: 150,
            },
            {
                type: "DiedricNumber",
                id: "FbQQmwoW",
                color: "#2d70b3",
                x: 10,
                y: 250,
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "calcVect",
                outputs: ["-x", "-y", "z"],
                inputs: {
                    x: ["MhHXZzLv", "x"],
                    y: ["jfUkvEjp", "x"],
                    z: ["FbQQmwoW", "x"],
                },
                color: "#fa7e19",
                x: 250,
                y: 30,
            },
            // {
            //     id: "ZfemTjrN",
            //     type: "calcVect",
            //     outputs: ["x*2", "y*2", "-z*2"],
            //     inputs: {
            //         x: ["MhHXZzLv", "x"],
            //         y: ["jfUkvEjp", "x"],
            //         z: ["FbQQmwoW", "x"],
            //     },
            //     color: "#fa7e19",
            //     x: 250,
            //     y: 200,
            // },
        ],
        outputs: [
            {
                type: "DiedricPoint",
                id: "PclobZUk",
                color: "#c74440",
                inputs: {
                    r: ["fawefvawtr", "value"],
                },
                x: 500,
                y: 60,
            },
            // {
            //     type: "DiedricPoint",
            //     id: "NYxNovIl",
            //     color: "#c74440",
            //     inputs: {
            //         r: ["ZfemTjrN", "value"],
            //     },
            //     x: 500,
            //     y: 220,
            // },
        ],
    },
    {
        name: "Line from two points",
        inputs: [
            {
                type: "DiedricPoint",
                color: "red",
                x: 10,
                y: 10,
                id: "input-point-1",
            },
            {
                type: "DiedricPoint",
                color: "red",
                x: 10,
                y: 100,
                id: "input-point-2",
            },
        ],
        outputs: [
            {
                type: "DiedricLine",
                id: "output-line-1",
                color: "#c74440",
                inputs: {
                    r: ["input-point-1", "r"],
                    v: ["fawefvawtr", "value"],
                },
                x: 500,
                y: 30,
            },
        ],
        blocks: [
            {
                id: "fawefvawtr",
                type: "calcVect",
                outputs: ["r1.x - r2.x", "r1.y - r2.y", "r1.z - r2.z"],
                inputs: {
                    r1: ["input-point-1", "r"],
                    r2: ["input-point-2", "r"],
                },
                color: "#fa7e19",
                x: 250,
                y: 100,
            },
        ],
    },
];

export const objects: {
    [key: string]: {
        prototype:
            | typeof DiedricNumber
            | typeof DiedricVector
            | typeof DiedricPlane
            | typeof DiedricLine
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
};
