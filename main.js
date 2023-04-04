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



// Animation variables

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
const material = Object.assign(new MeshTransmissionMaterial(8));
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

const torusmesh = new THREE.TorusKnotGeometry(13, 4, 100, 100);
const torusmat = Object.assign(new MeshTransmissionMaterial(8), {
    
  clearcoatRoughness: 0,
  transmission: 0.95,
  chromaticAberration: 0.2,
  //anisotropy: 0.5,
  // Set to > 0 for diffuse roughness
  roughness: 0.3,
  thickness: 7,
  ior: 1.2,
  envMapIntensity: 50,
  bloomstrength:50,
  distortion: 0.3,
  distortionScale: 0.1,

});
const torus = new THREE.Mesh(torusmesh,torusmat);
torus.position.set(0,42,0);
scene.add(torus);

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
const material_hdri = new THREE.MeshPhysicalMaterial();
material_hdri.envMap = texture;
material_hdri.needsUpdate = true;

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
  fbx.name = 'Cube_fbx';
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
    envMapIntensity: 7,

    distortion: 0,
    distortionScale: 0.5,
    temporalDistortion: 0.0,

  });
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
} );


//const spaceTexture = new THREE.TextureLoader().load('background.png');
//const pastelgreen = new THREE.Color(0xabc98d);
//spaceTexture.minFilter = THREE.NearestFilter;
//scene.background = spaceTexture;


const fontloader = new FontLoader();

fontloader.load( 'fonts/Poppins_ExtraBold.json', function ( font ) {
  const config = ({
    size: 3,
    height: 0.001,
    font: font,
    
  });

  const config2 = ({
    size: 6.5,
    height: 0.001,
    font: font,
    
  });

	const text_explore = new TextGeometry( 'Explore', {...config,} );
  const text_new = new TextGeometry( 'New', {...config,} );
  const text_ideas = new TextGeometry( 'Ideas.',{...config,} );
  const text_expand = new TextGeometry( 'Expand', {...config2,} );
  const text_your = new TextGeometry( 'Your', {...config2,} );
  const text_horizons = new TextGeometry( 'Horizons.',{...config2,} );

  const textMaterial = new THREE.MeshPhysicalMaterial({color:0xd7dbde});
  const textMesh1 = new THREE.Mesh(text_explore, textMaterial);
  const textMesh2 = new THREE.Mesh(text_new, textMaterial);
  const textMesh3 = new THREE.Mesh(text_ideas, textMaterial);

  const textMesh4 = new THREE.Mesh(text_expand, textMaterial);
  const textMesh5 = new THREE.Mesh(text_your, textMaterial);
  const textMesh6 = new THREE.Mesh(text_horizons, textMaterial);

  scene.add(textMesh1,textMesh2,textMesh3,textMesh4,textMesh5,textMesh6);
  //camera.add(textMesh1);
  textMesh1.position.set(-7,2.8,6);
  //textMesh1.position.set(0,-5,-40);
  textMesh2.position.set(-3.7,-2,6);
  textMesh3.position.set(-5.2,-6.5,6);

  textMesh4.position.set(-15,50,4);
  //textMesh1.position.set(0,-5,-40);
  textMesh5.position.set(-10,40,4);
  textMesh6.position.set(-18,30,4);
  
} );


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
  
  
  //textMesh1.position.set(0,0,0);
}

document.body.onscroll = moveCamera;
camera.position.set(0, 50, 50);
moveCamera();


// ANIMATION
function animate() {

  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  var fbxObj = scene.getObjectByName('Cube_fbx');
  if(fbxObj){
    fbxObj.rotation.x += 0.01;
    
  }
	
  renderer.render(scene, camera);
}

animate();

