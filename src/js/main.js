import { Vector3 } from "three";
import Base from './threePlugin'

export default class View extends Base{
    $;
    config = {
        camera:{
            fov: 45,
            near: 1,
            far: 5000,
            position: new Vector3(100,100,0),
            up: new Vector3(0,1,0),
            lookAt: new Vector3(0,0,0)
        },
        backgroundColor: "black",
        exposure: 1.5
    }

    constructor(dom, $){
        super(dom),
        this.$ = $,
        this.init()
    }

    init(){
        super.init()
        super.setCamera(this.config.camera)
        super.initControls();
        super.initLight()
        this.initCamera = this.camera.clone();
        super.setDefaultBackground(this.config.backgroundColor)
    }
}