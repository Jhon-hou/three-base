import {
 Scene,  WebGLRenderer, PerspectiveCamera,
    AmbientLight, DirectionalLight
  } from 'three';

import  TrackballControls  from 'three-trackballcontrols/index.js';

export default class View {
    constructor(dom){
        this.camera = null
        this.controls = null
        this.renderer = null
        this.scene = new Scene()
        this.canvas = document.querySelector(dom)
    }
    init(){
        this.initLight()
        this.initCamera()
        this.initControls()
        this.initRender()
        this.windowResize()
    }

    initLight(){
        let light = new AmbientLight(0x999999)  //环境光
        let light2 = new DirectionalLight(0xdfebff, 0.45)  //平行光

        light2.position.set(50,200,100)
        light2.position.multiplyScalar(0.3)
        this.scene.add(light)
        this.scene.add(light2) 
        
    }

    initCamera(){
        this.camera = new PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            1000
    );
        this.camera.position.set(10, 150 , 150);
        this.camera.lookAt(this.scene.position);
    }

    initControls(){
        this.controls = new TrackballControls(this.camera,this.render.domElement)
        this.controls.noZoom = false; //是否禁用缩放
        this.controls.noPan = false; //是否禁用平移
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
    }

    initRender(){
        this.renderer = new WebGLRenderer({alpha: true})
        this.renderer.setPixelRatio(window.devicePixelRatio); //为了兼容高清屏幕
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.canvas.appendChild(this.renderer.domElement)

        requestAnimationFrame(this.animate, this.render.domElement);
        this.controls.update();
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth,window.innerHeight)
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }
    windowResize = ()=> window.addEventListener('resize',()=> this.resize())
}