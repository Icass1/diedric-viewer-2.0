import { DiedricLine } from "./diedric/line";
import { DiedricNumber } from "./diedric/number";
import { DiedricPlane } from "./diedric/plane";
import { DiedricPoint } from "./diedric/point";
import { DiedricVector } from "./diedric/vector";

export const blocks = [
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
        ouputs: [
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
