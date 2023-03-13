import './style.css'

import * as THREE from 'three';

import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//scene, camera, renderer

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// objects

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color:0xFF6347});
const torus = new THREE.Mesh( geometry, material );


const oct = new THREE.OctahedronGeometry(3,2,3,100);
const oct_mat = new THREE.MeshStandardMaterial({color:0xFB6321});
const octahedron = new THREE.Mesh( oct , oct_mat );

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(5,5,5);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
directionalLight.position.set(20,20,5);


scene.add(pointLight, ambientLight, directionalLight);

// HELPERS
const lightHelper = new THREE.DirectionalLightHelper(directionalLight)
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper)

scene.add(torus, octahedron)

const controls = new OrbitControls(camera, renderer.domElement);

function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  renderer.render( scene, camera );
}

animate();