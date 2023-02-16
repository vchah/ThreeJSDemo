<template>
    <div>
        <!-- <h3>ThreejsDemo</h3> -->
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
            scene : null,     //场景
            camera: null,     //相机
            cameraParams:{    //相机参数
                fov: 45,       // 摄像机视锥体垂直视野角度
                aspect: 2,     // 摄像机视锥体长宽比
                near: 10,      // 摄像机视锥体近端面
                far: 200      // 摄像机视锥体远端面
            },
            renderer:null,    // 渲染器
            canvas: null,     // 画布
            canvasW: 0,       // 画布宽度
            canvasH: 0,       // 画布长度
            controls: null,   // 轨道控制器
            axesHelper: null, //坐标轴辅助器
            cube: null,       // 一个立方体
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
            this.initFog()
            this.initAxesHelper()
            this.createCube()
            this.render()
        },
        // 初始化场景
        initScene(){
            this.scene = new THREE.Scene({background:new THREE.Color( 0xffff00 )})
            this.scene.background = new THREE.Color( 0x000000 )
        },
        // 初始化相机
        initCamera(){
            const cP = this.cameraParams
            //透视相机，正交相机
            this.camera = new THREE.PerspectiveCamera(cP.fov, cP.aspect, cP.near, cP.far)
            this.camera = new THREE.CubeCamera()
            this.camera.position.set(0,0,30) //x,y,z坐标
            this.camera.lookAt(new THREE.Vector3(0,0,0)) //相机看向的坐标，必须是Vector类型
            this.scene.add(this.camera)
        },
        // 初始化渲染器
        initRenderer(){
            this.canvas = this.$refs.ThreejsCanvas
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true, //是否可以设置背景色透明。
                logarithmicDepthBuffer: true //模型的重叠部位便不停的闪烁起来。这便是Z-Fighting问题，为解决这个问题，我们可以采用该种方法
            })
            this.renderer.setSize(this.canvasW, this.canvasH)
        },
        // 初始化轨道控制器
        initControls(){
            this.controls = new OrbitControls(this.camera, this.canvas)
        },
        // 初始化雾
        initFog(){
            const fog = new THREE.Fog('skyblue',10,200)
            this.scene.fog = fog
        },
        // 初始化坐标轴辅助器，并添加到场景中
        initAxesHelper(){
            this.axesHelper = new THREE.AxesHelper()
            this.scene.add(this.axesHelper)
        },
        // 创建物体并添加到场景
        createCube(){
            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial({color: 0xffffff})
            this.cube = new THREE.Mesh(geometry, material)
            this.scene.add(this.cube)
        }, 
        // 进行渲染 绑定帧刷新方法     
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