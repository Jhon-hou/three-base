import {
    Raycaster, Vector2, Scene,  WebGLRenderer, PerspectiveCamera,
    AmbientLight, DirectionalLight, Color , AnimationMixer , Clock ,
    ReinhardToneMapping
  } from 'three';
  import  TrackballControls  from 'three-trackballcontrols/index.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'   
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'

const TWEEN = require('@tweenjs/tween.js') 
export default class Base {
    constructor(dom){
        this.camera = null
        this.render = null
        this.renderer = null
        this.scene = new Scene()
        this.controls = null
        this.mouse = new Vector2()
        // this.raycaster = new Raycaster()
        this.canvas = document.querySelector(dom)
        this.setWidthAndHeight()
        this.tween = new TWEEN.Tween()
        this.loade = new GLTFLoader()
        this.mixer = null
        this.clock = new Clock()  // 调用动画帧需要初始化
        this.comporser = null
    }
    init(){
        this.initRender()
        this.initWindowResize()
    }

    initRender(){
        this.renderer = new WebGLRenderer({antialias: true, alpha: true})
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setClearColor(0xeeeeee)
        // this.renderer.toneMapping = ReinhardToneMapping
        // this.renderer.toneMapping = 1
        this.canvas.appendChild(this.renderer.domElement)

        this.renderer.autoClear = false;
        this.renderer.setAnimationLoop(() => {

            this.renderer.clear()
            this.camera.layers.set(1)
            this.comporser.render()

            this.renderer.clearDepth()
            this.camera.layers.set(0)
            this.renderer.render(this.scene,this.camera)
            this.controls.update();
            this.tween.update()
            if(this.mixer){
                const delta = this.clock.getDelta()
                this.mixer.update(delta)
            }
           
        });
    }

    initPass(){
        let renderPass = new RenderPass(this.scene,this.camera)
        let bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth,window.innerHeight),1.5,0.4,0.85)
        bloomPass.renderToScreen = true

        this.comporser = new EffectComposer(this.renderer)
        this.comporser.setSize(window.innerWidth,window.innerHeight)
        this.comporser.addPass(renderPass)
        this.comporser.addPass(bloomPass)
    }
  
    initLight(){
        const light1 = new AmbientLight(0xFFFFFF, 0.5)
        light1.name = 'amb_light'
        this.scene.add(light1)

        const light2 = new DirectionalLight(0xFFFFFF)
        light2.name =  'dir_light'
        light2.position.set(5,5,5)
        this.scene.add(light2)
    }

    

    setWidthAndHeight() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    resize(){
        this.setWidthAndHeight()

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.width , this.height)

        if(this.comporser){
            this.comporser.setSize(this.width , this.height)
        }
    }

    setCamera({fov, near, far, position, up, lookAt }){
        let {x,y,z} = position

        this.camera = new PerspectiveCamera(
            fov, this.width / this.height, near, far
          );
          this.camera.up.set(up.x, up.y, up.z);
          this.camera.position.set(x, y, z);
          this.camera.lookAt(lookAt);
      
          this.camera.origin = this.camera.clone(true);
      
          this.scene.add(this.camera);
    }

    getRaycasters(event, objects){
        const canvas = this.renderer.domElement

        this.mouse.x = ((event.clientX - canvas.getBoundingClientRect().left) / canvas.offsetWidth) *2 -1
        this.mouse.y = ((event.clientY - canvas.getBoundingClientRect().top) / canvas.offsetHeight) *2 +1
        let raycaster = new Raycaster()
        raycaster.setFromCamera(this.mouse,this.camera)
        // console.log(raycaster.intersectObjects(objects, true)[0])
        return raycaster.intersectObjects(objects, true)[0]
    }

    initControls(){
        this.controls = new TrackballControls(this.camera, this.canvas)
        this.controls.rotateSpeed = 7
        this.controls.zoomSpeed = 6
        this.controls.panSpeed = 2
        this.controls.noZoom = false
        this.controls.noPan = false
        this.controls.staticMoving = true
        this.controls.dynamicDampingFactor = 0.1
    }

    loader(file){
        if(typeof(file) ==='string'){
                this.loade.load(file,obj=>{
                    this.scene.add(obj.scene)
                    if(obj.animations.length>0){
                        this.mixer = new AnimationMixer(obj.scene)
                        const clip = obj.animations[0]
                        this.mixer.clipAction(clip.optimize()).play()
                    }
                })
        }
    }

    initWindowResize = () => window.addEventListener("resize", () => this.resize());

    setDefaultBackground(colors) {
         this.scene.background = new Color(colors)
      }
}