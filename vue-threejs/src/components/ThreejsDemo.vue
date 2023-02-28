<template>
    <div>
        <canvas ref="ThreejsCanvas"></canvas>
    </div>
</template>

<script>
//导入threejs
import * as THREE from 'three'
//导入轨道控制器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer' //效果合成器（EffectComposer）
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'          // 抗锯齿 为了覆盖到原理来的场景上
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'   // 场景通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass' //物体边缘发光通道 物体边界线条高亮处理
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'   // 自定义着色器通道（ShaderPass）
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import Stats from 'three/examples/jsm/libs/stats.module'
import '../utils/ThreeJs_Composer'
import {initMaterial,addArea, createShelf} from '../utils/Modules'
import TWEEN, { Tween } from 'tween.js'
// ThreeBSP库
const ThreeBSP = require('three-js-csg')(THREE)
// 场景贴图
import floorPic from '../assets/floor.jpg'
import doorLeftPic from '../assets/door_left.png'
import doorRightPic from '../assets/door_right.png'
import windowPic from '../assets/window.png'

const materialCom = new THREE.MeshPhongMaterial({color: 0xafc0ca})
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
            directionalLight: null, // 灯光
            ambient: null, //环境光
            composer: null, // 合成器
            tween: null
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
            this.initLight()
            this.initControls()
            this.initContent()
        },  
        initScene(){
            this.scene = new THREE.Scene()
        },
        initCamera(){
            const cP = this.cameraParams
            //透视相机，正交相机
            this.camera = new THREE.PerspectiveCamera(cP.fov, cP.aspect, cP.near, cP.far)
            this.camera.position.set(0,800,1500) //x,y,z坐标
            this.camera.lookAt(new THREE.Vector3(0,0,0))
            this.scene.add(this.camera)
        },
        initLight(){
            this.directionalLight = new THREE.DirectionalLight(0xfff211, 0.5)
            this.directionalLight.color.setHSL(1, 1, 1)
            this.directionalLight.position = new THREE.Vector3(0, 200, 0)
            this.scene.add(this.directionalLight)

            this.ambient = new THREE.AmbientLight( 0xffffff, 1 )
            this.ambient.positio = new THREE.Vector3(0, 0, 0)
            this.scene.add(this.ambient)
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
        // 创建一个地板模型
        createFloor(){
            let loader = new THREE.TextureLoader(); 
            loader.load(floorPic,(texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 10, 10 );
                const geometry = new THREE.BoxGeometry(2600, 1000, 1);
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
                this.floor = new THREE.Mesh(geometry, material)
                this.floor.position = new THREE.Vector3(0,0, 0);
                this.floor.rotateX(Math.PI/2)
                this.floor.name = '地板'
                this.scene.add(this.floor)
            })
        },
        createCubeWall(width, height, depth, angle, material, x, y, z, name ){
            let cubeGeometry = new THREE.BoxGeometry(width, height, depth)
            let cube = new THREE.Mesh(cubeGeometry, material)
            cube.position.x = x
            cube.position.y = y
            cube.position.z = z
            cube.rotation.y += angle*Math.PI/2
            cube.name = name
            this.scene.add(cube)
        },
        createCubeObj(width, height, depth, angle, material, x, y, z, name){
            let cubeGeometry = new THREE.BoxGeometry(width, height, depth)
            let cube = new THREE.Mesh(cubeGeometry, material)
            cube.position.x = x
            cube.position.y = y
            cube.position.z = z
            cube.rotation.y += angle*Math.PI/2
            cube.name = name
            return cube
        },
        createBSP(source, placeholders){
            let sourceBSP = new ThreeBSP(source)
            for(var i = 0; i < placeholders.length; i++){
                var less_bsp = new ThreeBSP(placeholders[i]);
                sourceBSP = sourceBSP.subtract(less_bsp);
            }
            let material = new THREE.MeshPhongMaterial({color:0x9cb2d1});
            let result = sourceBSP.toMesh(material)
            result.material.flatshading = THREE.FlatShading;
            result.geometry.computeFaceNormals();  //重新计算几何体侧面法向量
            result.geometry.computeVertexNormals();
            result.material.needsUpdate = true;  //更新纹理
            result.geometry.buffersNeedUpdate = true;
            result.geometry.uvsNeedUpdate = true;
            this.scene.add(result)
        },
        createWallWithPlaceholders(){
            let wall = this.createCubeObj(2580, 100, 10, 0, materialCom, 0, 50, 495, "南墙面")
            let placeholders = []
            let doorCube1 = this.createCubeObj(100, 80, 10, 0, materialCom, -400, 40, 495, "前门1")
            let doorCube2 = this.createCubeObj(100, 80, 10, 0, materialCom, 400, 40, 495, "前门2")
            let windowCube1 = this.createCubeObj(40, 40, 10, 0,materialCom, -900, 60, 495, "窗户1");
            let windowCube2 = this.createCubeObj(40, 40, 10, 0,materialCom, 900,  60, 495, "窗户2");
            let windowCube3 = this.createCubeObj(40, 40, 10, 0,materialCom, -200, 60, 495, "窗户3");
            let windowCube4 = this.createCubeObj(40, 40, 10, 0,materialCom, 200,  60, 495, "窗户4");
            placeholders.push(doorCube1)
            placeholders.push(doorCube2)
            placeholders.push(windowCube1)
            placeholders.push(windowCube2)
            placeholders.push(windowCube3)
            placeholders.push(windowCube4)
            this.createBSP(wall, placeholders)
        },
        //创建大门左扇门模型
        createDoorLeft(width, height, depth, angle, x, y, z, name){
            let loader = new THREE.TextureLoader() //创建一个纹理加载器
            loader.load(doorLeftPic,(texture) => { //纹理贴图，和调用函数
                let doorGeometry = new THREE.BoxGeometry(width,height,depth)
                doorGeometry.translate(25,0,0) 
                let doorMaterial = new THREE.MeshBasicMaterial({map: texture,color:0xffffff})
                doorMaterial.opacity = 1
                doorMaterial.transparent = true  //透明
                let door = new THREE.Mesh(doorGeometry,doorMaterial)
                door.position.set(x,y,z)
                door.rotation.y += angle*Math.PI
                door.name = name
                this.scene.add(door)
            })
        },
        //创建大门右扇门模型
        createDoorRight(width, height, depth, angle, x, y, z, name){
            let loader = new THREE.TextureLoader() //创建一个纹理加载器
            loader.load(doorRightPic,(texture) => { //纹理贴图，和调用函数
                let doorGeometry = new THREE.BoxGeometry(width,height,depth)
                doorGeometry.translate(-25,0,0) 
                let doorMaterial = new THREE.MeshBasicMaterial({map: texture,color:0xffffff})
                doorMaterial.opacity = 1
                doorMaterial.transparent = true
                let door = new THREE.Mesh(doorGeometry,doorMaterial)
                door.position.set(x,y,z)
                door.rotation.y += angle*Math.PI
                door.name = name
                this.scene.add(door)
            })
        },
        //创建窗户模型
        createWindow(width, height, depth, angle, x, y, z, name){
            let loader = new THREE.TextureLoader()
            loader.load(windowPic,(texture) => {
                let windowGeometry = new THREE.BoxGeometry(width, height, depth)
                let windowMaeterial = new THREE.MeshBasicMaterial({map: texture})
                windowMaeterial.opacity = 1
                windowMaeterial.transparent = true
                let windowMesh = new THREE.Mesh( windowGeometry,windowMaeterial);
                windowMesh.position.set(x, y, z);
                windowMesh.rotation.y += angle*Math.PI;  //-逆时针旋转,+顺时针
                windowMesh.name = name;
                this.scene.add(windowMesh);
            })
        },
        // 加载所有模型
        initContent(){
            this.createFloor()
            this.createCubeWall(10, 100, 1000, 0, materialCom, -1295, 50, 0, "西墙面")
            this.createCubeWall(2580, 100, 10, 0, materialCom, 0, 50, -495, "北墙面")
            this.createCubeWall(10, 100, 1000, 0, materialCom, 1295, 50, 0, "东墙面")
            this.createWallWithPlaceholders()
            this.createDoorLeft(50,80,1,0,-450, 40, 495,"左门1")
            this.createDoorRight(50,80,1,0,-350, 40, 495,"右门1")
            this.createDoorLeft(50,80,10,0,350, 40, 495,"左门2")
            this.createDoorRight(50,80,10,0,450, 40, 495,"右门2")
            this.createWindow(40, 40, 10, 0, -900, 60, 495, "窗户1")
            this.createWindow(40, 40, 10, 0, 900,  60, 495, "窗户2")
            this.createWindow(40, 40, 10, 0, -200, 60, 495, "窗户3")
            this.createWindow(40, 40, 10, 0, 200,  60, 495, "窗户4")
            initMaterial()
            addArea(0,0,500,500,this.scene,"ID1$库区1号","FF0000",20,"左对齐"); //添加库区
            createShelf(this.scene)
            this.composer = new THREE.ThreeJs_Composer(this.renderer,this.scene,this.camera)
        },
        // 刷新组件
        update() {
            this.stats.update();
            this.controls.update();
            TWEEN.update()
        },
        // 渲染
        render(){
            requestAnimationFrame(this.render.bind(this))
            this.renderer.render(this.scene, this.camera)
            this.composer.render()
            this.update()
        },
    },
}
</script>

<style>

</style>