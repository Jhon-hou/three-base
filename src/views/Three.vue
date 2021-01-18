<template>
  <div class="home">
    <div class="webgl" id="webgl"></div>
    <div class="box">
       <el-radio-group v-model="onTool">
        <el-radio-button label="box">立方体 </el-radio-button>
        <el-radio-button label="Cylinder">管道</el-radio-button>
        <el-radio-button label="tube">圆柱</el-radio-button>
        <el-radio-button label="xz">心脏</el-radio-button>
       </el-radio-group>
    </div>
  </div>
</template>

<script>
import { onMounted, watch , ref} from "vue";
import { GridHelper, MeshPhongMaterial, PlaneGeometry , Mesh, Group } from "three";
import * as THREE from 'three'
import View from "../js/main";
import {drawLine,drawBox,drawCylinder} from '../js/LineGeometry'
export default {
  setup() {
    let scene =null
    let group = new Group()
    const mesh = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    const grid = new GridHelper(100, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    let onTool = ref('')
    watch(onTool,(val)=>{
        console.log('val',val)
        tabFeature()
    })
    const tabFeature=()=>{
      switch(onTool.value){
          case 'box':
          removeAll()
          let box = drawBox()
          box .position.set(0,0,20)
          group.add(box)
          break;
          case 'Cylinder':
          removeAll()
          let Cylinder = drawCylinder()
          Cylinder.position.set(10,0,10)    
          group.add(Cylinder)
          break;
          case 'tube':
          removeAll()
          let tube = drawLine()
          group.add(tube)
          break;
          case 'xz':
          removeAll()
          let xz = window.view.loader('xz.glb')
          break;
      }
    }
    const removeAll=()=>{
      if(group.children.length>0){
          group.children.map(m=>{group.remove(m)})
      }
    }
    onMounted(() => {
      window.view = new View("#webgl", this);
      const axesHelper = new THREE.AxesHelper( 50 );
       scene = window.view.scene;
      scene.add( axesHelper );
      scene.add(group)  
      window.addEventListener('click',(event)=>{
        let ray =  window.view.getRaycasters(event,view.scene.children)
        console.log('ray',ray)
      },false)
    });
    return{
      scene,onTool,group
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
.box{
 position: fixed;
      top: .5em;
      right: .5em;
}
</style>