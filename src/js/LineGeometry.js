import {
    CatmullRomCurve3,
    Mesh,
    MeshPhongMaterial,
    TextureLoader, TubeGeometry,
    Vector3, RepeatWrapping, PointsMaterial, AdditiveBlending,
    Texture, BoxBufferGeometry,CylinderBufferGeometry
} from "three"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import {GLTFLoader} from './GLTFLoader'
const pathArr = [
    -10, 0, 10,
    -5, 5, 5,
    0, 0, 0,
    5, -5, 5,
    10, 0, 10
]
const radius = 2

function drawLine() {

    let currArr = []

    for (let i = 0; i < pathArr.length; i += 3) {
        currArr.push(new Vector3(pathArr[i], pathArr[i + 1], pathArr[i + 2]))
    }

    let curve = new CatmullRomCurve3(currArr)

    let tubeGeometry = new TubeGeometry(curve, 100, radius, 50, false)

    let textureLoader = new TextureLoader()
    let texture = textureLoader.load('building.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    // 设置x方向的重复数(沿着管道路径方向)
    // 设置y方向的重复数(环绕管道方向)
    texture.repeat.x = 10
    texture.repeat.y = 5

    //管道纹理偏移
    texture.offset.y = 0.5

    let tubeMaterial = new MeshPhongMaterial({
        map: texture,
        transparent: true
    })
    // let f = new PlaneGeometry(50,100)

    let tube = new Mesh(tubeGeometry, tubeMaterial)
    setInterval(() => {
        texture.offset.x -= 0.0076
    })

    return tube

}


function drawBox() {
    let textureLoader = new TextureLoader()
    let texture = textureLoader.load('building.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    // 设置x方向的重复数(沿着管道路径方向)
    // 设置y方向的重复数(环绕管道方向)
    // texture.repeat.x = 10
    // texture.repeat.y = 5

    //管道纹理偏移
    texture.offset.y = 0.5

    let tubeMaterial = new MeshPhongMaterial({
        map: texture,
        transparent: true
    })
    // const material = new MeshBasicMaterial( {color: 0x00ff00} );
    const geometry = new BoxBufferGeometry(10, 50, 10);
    const cube = new Mesh(geometry, tubeMaterial);
    setInterval(() => {
        texture.offset.y -= 0.0026
    })
    
    return cube
}

function drawCylinder(){
    let textureLoader = new TextureLoader()
    let texture = textureLoader.load('building.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    // 设置x方向的重复数(沿着管道路径方向)
    // 设置y方向的重复数(环绕管道方向)
    // texture.repeat.x = 10
    // texture.repeat.y = 5

    //管道纹理偏移
    texture.offset.y = 0.5

    let tubeMaterial = new MeshPhongMaterial({
        map: texture,
        transparent: true
    })

    const geometry = new CylinderBufferGeometry( 5, 5, 20, 32 ,1,true);
    let Cylinder = new Mesh(geometry,tubeMaterial)
    setInterval(()=>{
        texture.offset.y -= 0.0026
    })
    return Cylinder
}

function loadModel() {
    let loader = new GLTFLoader()
    loader.load('/model.glb', gltf => {
        let material = new PointsMaterial({
            color: 0xffffff,
            size: 0.4,
            opacity: 0.6,
            transparent: true,
            blending: AdditiveBlending,
            depthTest: false,
            map: generateSprite()
        })
        // let mesh = new Mesh(gltf.scene.children[0],material)

        // gltf.scene.children[0].boundingBox();
        // gltf.scene.children[0].center(); //居中显示
        // window.view.scene.add(gltf.scene.children[0])
        let obj = gltf.scene.children[0]
        // obj.children.map(m=>{
        //     m.children.map(l=>{
        //         l.children.map(i=>{
        //             // let mesh = new Mesh(i.geometry,material)
        //             //    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
        //             // // mesh.scale.set(0.1, 0.1, 0.1); //缩放
        //             // i.geometry.center()
        //             window.view.scene.add(i)
        //         })
        //     })
        // })
        window.view.scene.add(obj)
        console.log(material)
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
        console.log('An error happened', error)
    })
}

function generateSprite() {
    let canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16

    let context = canvas.getContext('2d')
    let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2)

    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient
    context.fillRect = (0, 0, canvas.width, canvas.height)

    let texture = new Texture(canvas)
    texture.needUpdate = true
    console.log(texture)
    return texture

}
export {
    drawLine,
    loadModel,
    drawBox,
    drawCylinder
}