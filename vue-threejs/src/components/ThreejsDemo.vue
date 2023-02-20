<template>
    <div>
        <canvas ref="ThreejsCanvas"></canvas>
    </div>
</template>

<script>
//导入threejs
import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' 
import Stats from 'three/examples/jsm/libs/stats.module'
import floor from '../assets/floor.jpg'

export default {
    data(){
        return {
            scene : null, //场景
            camera: null, //相机
            cameraParams:{     //相机参数
                fov: 45,   //摄像机视锥体垂直视野角度
                aspect: 2, //摄像机视锥体长宽比
                near: 0.1,  //摄像机视锥体长宽比
                far: 10000  //摄像机视锥体远端面
            },
            renderer:null,
            canvas: null,
            canvasW: 0,
            canvasH: 0,
            controls: null,
            floor: null, //场景内的物体
            stats: null, //性能显示插件
        }
    },
    created(){
        this.canvasW = window.innerWidth
        this.canvasH = window.innerHeight
        this.cameraParams.aspect = this.canvasW / this.canvasH
    },
    mounted(){
        this.initStats()
        this.start()
        this.render()
    },
    methods:{
        start(){
            this.initScene()
            this.initCamera()
            this.initRenderer()
            this.initControls()
            this.initContent()
        },  
        initScene(){
            this.scene = new THREE.Scene({background:new THREE.Color( 0xff0000 )})
            this.scene.background = new THREE.Color( 0xff0000 )
        },
        initCamera(){
            const cP = this.cameraParams
            //透视相机，正交相机
            this.camera = new THREE.PerspectiveCamera(cP.fov, cP.aspect, cP.near, cP.far)
            this.camera.position.set(0,800,1500) //x,y,z坐标
            this.camera.lookAt(new THREE.Vector3(0,0,0))
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
            this.renderer.setSize(this.canvasW, this.canvasH)
        },
        initControls(){
            this.controls = new OrbitControls(this.camera, this.canvas)
            this.controls.enableDamping = true
            this.controls.dampingFactor = 0.5
            this.controls.minDistance = 100
            this.controls.maxDistance = 5000
            this.controls.maxPolarAngle = Math.PI/2.2
        },
        // 初始化性能插件
        initStats() {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);
        },
        createFloor(){
            let loader = new THREE.TextureLoader();
            loader.load(floor,(texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 10, 10 );
                const geometry = new THREE.BoxGeometry( 2600,1000,1 );
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
                this.floor = new THREE.Mesh(geometry, material)
                this.floor.position = new THREE.Vector3(0,-0.5, 0);
                this.floor.rotateX(Math.PI/2)
                this.floor.name = '地板'
                this.scene.add(this.floor)
            })
        },    
        initContent(){
            this.createFloor()
        },
        update() {
            this.stats.update();
            this.controls.update();
        },
        render(){
            requestAnimationFrame(this.render.bind(this))
            this.renderer.render(this.scene, this.camera)
            this.update()
        },
    },
}
</script>

<style>

</style>