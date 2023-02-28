/**
 * 存放仓库显示模型
 */
import * as THREE from 'three'
const planePNG = require('../assets/plane.png') 
import FZYaotiFont from '../assets/FZYaoTi_Regular.json'

//货区材质信息
var planeMaterial

export function initMaterial() {
    planeMaterial = new THREE.MeshLambertMaterial()
    new THREE.TextureLoader().load(planePNG,(texture) => {
        planeMaterial.map = texture
        planeMaterial.transparent = true
        planeMaterial.opacity = 0.8
        planeMaterial.needsUpdate = true
    })
}

// 库区goods area   
export function addArea(x,z,width,length,scene,name,textColor,fontSize,textPosition){
    var goodsAreaGeometry = new THREE.PlaneGeometry(width, length)
    var goodsArea = new THREE.Mesh(goodsAreaGeometry,planeMaterial)
    goodsArea.position.set(x, 1.5,z)
    goodsArea.rotation.x = -Math.PI/2.0
    goodsArea.name = "库区"+"$"+name.split("$")[1];
    scene.add(goodsArea)
    //加入立体文字
    var text = new THREE.TextGeometry(name.split("$")[1], {
        font:new THREE.FontLoader().parse(FZYaotiFont), //字体
        size:fontSize, //字号
        height:0.1, //厚度
    })
    text.computeBoundingBox()
    // new THREE.FontLoader().parse(FZYaotiFont).load(url(),(font) => {
    //     console.log(font)
    //     text = new THREE.TextGeometry(name.split("$")[1], {
    //         font:font, //字体
    //         size:fontSize, //字号
    //         height:0.1, //厚度
    //     })
    // })
    var m = new THREE.MeshStandardMaterial({color:"#" + textColor})
    var mesh = new THREE.Mesh(text,m)
        if(textPosition == "左对齐"){
            mesh.position.x = x - width/2 + 10;
        }else if(textPosition == "居中"){
            mesh.position.x = x - 15;
        }else if(textPosition == "右对齐"){
            mesh.position.x = x + width/2 - 60;
        }
        mesh.position.y = 1.3;
        mesh.position.z = z + length/2 - 20;
        mesh.rotation.x = -Math.PI / 2.0;
        scene.add(mesh);
}

const shelfConfig = {
    panelWidth: 80,
    panelHeight: 60,
    panelDepth: 10,
    panelTexture: require('../assets/rack.png'),
    legWidth:10,
    legDepth:10,
    legHeight:120,
}
export function createShelf(scene){
    var planeGeometry = new THREE.BoxGeometry(shelfConfig.panelWidth,shelfConfig.panelDepth,shelfConfig.panelHeight)
    var planeRackMat = new THREE.MeshBasicMaterial()
    new THREE.TextureLoader().load(shelfConfig.panelTexture,(texture) => {
        planeRackMat.map = texture
        planeRackMat.transparent = true
        planeRackMat.opacity = 0.8
        planeRackMat.needsUpdate = true
    })
    var obj = new THREE.Mesh(planeGeometry,planeRackMat)
    scene.add(obj)
}