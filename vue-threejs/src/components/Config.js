export const shelfConfig = {
    planeWidth: 80, //货架面板x轴方向宽度
    planeHeight: 60,//货架面板z轴方向长度
    planeDepth: 3,  //货架面板y轴方向厚度
    planeTexture: require('../assets/rack.png'), //货架面板材质
    legWidth:5,     //货架支腿x轴方向宽度
    legHeight:5,    //货架支腿z轴方向长度
    legDepth:100,    //货架支腿y轴方向高度
    positionX:0,   // x轴坐标
    positionY:0,    // y轴坐标
    positionZ:0,   // z轴坐标
    layersNum:4,    // 货架层数
    columnNum:2,    //每层货架可放置货物的数量
}
export const boxCargo = {
    name: 'box1',
    width: 20,
    height:20,
    depth: 20,
    texture: require('../assets/box.png'),
    layer:4,
}