<template>
    <div>
        <h3>ThreejsDemo</h3>
        <canvas ref="ThreejsCanvas"></canvas>
    </div>
</template>

<script>
//导入threejs
import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' 

export default {
    data(){
        return {
            scene : null, //场景
            camera: null, //相机
            cameraParams:{     //相机参数
                fov: 30,   //摄像机视锥体垂直视野角度
                aspect: 2, //摄像机视锥体长宽比
                near: .1,  //摄像机视锥体长宽比
                far: 200   //摄像机视锥体远端面
            },
            renderer:null,
            canvas: null,
            canvasW: 0,
            canvasH: 0,
            controls: null,
            cube: null, //场景内的物体
        }
    },
    created(){
        this.canvasW = window.innerWidth
        this.canvasH = window.innerHeight
        this.cameraParams.aspect = this.canvasW / this.canvasH
    },
    mounted(){
        this.start()
    },
    methods:{
        start(){
            this.initScene()
            this.initCamera()
            this.initRenderer()
            this.initControls()
            this.createCube()
            this.render()
        },  
        initScene(){
            this.scene = new THREE.Scene({background:new THREE.Color( 0xff0000 )})
            this.scene.background = new THREE.Color( 0xff0000 )
            const fog = new THREE.Fog('skyblue',0.2,0.3)
            this.scene.fog = fog
        },
        initCamera(){
            const cP = this.cameraParams
            //透视相机，正交相机
            this.camera = new THREE.PerspectiveCamera(cP.fov, cP.aspect, cP.near, cP.far)
            this.camera.position.set(0,0,30) //x,y,z坐标
            this.scene.add(this.camera)
        },
        initRenderer(){
            this.canvas = this.$refs.ThreejsCanvas
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true,//是否可以设置背景色透明。
                logarithmicDepthBuffer: true//模型的重叠部位便不停的闪烁起来。这便是Z-Fighting问题，为解决这个问题，我们可以采用该种方法
            })
            this.renderer.setSize(300, 300)
        },
        initControls(){
            this.controls = new OrbitControls(this.camera, this.canvas)
        },
        createCube(){
            const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
            const material = new THREE.MeshBasicMaterial({color: 0xffff00})
            this.cube = new THREE.Mesh(geometry, material)
            this.scene.add(this.cube)
        },      
        render(){
            this.cube.rotation.x += 0.01
            this.cube.rotation.y += 0.01 
            this.renderer.render(this.scene, this.camera)
            // this.controls.update()
            requestAnimationFrame(this.render.bind(this))
        }
    },
}
</script>

<style>

</style>