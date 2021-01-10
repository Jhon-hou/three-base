import {
    Raycaster, Vector2, Scene,  WebGLRenderer, PerspectiveCamera,
    AmbientLight, DirectionalLight, Color
  } from 'three';
  import  TrackballControls  from 'three-trackballcontrols/index.js';
export default class Base {
    constructor(dom){
        this.camera = null
        this.render = null
        this.renderer = null
        this.scene = new Scene()
        this.controls = null
        this.mouse = new Vector2()
        this.raycaster = new Raycaster()
        this.canvas = document.querySelector(dom)
        this.setWidthAndHeight()
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

        this.canvas.appendChild(this.renderer.domElement)

        this.renderer.autoClear = false;
        this.renderer.setAnimationLoop(() => {
            const size = 2000
            this.renderer.setViewport(0,0, this.width, this.height)
            this.renderer.render(this.scene,this.camera)
            this.renderer.setViewport(this.width -size, this.height-size, size, size)
            this.controls.update();
        });
    }
    render(){
        const size = 2000
        this.renderer.setViewport(0,0, this.width, this.height)
        this.renderer.render(this.scene,this.camera)
        this.renderer.setViewport(this.width -size, this.height-size, size, size)

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
        // this.controls.update();
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

        this.raycaster(this.mouse, this.camera)

        return this.raycaster.intersectObjects(objects, true)
    }

    initControls(){
        this.controls = new TrackballControls(this.camera, this.canvas)
        console.log(this.controls)
        this.controls.rotateSpeed = 7
        this.controls.zoomSpeed = 6
        this.controls.panSpeed = 2
        this.controls.noZoom = false
        this.controls.noPan = false
        this.controls.staticMoving = true
        this.controls.dynamicDampingFactor = 0.1
    }

    initWindowResize = () => window.addEventListener("resize", () => this.resize());

    setDefaultBackground(colors) {
         this.scene.background = new Color(colors)
      }
}