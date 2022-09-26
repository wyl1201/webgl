import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import PHOENIX from '@/assets/glb/phoenix_bird.glb'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const loader = new GLTFLoader()

loader.load(PHOENIX, function (gltf) {
  console.log(`🚀 ~ file: main.js ~ line 19 ~ gltf`, gltf)
  scene.add(gltf.scene)
  renderer.render(scene, camera)
})
