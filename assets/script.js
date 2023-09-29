"use strict";

import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function() {


// helper functions

function degTan(t) { return Math.tan(t*Math.PI/180); }
function degAtan(x) { return Math.atan(x)*180/Math.PI; }

// setup booth model rendering

const output = document.querySelector("#booth-render");

const renderHandler = {
  scene: new THREE.Scene(),
  camera: {
    hfov: 72,
    obj: new THREE.PerspectiveCamera(45, output.clientWidth/output.clientHeight, 0.1, 2000),
    target: new THREE.Vector3(0.54, 1.14, 8.61), // hard-coded at centre of the booth
    relative: new THREE.Spherical(6, Math.PI/2, 0),
    get absolute() { return this.target.clone().add(new THREE.Vector3().setFromSpherical(this.relative)); },
    update() {
      this.obj.position.set(this.absolute.x, this.absolute.y, this.absolute.z);
      this.obj.lookAt(this.target);
    }
  },
  renderer: new THREE.WebGLRenderer({
    canvas: output,
    alpha: true,
    antialias: true,
  }),
  init() {
    requestAnimationFrame(() => { this.main() });
    const loader = new GLTFLoader();
    loader.load("./assets/booth.glb", (gltf) => {
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error(error);
    });
    const light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
  },
  main() {
    requestAnimationFrame(() => { this.main() });
    if (this.resizeRenderer()) {
      this.camera.obj.aspect = output.clientWidth / output.clientHeight;
      this.camera.obj.fov = degAtan(degTan(this.camera.hfov / 2) / this.camera.obj.aspect) * 2;
      this.camera.obj.updateProjectionMatrix();
    }
    this.camera.update();
    this.renderer.render(this.scene, this.camera.obj);
  },
  resizeRenderer() {
    const needResize = output.width !== output.clientWidth || output.height !== output.clientHeight;
    if (needResize) {
      this.renderer.setSize(output.clientWidth, output.clientHeight, false);
    }
    return needResize;
  },
}

renderHandler.init();

// handle booth rotation when clicking buttons

const navButtons = document.querySelectorAll(".pc-nav button");
navButtons.forEach((button, index) => {
  // TODO
});

// handle opening and closing of popouts

const popoutShows = document.querySelectorAll(".popout-show");
const popoutHides = document.querySelectorAll(".popout-hide");
for (let ps of popoutShows) {
  ps.addEventListener("click", () => {
    const popout = document.querySelector(`.popout[data-pid="${ps.dataset.pid}"]`);
    popout.showModal();
  });
}
for (let ph of popoutHides) {
  ph.addEventListener("click", () => {
    const popout = ph.closest(".popout");
    popout.close();
  });
}


})();