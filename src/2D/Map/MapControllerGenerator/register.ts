import BaiduMapController from '../MapRealizeClass/BaiduMap/controller'
import OpenlayersController from '../MapRealizeClass/OpenlayersMap/controller'
import type { MapType } from './constant'



/**
 * 地图类型与控制器注册
 */

const MapRegister: Record<MapType, any> = {
    'baidu': BaiduMapController,
    'openlayers': OpenlayersController
}

export default MapRegister