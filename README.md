# Xing-Gis
2D地图基础功能Demo,3D地图基础功能Demo

# 大致功能
点,线,多边形,扇形,圆,自定义图形 等静态图形 上图
主体要素(功能较为复杂的点,线) 上图
交互,提供手动绘制功能1静态图的能力（并提供响应式交互能力）
热力图
测量
图层的响应式交互能力
实时,历史模式的相关能力
提供单闪烁动画能力
事件与实例的封装
多瓦片地图的切换能力 
2D地图 提供底层地图的切换能力
不同地图使用不同地图的Icon

# 封装逻辑
顶层控制器                  const MapController = createMapController('baidu')
顶层逻辑控制器               const PointerController = MapController.createPointController('图层名')
业务控制器                  const somePoint = PointerController.create({id:'',name:'',coordinate:[]})
实体的实现                     new Point()