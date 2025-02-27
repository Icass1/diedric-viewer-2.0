import { Diedric } from "./diedric";
import { DiedricVector } from "./vector";
import * as THREE from "three";
import * as TWO from "../two/two";

export class DiedricPoint {
    type = "DiedricPoint";
    private _r: DiedricVector;
    private _diedric: Diedric;

    private bPoint: THREE.Mesh<
        THREE.SphereGeometry,
        THREE.MeshBasicMaterial,
        THREE.Object3DEventMap
    >;

    private material: THREE.MeshBasicMaterial;

    private lineToY0Line: THREE.Line<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.LineBasicMaterial,
        THREE.Object3DEventMap
    >;
    private lineToX0Line: THREE.Line<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.LineBasicMaterial,
        THREE.Object3DEventMap
    >;
    private lineToZ0Line: THREE.Line<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.LineBasicMaterial,
        THREE.Object3DEventMap
    >;

    private horizontalProjection: TWO.Point;
    private verticalProjection: TWO.Point;
    private horizontalProjectionLabel: TWO.Label;
    private verticalProjectionLabel: TWO.Label;

    private lineToY0Geometry: THREE.BufferGeometry;
    private lineToX0Geometry: THREE.BufferGeometry;
    private lineToZ0Geometry: THREE.BufferGeometry;

    constructor({ r, diedric }: { r: DiedricVector; diedric: Diedric }) {
        this._diedric = diedric;

        const color = "orange";

        const lineMaterial = new THREE.LineDashedMaterial({
            color: "black",
            linewidth: 1,
            scale: 1,
            dashSize: 3,
            gapSize: 3,
        });

        this.lineToY0Geometry = new THREE.BufferGeometry().setFromPoints([]);
        this.lineToY0Line = new THREE.Line(this.lineToY0Geometry, lineMaterial);

        this.lineToX0Geometry = new THREE.BufferGeometry().setFromPoints([]);
        this.lineToX0Line = new THREE.Line(this.lineToX0Geometry, lineMaterial);

        this.lineToZ0Geometry = new THREE.BufferGeometry().setFromPoints([]);
        this.lineToZ0Line = new THREE.Line(this.lineToZ0Geometry, lineMaterial);

        const geometry = new THREE.SphereGeometry(1);
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
        });

        this.bPoint = new THREE.Mesh(geometry, this.material);

        this._diedric.scene.add(this.bPoint);
        this._diedric.scene.add(this.lineToX0Line);
        this._diedric.scene.add(this.lineToY0Line);
        this._diedric.scene.add(this.lineToZ0Line);

        this.verticalProjection = new TWO.Point({
            radius: 3,
            color: color.toString(),
        });
        this.horizontalProjection = new TWO.Point({
            radius: 3,
            color: color.toString(),
        });

        this._diedric.canvas2d.add(this.verticalProjection);
        this._diedric.canvas2d.add(this.horizontalProjection);

        this.verticalProjectionLabel = new TWO.Label({
            text: "",
            color: color,
        });
        this.horizontalProjectionLabel = new TWO.Label({
            text: "",
            color: color,
        });

        this._diedric.canvas2d.add(this.verticalProjectionLabel);
        this._diedric.canvas2d.add(this.horizontalProjectionLabel);

        this.r = r;
    }

    set r(newR: DiedricVector) {
        this.bPoint.position.x = newR.x.x;
        this.bPoint.position.y = newR.y.x;
        this.bPoint.position.z = newR.z.x;

        this.lineToY0Geometry.setFromPoints([
            this.bPoint.position,
            new THREE.Vector3(newR.x.x, 0, newR.z.x),
        ]);
        this.lineToX0Geometry.setFromPoints([
            new THREE.Vector3(newR.x.x, 0, newR.z.x),
            new THREE.Vector3(0, 0, newR.z.x),
        ]);
        this.lineToZ0Geometry.setFromPoints([
            new THREE.Vector3(newR.x.x, 0, newR.z.x),
            new THREE.Vector3(newR.x.x, 0, 0),
        ]);
        this.lineToX0Line.computeLineDistances();
        this.lineToY0Line.computeLineDistances();
        this.lineToZ0Line.computeLineDistances();

        this.verticalProjection.pos = new TWO.Vector2(newR.x.x, -newR.y.x);
        this.horizontalProjection.pos = new TWO.Vector2(newR.x.x, newR.z.x);

        this.verticalProjectionLabel.pos = new TWO.Vector2(
            newR.x.x,
            -newR.y.x
        );
        this.horizontalProjectionLabel.pos = new TWO.Vector2(
            newR.x.x,
            newR.z.x
        );

        this._r = newR;
    }

    get r() {
        return this._r;
    }

    delete() {
        this._diedric.scene.remove(this.bPoint);
        this._diedric.scene.remove(this.lineToX0Line);
        this._diedric.scene.remove(this.lineToY0Line);
        this._diedric.scene.remove(this.lineToZ0Line);

        this._diedric.canvas2d.remove(this.verticalProjection);
        this._diedric.canvas2d.remove(this.horizontalProjection);

        this._diedric.canvas2d.remove(this.verticalProjectionLabel);
        this._diedric.canvas2d.remove(this.horizontalProjectionLabel);

        // console.warn("DiedricPoint Implement delete");
    }
}
