<template>
  <div class="home">
    <div class="webgl" id="webgl"></div>
    <!-- <button class="button" @click="geo()">绘制管道</button> -->
  </div>
</template>

<script>
import { onMounted } from "vue";
import { GridHelper, MeshPhongMaterial, PlaneGeometry , Mesh } from "three";
import * as THREE from 'three'
import View from "../js/main";
import {drawLine,drawBox,drawCylinder} from '../js/LineGeometry'
export default {
  setup() {
    const mesh = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    const grid = new GridHelper(100, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    
    onMounted(() => {
      window.view = new View("#webgl", this);
      const axesHelper = new THREE.AxesHelper( 50 );
      let scene = window.view.scene;
      // loadModel()
      const map = new THREE.TextureLoader().load( "/building.png" );
      const material = new THREE.SpriteMaterial( { map: map } );

      const sprite = new THREE.Sprite( material );
      let tube = drawLine()
      let box = drawBox()
      let Cylinder = drawCylinder()
      box .position.set(0,0,20)
      Cylinder.position.set(10,0,10)
      // scene.add(tube)
      console.log(sprite)
      scene.add( sprite );
      scene.add( axesHelper );
      // scene.add(box)
      // scene.add(Cylinder)
      // window.view.loader('model.glb')
      const click = (event)=>{
            // let ray =  window.view.getRaycasters(event,view.scene.children)
            // console.log(ray)
          }
      window.addEventListener('click',click(),false)
    });
    return{
    }
  },
};
</script>

<style lang="stylus">
#webgl {
  width: 100%;
  height: 100%;
}
.button{
  position: absolute;
  left :0px;
  top :0px;
}
</style>