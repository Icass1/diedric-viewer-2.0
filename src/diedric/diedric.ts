import * as THREE from "three";
import * as TWO from "../two/two";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { StaticLabel } from "./staticLabel";
import { DiedricPlane } from "./plane";

export class Diedric {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    renderer: THREE.WebGLRenderer;
    lastInnerHTML: string;
    staticLabels: StaticLabel[];
    size: number;

    canvas2d: TWO.Canvas;

    pb1: DiedricPlane;
    pb2: DiedricPlane;

    constructor(
        size: number,
        canvas3d: HTMLCanvasElement,
        canvas2d: HTMLCanvasElement
    ) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas3d.offsetWidth / canvas3d.offsetHeight,
            0.1,
            10000
        );
        this.scene.background = new THREE.Color("rgb(240, 236, 244)");

        window.addEventListener("resize", () => {
            if (canvas2d.parentNode && canvas3d.parentNode) {
                this.renderer.setSize(
                    canvas3d.offsetWidth,
                    canvas3d.offsetHeight
                );
                this.canvas2d.setSize(
                    canvas2d.offsetWidth,
                    canvas2d.offsetHeight
                );

                this.camera.aspect =
                    canvas3d.offsetWidth / canvas3d.offsetHeight;
                this.camera.updateProjectionMatrix();
            }
        });

        this.size = size;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas3d,
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvas3d.offsetWidth, canvas3d.offsetHeight);
        this.getLocalStorageCameraConfig();

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.canvas2d = new TWO.Canvas(canvas2d);
        this.canvas2d.setSize(canvas2d.offsetWidth, canvas2d.offsetHeight);
        this.canvas2d.setBackground("rgb(240, 236, 244)");

        this.lastInnerHTML = "";
        this.staticLabels = [];

        this.animate();

        this.drawEarthLine();

        this.drawAxis();
        this.drawVerticalPlaneLabel();
        this.drawHorizontalPlaneLabel();

        // this.pb1 = new DiedricPlane(
        //     this,
        //     new THREE.Vector3(0, -1, 1),
        //     0,
        //     "blue"
        // );
        // this.pb2 = new DiedricPlane(this, new THREE.Vector3(0, 1, 1), 0, "red");
        // this.pb1.hidden = true;
        // this.pb2.hidden = true;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.controls.update();

        const newInnerHTML = `
            <label>
                Rotation: 
                ${(Math.round(this.camera.rotation.x * 100) / 100).toString()}
                ${(Math.round(this.camera.rotation.y * 100) / 100).toString()}
                ${(Math.round(this.camera.rotation.z * 100) / 100).toString()}
            </label>
                <label>
                Position:
                ${(Math.round(this.camera.position.x * 100) / 100).toString()}
                ${(Math.round(this.camera.position.y * 100) / 100).toString()}
                ${(Math.round(this.camera.position.z * 100) / 100).toString()}
            </label>
            <label>
                Scene elements: ${this.scene.children.length}
            </label>
        `;
        if (newInnerHTML != this.lastInnerHTML) {
            // canvasInfo.innerHTML = newInnerHTML
            this.lastInnerHTML = newInnerHTML;
            localStorage.setItem(
                "camera",
                JSON.stringify({
                    rotation_x: Math.round(this.camera.rotation.x * 100) / 100,
                    rotation_y: Math.round(this.camera.rotation.y * 100) / 100,
                    rotation_z: Math.round(this.camera.rotation.z * 100) / 100,
                    position_x: Math.round(this.camera.position.x * 100) / 100,
                    position_y: Math.round(this.camera.position.y * 100) / 100,
                    position_z: Math.round(this.camera.position.z * 100) / 100,
                })
            );

            this.staticLabels.forEach((mesh) => {
                mesh.rotation = new THREE.Vector3(
                    this.camera.rotation.x,
                    this.camera.rotation.y,
                    this.camera.rotation.z
                );
            });
        }
        this.renderer.render(this.scene, this.camera);
        this.canvas2d.render();
    }

    getLocalStorageCameraConfig() {
        const localStorageCamera = localStorage.getItem("camera");
        if (localStorageCamera) {
            const cameraConfig = JSON.parse(localStorageCamera);
            if (cameraConfig.position_x == 0) {
                cameraConfig.position_x = 1;
            }
            this.camera.position.setX(cameraConfig.position_x);
            this.camera.position.setY(cameraConfig.position_y);
            this.camera.position.setZ(cameraConfig.position_z);
            this.camera.rotation.x = cameraConfig.rotation_x;
            this.camera.rotation.y = cameraConfig.rotation_y;
            this.camera.rotation.z = cameraConfig.rotation_z;
        } else {
            this.camera.position.setZ(20);
            this.camera.position.setY(50);
            this.camera.position.setX(20);
        }
    }

    drawEarthLine() {
        let line = new TWO.Line({ color: "black" });
        line.start = new THREE.Vector2(-this.size, 0);
        line.end = new THREE.Vector2(this.size, 0);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "black" });
        line.start = new THREE.Vector2(-this.size + 3, 6);
        line.end = new THREE.Vector2(-this.size + 15, 6);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "black" });
        line.start = new THREE.Vector2(this.size - 3, 6);
        line.end = new THREE.Vector2(this.size - 15, 6);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "black" });
        line.start = new THREE.Vector2(0, 5);
        line.end = new THREE.Vector2(0, -5);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "rgb(200, 200, 200)" });
        line.start = new THREE.Vector2(-this.size, -this.size);
        line.end = new THREE.Vector2(-this.size, this.size);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "rgb(200, 200, 200)" });
        line.start = new THREE.Vector2(-this.size, this.size);
        line.end = new THREE.Vector2(this.size, this.size);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "rgb(200, 200, 200)" });
        line.start = new THREE.Vector2(this.size, this.size);
        line.end = new THREE.Vector2(this.size, -this.size);
        this.canvas2d.add(line);

        line = new TWO.Line({ color: "rgb(200, 200, 200)" });
        line.start = new THREE.Vector2(this.size, -this.size);
        line.end = new THREE.Vector2(-this.size, -this.size);
        this.canvas2d.add(line);
    }

    drawAxis() {
        const axesMaterial = new THREE.LineBasicMaterial({ color: 0x56d154 });

        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-this.size, 0, 0),
            new THREE.Vector3(this.size, 0, 0),
        ]);
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -this.size, 0),
            new THREE.Vector3(0, this.size, 0),
        ]);
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, -this.size),
            new THREE.Vector3(0, 0, this.size),
        ]);
        const xLine = new THREE.Line(xGeometry, axesMaterial);
        const yLine = new THREE.Line(yGeometry, axesMaterial);
        const zLine = new THREE.Line(zGeometry, axesMaterial);
        this.scene.add(xLine, yLine, zLine);

        const squareGeometry = new THREE.PlaneGeometry(
            2 * this.size,
            2 * this.size
        );
        // const facesMaterial = new THREE.LineBasicMaterial({ color: 0x56d154, transparent: true, opacity: 0.1, side: THREE.DoubleSide, forceSinglePass: true });
        const facesMaterial = new THREE.MeshBasicMaterial({
            color: 0x56d154,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            forceSinglePass: true,
            wireframe: true,
        });
        const face1 = new THREE.Mesh(squareGeometry, facesMaterial);
        const face2 = new THREE.Mesh(squareGeometry, facesMaterial);
        const face3 = new THREE.Mesh(squareGeometry, facesMaterial);
        const face4 = new THREE.Mesh(squareGeometry, facesMaterial);
        const face5 = new THREE.Mesh(squareGeometry, facesMaterial);
        const face6 = new THREE.Mesh(squareGeometry, facesMaterial);
        face1.position.set(0, 0, this.size);
        face2.position.set(0, 0, -this.size);

        face3.rotateX(Math.PI / 2);
        face3.position.set(0, this.size, 0);
        face4.rotateX(Math.PI / 2);
        face4.position.set(0, -this.size, 0);

        face5.rotateY(Math.PI / 2);
        face5.position.set(this.size, 0, 0);
        face6.rotateY(Math.PI / 2);
        face6.position.set(-this.size, 0, 0);

        this.scene.add(face1, face2, face3, face4, face5, face6);
    }
    drawHorizontalPlaneLabel() {
        const cv = document.createElement("canvas");
        cv.width = 512; //  3 * 512
        cv.height = 512;
        const ctx = cv.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
        // ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "bold 70vh Arial";
        // https://unicode.org/emoji/charts/full-emoji-list.html#1f642 (mark and copy - column Browser)
        ctx.fillText("H", 30, 300);
        const txtGeometry = new THREE.BoxGeometry(20, 20, 0); // w 3 : h 1
        const cvTexture = new THREE.Texture(cv);
        cvTexture.needsUpdate = true; // otherwise all black only
        const spineMat = new THREE.MeshPhongMaterial({
            color: 0xa5800e,
            transparent: true,
            opacity: 0.1,
        });
        const cvMaterial = new THREE.MeshBasicMaterial({
            map: cvTexture,
            transparent: true,
            opacity: 1,
        });
        const cvMaterials = [
            spineMat,
            spineMat,
            spineMat,
            spineMat,
            cvMaterial,
            cvMaterial,
        ];
        const cvTxtMesh = new THREE.Mesh(txtGeometry, cvMaterials);
        cvTxtMesh.rotation.x = Math.PI / 2; // radiant
        cvTxtMesh.rotation.z = Math.PI; // radiant
        cvTxtMesh.position.set(this.size - 10, 0, this.size - 10);
        this.scene.add(cvTxtMesh);
    }

    drawVerticalPlaneLabel() {
        const cv = document.createElement("canvas");
        cv.width = 512; //  3 * 512
        cv.height = 512;
        const ctx = cv.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
        // ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "bold 70vh Arial";
        // https://unicode.org/emoji/charts/full-emoji-list.html#1f642 (mark and copy - column Browser)
        ctx.fillText("V", 40, 300);
        const txtGeometry = new THREE.BoxGeometry(20, 20, 0); // w 3 : h 1
        const cvTexture = new THREE.Texture(cv);
        cvTexture.needsUpdate = true; // otherwise all black only
        const spineMat = new THREE.MeshPhongMaterial({
            color: 0xa5800e,
            transparent: true,
            opacity: 0.1,
        });
        const cvMaterial = new THREE.MeshBasicMaterial({
            map: cvTexture,
            transparent: true,
            opacity: 1,
        });
        const cvMaterials = [
            spineMat,
            spineMat,
            spineMat,
            spineMat,
            cvMaterial,
            cvMaterial,
        ];
        const cvTxtMesh = new THREE.Mesh(txtGeometry, cvMaterials);
        // cvTxtMesh.rotation.x = Math.PI / 2; // radiant
        // cvTxtMesh.rotation.z = Math.PI; // radiant
        cvTxtMesh.position.set(this.size - 10, this.size - 10, 0);
        this.scene.add(cvTxtMesh);
    }

    createStaticLabel(text: string, position: THREE.Vector3) {
        const label = new StaticLabel(this.scene, text, position);
        this.staticLabels.push(label);

        return label;
    }
}
