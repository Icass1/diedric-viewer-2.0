import { Diedric } from "./diedric";
import { DiedricVector } from "./vector";
import * as THREE from "three";
import * as TWO from "../two/two";

export class DiedricLine {
    type = "DiedricLine";
    private _r: DiedricVector;
    private _v: DiedricVector;
    private _diedric: Diedric;

    private cylinder: THREE.Mesh<
        THREE.CylinderGeometry,
        THREE.MeshBasicMaterial,
        THREE.Object3DEventMap
    >;
    private material: THREE.MeshBasicMaterial;

    private horizontalProjectionLine2d: TWO.Line;
    private verticalProjectionLine2d: TWO.Line;

    constructor({
        r,
        v,
        diedric,
    }: {
        r: DiedricVector;
        v: DiedricVector;
        diedric: Diedric;
    }) {
        this._diedric = diedric;

        const color = "blue";

        const geometry = new THREE.CylinderGeometry();

        // Create the cylinder material
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1,
        });

        // Create the cylinder mesh
        this.cylinder = new THREE.Mesh(geometry, this.material);
        this._diedric.scene.add(this.cylinder);

        this.horizontalProjectionLine2d = new TWO.Line({
            color: "blue",
            // color: color.toString(),
            width: 1,
        });
        this.verticalProjectionLine2d = new TWO.Line({
            color: "red",
            // color: color.toString(),
            width: 1,
        });
        this._diedric.canvas2d.add(this.horizontalProjectionLine2d);
        this._diedric.canvas2d.add(this.verticalProjectionLine2d);

        this._v = v;
        this._r = r;
        this.update();
    }

    update() {
        if (!this._v || !this._r) {
            console.warn("v or r is undefined");
            return;
        }

        const point = new THREE.Vector3(this._r.x.x, this._r.y.x, this._r.z.x);
        const vector = new THREE.Vector3(this._v.x.x, this._v.y.x, this._v.z.x);

        let lambda1: number;
        let lambda2: number;

        const horizontalProjectionPoints = [];
        const verticalProjectionPoints = [];

        const points: THREE.Vector3[] = [];
        if (vector.x != 0) {
            lambda1 = (this._diedric.size - point.x) / vector.x;
            lambda2 = (-this._diedric.size - point.x) / vector.x;

            let x: number;
            let y: number;
            let z: number;

            x = this._diedric.size;
            y = vector.y * lambda1 + point.y;
            z = vector.z * lambda1 + point.z;
            // For 3D line
            if (
                y >= -this._diedric.size &&
                y <= this._diedric.size &&
                z >= -this._diedric.size &&
                z <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (y >= -this._diedric.size && y <= this._diedric.size) {
                verticalProjectionPoints.push(new THREE.Vector2(x, -y));
            }
            if (z >= -this._diedric.size && z <= this._diedric.size) {
                horizontalProjectionPoints.push(new THREE.Vector2(x, z));
            }

            x = -this._diedric.size;
            y = vector.y * lambda2 + point.y;
            z = vector.z * lambda2 + point.z;
            // For 3D line
            if (
                y >= -this._diedric.size &&
                y <= this._diedric.size &&
                z >= -this._diedric.size &&
                z <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (y >= -this._diedric.size && y <= this._diedric.size) {
                verticalProjectionPoints.push(new THREE.Vector2(x, -y));
            }
            if (z >= -this._diedric.size && z <= this._diedric.size) {
                horizontalProjectionPoints.push(new THREE.Vector2(x, z));
            }
        }
        if (vector.y != 0) {
            lambda1 = (this._diedric.size - point.y) / vector.y;
            lambda2 = (-this._diedric.size - point.y) / vector.y;

            let x;
            let y;
            let z;

            x = vector.x * lambda1 + point.x;
            y = this._diedric.size;
            z = vector.z * lambda1 + point.z;
            // For 3D line
            if (
                x >= -this._diedric.size &&
                x <= this._diedric.size &&
                z >= -this._diedric.size &&
                z <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (x >= -this._diedric.size && x <= this._diedric.size) {
                if (z >= -this._diedric.size && z <= this._diedric.size) {
                    // horizontalProjectionPoints.push(new THREE.Vector2(x, z))
                }
                verticalProjectionPoints.push(new THREE.Vector2(x, -y));
            }

            x = vector.x * lambda2 + point.x;
            y = -this._diedric.size;
            z = vector.z * lambda2 + point.z;
            // For 3D line
            if (
                x >= -this._diedric.size &&
                x <= this._diedric.size &&
                z >= -this._diedric.size &&
                z <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (x >= -this._diedric.size && x <= this._diedric.size) {
                if (z >= -this._diedric.size && z <= this._diedric.size) {
                    // horizontalProjectionPoints.push(new THREE.Vector2(x, z))
                }
                verticalProjectionPoints.push(new THREE.Vector2(x, -y));
            }
        }
        if (vector.z != 0) {
            lambda1 = (this._diedric.size - point.z) / vector.z;
            lambda2 = (-this._diedric.size - point.z) / vector.z;

            let x;
            let y;
            let z;

            x = vector.x * lambda1 + point.x;
            y = vector.y * lambda1 + point.y;
            z = this._diedric.size;
            // For 3D line
            if (
                x >= -this._diedric.size &&
                x <= this._diedric.size &&
                y >= -this._diedric.size &&
                y <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (x >= -this._diedric.size && x <= this._diedric.size) {
                if (y >= -this._diedric.size && y <= this._diedric.size) {
                    // verticalProjectionPoints.push(new THREE.Vector2(x, -y))
                }
                horizontalProjectionPoints.push(new THREE.Vector2(x, z));
            }

            x = vector.x * lambda2 + point.x;
            y = vector.y * lambda2 + point.y;
            z = -this._diedric.size;
            // For 3D line
            if (
                x >= -this._diedric.size &&
                x <= this._diedric.size &&
                y >= -this._diedric.size &&
                y <= this._diedric.size
            )
                points.push(new THREE.Vector3(x, y, z));

            // For 2D line
            if (x >= -this._diedric.size && x <= this._diedric.size) {
                if (y >= -this._diedric.size && y <= this._diedric.size) {
                    // verticalProjectionPoints.push(new THREE.Vector2(x, -y))
                }
                horizontalProjectionPoints.push(new THREE.Vector2(x, z));
            }
        }

        const pointA = points[0];
        const pointB = points[1];

        this.verticalProjectionLine2d.start = verticalProjectionPoints[0];
        this.verticalProjectionLine2d.end = verticalProjectionPoints[1];

        this.horizontalProjectionLine2d.start = horizontalProjectionPoints[0];
        this.horizontalProjectionLine2d.end = horizontalProjectionPoints[1];

        // Calculate the midpoint between the two points
        const midpoint = new THREE.Vector3()
            .addVectors(pointA, pointB)
            .multiplyScalar(0.5);

        // Calculate the direction vector from pointA to pointB
        const direction = new THREE.Vector3().subVectors(pointB, pointA);

        const length = direction.length();

        // Create the cylinder geometry
        const radiusTop = 0.5; // Set the top radius
        const radiusBottom = 0.5; // Set the bottom radius
        const radialSegments = 32; // Set the number of radial segments
        const heightSegments = 1; // Set the number of height segments
        const openEnded = false; // Set whether the ends are open or capped
        const geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            length,
            radialSegments,
            heightSegments,
            openEnded
        );

        this.cylinder.geometry = geometry;

        // Position the cylinder at the midpoint
        this.cylinder.position.copy(midpoint);

        // Align the cylinder with the direction vector
        this.cylinder.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );
    }

    set r(newR: DiedricVector) {
        this._r = newR;
        this.update();
    }

    get r() {
        return this._r;
    }
    set v(newV: DiedricVector) {
        this._v = newV;
        this.update();
    }

    get v() {
        return this._v;
    }

    delete() {
        this._diedric.scene.remove(this.cylinder);
        console.warn("DiedricLine Implement delete");
    }
}
