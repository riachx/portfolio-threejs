import './style.css'

import * as THREE from 'three';

import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// SCENE, CAMERA, RENDERER

const scene = new THREE.Scene();
//scene.background(0xFF6347);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// OBJECTS

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

// BLOB OBJECT

//const blobTexture = new THREE.TextureLoader().load('');

/*
const blob = new THREE.Mesh(
  new THREE.Geometry
  new THREE.MeshBasicMaterial({map:blobTexture})

  
);*/


const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xFF6347});
  const star = new THREE.Mesh(geometry,material);
  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('https://i.imgur.com/mct8FI5.jpg');
scene.background = spaceTexture;
// ANIMATION

function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate();