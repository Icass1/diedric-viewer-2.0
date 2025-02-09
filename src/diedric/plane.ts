import { Diedric } from "./diedric";
import { DiedricNumber } from "./number";
import { DiedricVector } from "./vector";

import * as THREE from "three";
import * as TWO from "../two/two";

export class DiedricPlane {
    type = "DiedricPlane";

    private _v: DiedricVector;
    private _d: DiedricNumber;
    private _diedric: Diedric;

    private geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;

    private material: THREE.MeshBasicMaterial;
    private projectionMaterial: THREE.LineBasicMaterial;

    private horizontalProjectionGeometry;
    private verticalProjectionGeometry;

    private verticalProjectionLine: THREE.Line<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.LineBasicMaterial,
        THREE.Object3DEventMap
    >;
    private horizontalProjectionLine: THREE.Line<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.LineBasicMaterial,
        THREE.Object3DEventMap
    >;
    private plane: THREE.Mesh<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.MeshBasicMaterial,
        THREE.Object3DEventMap
    >;

    private horizontalProjectionLine2d: TWO.Line;
    private verticalProjectionLine2d: TWO.Line;

    private horizontalProjectionLine2dDashed: TWO.Line;
    private verticalProjectionLine2dDashed: TWO.Line;

    constructor({
        v,
        d,
        diedric,
    }: {
        d: DiedricNumber;
        v: DiedricVector;
        diedric: Diedric;
    }) {
        this._diedric = diedric;

        const color = "red";

        this.geometry = new THREE.BufferGeometry();

        this.projectionMaterial = new THREE.LineBasicMaterial({ color: color });

        this.horizontalProjectionGeometry =
            new THREE.BufferGeometry().setFromPoints([]);
        this.horizontalProjectionLine = new THREE.Line(
            this.horizontalProjectionGeometry,
            this.projectionMaterial
        );
        this._diedric.scene.add(this.horizontalProjectionLine);

        this.verticalProjectionGeometry =
            new THREE.BufferGeometry().setFromPoints([]);
        this.verticalProjectionLine = new THREE.Line(
            this.verticalProjectionGeometry,
            this.projectionMaterial
        );
        this._diedric.scene.add(this.verticalProjectionLine);

        // Create a material.
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
        });

        // Create a mesh with the geometry and material.
        this.plane = new THREE.Mesh(this.geometry, this.material);

        // Add the plane to the scene.
        this._diedric.scene.add(this.plane);

        this.horizontalProjectionLine2d = new TWO.Line({
            color: color.toString(),
            width: 2,
        });
        this.verticalProjectionLine2d = new TWO.Line({
            color: color.toString(),
            width: 2,
        });
        this.horizontalProjectionLine2dDashed = new TWO.Line({
            color: color.toString(),
            width: 2,
            dashed: true,
        });
        this.verticalProjectionLine2dDashed = new TWO.Line({
            color: color.toString(),
            width: 2,
            dashed: true,
        });

        this._diedric.canvas2d.add(this.horizontalProjectionLine2d);
        this._diedric.canvas2d.add(this.verticalProjectionLine2d);

        this._diedric.canvas2d.add(this.horizontalProjectionLine2dDashed);
        this._diedric.canvas2d.add(this.verticalProjectionLine2dDashed);

        this._v = v;
        this._d = d;
        this.update();
    }

    update() {
        if (!this._v || !this._d) {
            console.warn("v or r is undefined");
            return;
        }

        const size = this._diedric.size;

        const d = this._d.x;
        const borderPoints: THREE.Vector3[] = [];

        const horizontalProjectionPoints = [];
        const verticalProjectionPoints = [];

        const normal = { x: this._v.x.x, y: this._v.y.x, z: this._v.z.x };

        if (normal.x != 0) {
            let x: number;
            let y: number;
            let z: number;

            for (const k of [
                [size, size],
                [size, -size],
                [-size, size],
                [-size, -size],
            ]) {
                y = k[0];
                z = k[1];
                x = (d - normal.y * y - normal.z * z) / normal.x;
                if (x <= size && x >= -size) {
                    borderPoints.push(new THREE.Vector3(x, y, z));
                }
            }

            z = size;
            y = 0;
            x = (d - normal.z * z) / normal.x;
            if (x <= size && x >= -size) {
                horizontalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }

            z = -size;
            x = (d - normal.z * z) / normal.x;
            if (x <= size && x >= -size) {
                horizontalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }

            z = 0;
            y = size;
            x = (d - normal.y * y) / normal.x;
            if (x <= size && x >= -size) {
                verticalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }

            y = -size;
            x = (d - normal.y * y) / normal.x;
            if (x <= size && x >= -size) {
                verticalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }
        }
        if (normal.y != 0) {
            let x: number;
            let y: number;
            let z: number;
            for (const k of [
                [size, size],
                [size, -size],
                [-size, size],
                [-size, -size],
            ]) {
                x = k[0];
                z = k[1];
                y = (d - normal.x * x - normal.z * z) / normal.y;
                if (y <= size && y >= -size) {
                    borderPoints.push(new THREE.Vector3(x, y, z));
                }
            }
            z = 0;
            x = size;
            y = (d - normal.x * x) / normal.y;
            if (y <= size && y >= -size) {
                verticalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }

            x = -size;
            y = (d - normal.x * x) / normal.y;
            if (y <= size && y >= -size) {
                verticalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }
        }
        if (normal.z != 0) {
            let x: number;
            let y: number;
            let z: number;
            for (const k of [
                [size, size],
                [size, -size],
                [-size, size],
                [-size, -size],
            ]) {
                x = k[0];
                y = k[1];
                z = (d - normal.x * x - normal.y * y) / normal.z;
                if (z <= size && z >= -size) {
                    // addPoint(new THREE.Vector3(x, y, z))
                    borderPoints.push(new THREE.Vector3(x, y, z));
                }
            }
            y = 0;
            x = size;
            z = (d - normal.x * x) / normal.z;
            if (z <= size && z >= -size) {
                horizontalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }

            x = -size;
            z = (d - normal.x * x) / normal.z;
            if (z <= size && z >= -size) {
                horizontalProjectionPoints.push(new THREE.Vector3(x, y, z));
            }
        }

        if (horizontalProjectionPoints.length < 2) {
            console.error("horizontalProjectionPoints.length < 2");
            // this._exists = false;
            // this.updateView();
            return;
        }

        const m =
            (horizontalProjectionPoints[1].z -
                horizontalProjectionPoints[0].z) /
            (horizontalProjectionPoints[1].x - horizontalProjectionPoints[0].x);
        const n =
            horizontalProjectionPoints[0].z -
            m * horizontalProjectionPoints[0].x;

        const x = -n / m;

        if (normal.x == 0) {
            if (horizontalProjectionPoints[0].z > 0) {
                this.horizontalProjectionLine2d.start = new THREE.Vector2(
                    horizontalProjectionPoints[0].x,
                    horizontalProjectionPoints[0].z
                );
                this.horizontalProjectionLine2d.end = new THREE.Vector2(
                    horizontalProjectionPoints[1].x,
                    horizontalProjectionPoints[1].z
                );

                this.horizontalProjectionLine2dDashed.start = new THREE.Vector2(
                    0,
                    0
                );
                this.horizontalProjectionLine2dDashed.end = new THREE.Vector2(
                    0,
                    0
                );
            } else {
                this.horizontalProjectionLine2dDashed.start = new THREE.Vector2(
                    horizontalProjectionPoints[0].x,
                    horizontalProjectionPoints[0].z
                );
                this.horizontalProjectionLine2dDashed.end = new THREE.Vector2(
                    horizontalProjectionPoints[1].x,
                    horizontalProjectionPoints[1].z
                );

                this.horizontalProjectionLine2d.start = new THREE.Vector2(0, 0);
                this.horizontalProjectionLine2d.end = new THREE.Vector2(0, 0);
            }

            if (verticalProjectionPoints[0].y > 0) {
                this.verticalProjectionLine2d.start = new THREE.Vector2(
                    verticalProjectionPoints[0].x,
                    -verticalProjectionPoints[0].y
                );
                this.verticalProjectionLine2d.end = new THREE.Vector2(
                    verticalProjectionPoints[1].x,
                    -verticalProjectionPoints[1].y
                );

                this.verticalProjectionLine2dDashed.start = new THREE.Vector2(
                    0,
                    0
                );
                this.verticalProjectionLine2dDashed.end = new THREE.Vector2(
                    0,
                    0
                );
            } else {
                this.verticalProjectionLine2dDashed.start = new THREE.Vector2(
                    verticalProjectionPoints[0].x,
                    -verticalProjectionPoints[0].y
                );
                this.verticalProjectionLine2dDashed.end = new THREE.Vector2(
                    verticalProjectionPoints[1].x,
                    -verticalProjectionPoints[1].y
                );

                this.verticalProjectionLine2d.start = new THREE.Vector2(0, 0);
                this.verticalProjectionLine2d.end = new THREE.Vector2(0, 0);
            }
        } else {
            if (horizontalProjectionPoints[0].z > 0) {
                this.horizontalProjectionLine2d.start = new THREE.Vector2(
                    horizontalProjectionPoints[0].x,
                    horizontalProjectionPoints[0].z
                );
                this.horizontalProjectionLine2d.end = new THREE.Vector2(x, 0);

                this.horizontalProjectionLine2dDashed.start = new THREE.Vector2(
                    x,
                    0
                );
                this.horizontalProjectionLine2dDashed.end = new THREE.Vector2(
                    horizontalProjectionPoints[1].x,
                    horizontalProjectionPoints[1].z
                );
            } else if (horizontalProjectionPoints[0].z < 0) {
                // console.warn("Implementation missing 1");
                this.horizontalProjectionLine2d.start = new THREE.Vector2(x, 0);
                this.horizontalProjectionLine2d.end = new THREE.Vector2(
                    horizontalProjectionPoints[1].x,
                    horizontalProjectionPoints[1].z
                );

                this.horizontalProjectionLine2dDashed.start = new THREE.Vector2(
                    horizontalProjectionPoints[0].x,
                    horizontalProjectionPoints[0].z
                );
                this.horizontalProjectionLine2dDashed.end = new THREE.Vector2(
                    x,
                    0
                );
            } else {
                this.horizontalProjectionLine2d.start = new THREE.Vector2(
                    horizontalProjectionPoints[0].x,
                    horizontalProjectionPoints[0].z
                );
                this.horizontalProjectionLine2d.end = new THREE.Vector2(
                    horizontalProjectionPoints[1].x,
                    horizontalProjectionPoints[1].z
                );

                this.horizontalProjectionLine2dDashed.start = new THREE.Vector2(
                    0,
                    0
                );
                this.horizontalProjectionLine2dDashed.end = new THREE.Vector2(
                    0,
                    0
                );
            }

            if (-verticalProjectionPoints[0].y > 0) {
                this.verticalProjectionLine2d.start = new THREE.Vector2(
                    verticalProjectionPoints[0].x,
                    -verticalProjectionPoints[0].y
                );
                this.verticalProjectionLine2d.end = new THREE.Vector2(
                    verticalProjectionPoints[1].x,
                    -verticalProjectionPoints[1].y
                );

                this.verticalProjectionLine2dDashed.start = new THREE.Vector2(
                    0,
                    0
                );
                this.verticalProjectionLine2dDashed.end = new THREE.Vector2(
                    0,
                    0
                );
            } else if (-verticalProjectionPoints[0].y < 0) {
                this.verticalProjectionLine2d.start = new THREE.Vector2(
                    verticalProjectionPoints[0].x,
                    -verticalProjectionPoints[0].y
                );
                this.verticalProjectionLine2d.end = new THREE.Vector2(x, 0);

                this.verticalProjectionLine2dDashed.start = new THREE.Vector2(
                    x,
                    0
                );
                this.verticalProjectionLine2dDashed.end = new THREE.Vector2(
                    verticalProjectionPoints[1].x,
                    -verticalProjectionPoints[1].y
                );
            } else {
                this.verticalProjectionLine2d.start = new THREE.Vector2(
                    verticalProjectionPoints[0].x,
                    -verticalProjectionPoints[0].y
                );
                this.verticalProjectionLine2d.end = new THREE.Vector2(
                    verticalProjectionPoints[1].x,
                    -verticalProjectionPoints[1].y
                );

                this.verticalProjectionLine2dDashed.start = new THREE.Vector2(
                    0,
                    0
                );
                this.verticalProjectionLine2dDashed.end = new THREE.Vector2(
                    0,
                    0
                );
            }
        }

        this.horizontalProjectionGeometry.setFromPoints(
            horizontalProjectionPoints
        );
        this.verticalProjectionGeometry.setFromPoints(verticalProjectionPoints);

        const finalBorderPoints: THREE.Vector3[] = [];

        let currentPoint = borderPoints[0];

        finalBorderPoints.push(currentPoint);

        const facesDone: string[] = [];

        for (let i = 0; i < borderPoints.length - 1; i++) {
            if (currentPoint.x == size && !facesDone.includes("A")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.x == size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;
                facesDone.push("A");
            } else if (currentPoint.x == -size && !facesDone.includes("B")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.x == -size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;

                facesDone.push("B");
            } else if (currentPoint.y == size && !facesDone.includes("C")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.y == size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;

                facesDone.push("C");
            } else if (currentPoint.y == -size && !facesDone.includes("D")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.y == -size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;

                facesDone.push("D");
            } else if (currentPoint.z == size && !facesDone.includes("E")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.z == size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;

                facesDone.push("E");
            } else if (currentPoint.z == -size && !facesDone.includes("F")) {
                const newPoint = borderPoints.find(
                    (point) =>
                        point.z == -size && !finalBorderPoints.includes(point)
                );
                if (!newPoint) {
                    console.warn(
                        "This should never happen",
                        borderPoints,
                        currentPoint
                    );
                    continue;
                }
                finalBorderPoints.push(newPoint);
                currentPoint = newPoint;

                facesDone.push("F");
            }
        }

        // Create a new geometry
        const vertices = [];

        for (let face = 0; face < finalBorderPoints.length - 2; face++) {
            vertices.push(
                finalBorderPoints[0].x,
                finalBorderPoints[0].y,
                finalBorderPoints[0].z
            );
            for (let vertice = 0; vertice < 2; vertice++) {
                vertices.push(
                    finalBorderPoints[vertice + face + 1].x,
                    finalBorderPoints[vertice + face + 1].y,
                    finalBorderPoints[vertice + face + 1].z
                );
            }
        }
        if (!vertices) {
            console.error("No vertices");
        } else {
            const Float32Vertices = new Float32Array(vertices);

            // Set the positions to the geometry
            this.geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(Float32Vertices, 3)
            );
        }
    }

    set v(newV: DiedricVector) {
        this._v = newV;
        this.update();
    }

    set d(newD: DiedricNumber) {
        this._d = newD;
        this.update();
    }
    delete() {
        this._diedric.scene.remove(this.horizontalProjectionLine);
        this._diedric.scene.remove(this.verticalProjectionLine);
        this._diedric.scene.remove(this.plane);

        this._diedric.canvas2d.remove(this.horizontalProjectionLine2d);
        this._diedric.canvas2d.remove(this.horizontalProjectionLine2dDashed);
        this._diedric.canvas2d.remove(this.verticalProjectionLine2d);
        this._diedric.canvas2d.remove(this.verticalProjectionLine2dDashed);
    }
}
