/**
 * 存放仓库显示模型
 */
import * as THREE from 'three'
const planePNG = require('../assets/plane.png') 
import FZYaotiFont from '../assets/FZYaoTi_Regular.json'

//货区材质信息
var planeMaterial
var planeList = []

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

export function createShelf(shelfConfig,scene){
    let planeGeometry = new THREE.BoxGeometry(shelfConfig.planeWidth,shelfConfig.planeDepth,shelfConfig.planeHeight)
    let planeRackMat = new THREE.MeshBasicMaterial()
    new THREE.TextureLoader().load(shelfConfig.planeTexture,(texture) => {
        planeRackMat.map = texture
        planeRackMat.transparent = true
        planeRackMat.opacity = 0.8
        planeRackMat.needsUpdate = true
    })
    for(let i = 0; i < shelfConfig.layersNum; i++){
        let plane = new THREE.Mesh(planeGeometry,planeRackMat)
        plane.position.set(shelfConfig.positionX,(shelfConfig.legDepth-shelfConfig.legDepth*i/shelfConfig.layersNum)-shelfConfig.planeDepth/2 + shelfConfig.positionY,shelfConfig.positionZ)
        plane.name = '库区1号' + '$' + '货架A1' + '-' + (shelfConfig.layersNum-i) + '层' //货架每层设置名称
        let planeObj = {name:plane.name, obj:plane}
        planeList.push(planeObj)
        scene.add(plane)
    }
    let legMaterial = new THREE.MeshBasicMaterial({color:0x1C86EE})
    let leg = new THREE.BoxGeometry(shelfConfig.legWidth,shelfConfig.legDepth,shelfConfig.legHeight)
    let leg1 = new THREE.Mesh(leg,legMaterial)
    let leg2 = new THREE.Mesh(leg,legMaterial)
    let leg3 = new THREE.Mesh(leg,legMaterial)
    let leg4 = new THREE.Mesh(leg,legMaterial)
    leg1.position.set(shelfConfig.positionX+(shelfConfig.planeWidth-shelfConfig.legWidth)/2, shelfConfig.legDepth/2 + shelfConfig.positionY, shelfConfig.positionZ+(shelfConfig.planeHeight-shelfConfig.legHeight)/2)
    leg2.position.set(shelfConfig.positionX+(shelfConfig.planeWidth-shelfConfig.legWidth)/2, shelfConfig.legDepth/2 + shelfConfig.positionY, shelfConfig.positionZ-(shelfConfig.planeHeight-shelfConfig.legHeight)/2)
    leg3.position.set(shelfConfig.positionX-(shelfConfig.planeWidth-shelfConfig.legWidth)/2, shelfConfig.legDepth/2 + shelfConfig.positionY, shelfConfig.positionZ-(shelfConfig.planeHeight-shelfConfig.legHeight)/2)
    leg4.position.set(shelfConfig.positionX-(shelfConfig.planeWidth-shelfConfig.legWidth)/2, shelfConfig.legDepth/2 + shelfConfig.positionY, shelfConfig.positionZ+(shelfConfig.planeHeight-shelfConfig.legHeight)/2)
    // scene.add(plane)
    scene.add(leg1)
    scene.add(leg2)
    scene.add(leg3)
    scene.add(leg4)
}
function createCargo(x,y,z,boxCargo) {
    let geometry = new THREE.BoxGeometry( boxCargo.width,boxCargo.height,boxCargo.depth);
    let cargoMaterial = new THREE.MeshBasicMaterial()
    new THREE.TextureLoader().load(boxCargo.texture,(texture) => {
        cargoMaterial.map = texture
        cargoMaterial.needsUpdate = true;
    })
    let obj = new THREE.Mesh( geometry, cargoMaterial );
    obj.position.set(x,y,z);
    obj.name = boxCargo.name;
    return obj
}

export function addCargo(shelfConfig,boxCargo){
    let x = shelfConfig.positionX;
    let y = shelfConfig.positionY + boxCargo.depth/2 + shelfConfig.legDepth*boxCargo.layer/shelfConfig.layersNum;
    let z = shelfConfig.positionZ;
    let box = createCargo(x,y,z,boxCargo)
    return box
}
