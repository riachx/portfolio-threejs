import './style.css'

import * as THREE from 'three';
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


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


const material = Object.assign(new MeshTransmissionMaterial(8));


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
  
  textMesh1.position.set(-7,2.8,6);
  textMesh2.position.set(-3.7,-2,6);
  textMesh3.position.set(-5.2,-6.5,6);
  textMesh4.position.set(-15,50,4);
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

