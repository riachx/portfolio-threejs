import './style.css'

import * as THREE from 'three';
import { pcss} from '@pmndrs/vanilla'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// SCENE, CAMERA, RENDERER
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// resize window 

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onWindowResize();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(0);
camera.position.setY(5);
camera.position.setZ(20);

renderer.render(scene, camera);


// OBJECTS


/*const hdrEquirect = new THREE.RGBELoader().load(
  "empty_warehouse_01_4k.hdr",  
  () => { 
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; 
  }
);*/


//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const geometry = new THREE.BoxGeometry(10, 10,10);
const material = new THREE.MeshPhysicalMaterial();
/*const material = new THREE.MeshPhysicalMaterial({ 
  transmission: 1,
  thickness: 10,
  roughness: 0.07,
  map: null,
  side: THREE.DoubleSide,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  normalScale: 1,
  clearcoatNormalScale: 0.3,
  normalRepeat: 1,
  bloomThreshold: 0.85,
  bloomStrength: 0.8,
  bloomRadius: 0.33,
  metalness: 0.4,
  envMapIntensity: 0.3,
  //envMap: texture,
 });
 const torus = new THREE.Mesh(geometry, material);
 scene.add(torus);*/


//const torus2 = new THREE.Mesh(geometry, material);


const oct = new THREE.OctahedronGeometry(10, 1, 2, 100);

//oct.material = Object.assign(new MeshTransmissionMaterial(10), {
const oct_mat = new MeshTransmissionMaterial({
  _transmission: 1,
  thickness: 1,
  //roughness: 0,
  //chromaticAberration: 0.03,
  //anisotropy: 0.1,
  //distortion: 0,
  //distortionScale: 0.5,
  //temporalDistortion: 0.0,
})

const octahedron = new THREE.Mesh(oct, oct_mat);
scene.add(octahedron);

new RGBELoader()
//.setPath( 'assets/' )
.load( 'assets/warehouse.hdr', function ( texture ) {

texture.mapping = THREE.EquirectangularReflectionMapping;
//scene.background = texture;
material.envMap = texture;
material.needsUpdate = true;

//PLANE

//const flower = new THREE.TextureLoader().load('flower.jpeg');

/*const plane_geo = new THREE.PlaneGeometry(60,60);
const plane_geo2 = new THREE.PlaneGeometry(3,3);

const plane_mat = new THREE.MeshBasicMaterial({ color: 0xffffff});
const plane = new THREE.Mesh(plane_geo, plane_mat);
const plane2 = new THREE.Mesh(plane_geo2, plane_mat);
scene.add(plane,plane2);
plane.rotation.set(90,0,0);
plane.position.set(0,20,0);

plane2.position.set(0,0,12);
plane2.rotation.set(0,30,0);*/
// ICE CUBE


const icecube = new FBXLoader();

icecube.load('/assets/models/chamfercube.fbx', function (fbx) {
  //ball.scale.set(100, 100, 100);
  //loadedModel = fbx;
  //loadedModel.name = 'cube_fbx';
  fbx.name = 'Cube_fbx'
  fbx.position.set(0,0,10);
  fbx.scale.set(0.035, 0.035, 0.035);
  fbx.rotation.set(90,120,90);

  
  const ball_mat = Object.assign(new MeshTransmissionMaterial(8), {
    
    
    clearcoatRoughness: 0,
    transmission: 1,
    chromaticAberration: 0.03,
    anisotropy: 0.1,
    // Set to > 0 for diffuse roughness
    roughness: 0,
    thickness: 3,
    ior: 1.5,

    


    
  });/*
  
  const ball_mat = new THREE.MeshPhysicalMaterial({
    
  color:0xffffff,
  transmission: 1,
  thickness: 3,
  roughness: 0.07,
  //map: null,
  opacity: 0.9,
  transparent: true,
  //side: THREE.DoubleSide,
  //clearcoat: 1,
  //clearcoatRoughness: 0.1,
  //normalScale: 1,
  //clearcoatNormalScale: 0.3,
  //normalRepeat: 1,
  bloomThreshold: 0.85,
  bloomStrength: 0.4,
  bloomRadius: 0.33,
  metalness: 0.2,
  envMapIntensity: 0.2,
    
  });*/
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = ball_mat;
      child.material.envMap = texture;
      child.material.needsUpdate = true;
     
    }
  });

  scene.add(fbx);

}, undefined, function (error) {

  console.error(error);

});



//scene.background = texture;
//scene.environment = texture;

} );

// CUBE

/*const bgTexture = new THREE.TextureLoader().load('https://i.imgur.com/mct8FI5.jpg');
scene.background = bgTexture;

const box = new THREE.BoxGeometry(10,10,10);
const boxmat = new THREE.MeshStandardMaterial({
  color:0xff934f,
  roughness: 0.5,
})
const box1 = new THREE.Mesh(box, boxmat);*/

const spaceTexture = new THREE.TextureLoader().load('background.png');
//const pastelgreen = new THREE.Color(0xabc98d);
scene.background = spaceTexture;

/*
const box = new THREE.BoxGeometry(10, 10, 10);
const boxtex = new THREE.TextureLoader().load('https://i.imgur.com/mct8FI5.jpg');
const boxmat = new THREE.MeshStandardMaterial({
  
  //map: boxtex,
  roughness: 0.4,
  opacity: 0.7,
  transparent: true,
  thickness:1,
  //metalness: 0.2,
  envMapIntensity: 1.0,
});

material.envMap = boxtex;
material.envMap.mapping = THREE.CubeReflectionMapping;
material.envMap.mapping = THREE.CubeRefractionMapping;

const cube = new THREE.Mesh(box, boxmat);
scene.add(cube);
*/
//NEW TEXT
/*
const fontloader = new FontLoader();

fontloader.load( 'fonts/Graphik_Semibold_Regular.json', function ( graphikfont ) {

	const textGeometry = new TextGeometry( 'Hello three.js!', {
		size: 80,
		height: 5,
    font: graphikfont,
	} );
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -36;
} );
*/


//torus2.position.set(0, 50, -20);

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(5, 5, 5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(20, 20, 5);

scene.add(pointLight, ambientLight, directionalLight);

// HELPERS

//const lightHelper = new THREE.DirectionalLightHelper(directionalLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper)
/*
const ball_base = new THREE.TextureLoader().load('assets/textures/squiggle_base.png');
const ball_normal = new THREE.TextureLoader().load('assets/textures/squiggle_normal.png');
const ball_rough = new THREE.TextureLoader().load('assets/textures/squiggle_rough.png');
const ball_AO = new THREE.TextureLoader().load('assets/textures/squiggle_AO.png');

const ball = new FBXLoader();

ball.load('assets/models/squigglyball.fbx', function (fbx) {
  //ball.scale.set(100, 100, 100);
  //ball.position.set(0,0,0);
  fbx.scale.set(0.12, 0.12, 0.12);

  const ball_mat = new THREE.MeshStandardMaterial({
    color: 0xc6c983,
    emissive: 0xffffff,
    emissiveIntensity: 0.2,
    //map: ball_base,
    normalMap: ball_normal,
    roughness: ball_rough,
    aoMap: ball_AO,
    aoMapIntensity: 0.2,

  });
  //normalMap: textureLoader.load('assets/textures/squiggle_normal.png') // Normal map
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = ball_mat;
    }
  });

  scene.add(fbx);

}, undefined, function (error) {

  console.error(error);

});*/

//const controls = new OrbitControls(camera, renderer.domElement);

function moveCamera() {

  const t = document.body.getBoundingClientRect().top;


  camera.position.z = t * -0.01 + 20; // offset value
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.02;

}

document.body.onscroll = moveCamera;
camera.position.set(0, 50, 50);
moveCamera();

// ANIMATION
function animate() {

  requestAnimationFrame(animate);
  //torus.rotation.x += 0.001;
  //torus.rotation.y += 0.005;
  //torus.rotation.z += 0.01;

  var fbxObj = scene.getObjectByName('Cube_fbx');
  if(fbxObj){
    fbxObj.rotation.x += 0.01;
    fbxObj.rotateZ +=0.01;
  }
  renderer.render(scene, camera);
}

animate();