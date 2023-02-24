import BaiduMapController from '@/2D/Map/BaiduMap/controller'
import OpenlayersController from '@/2D/Map/OpenlayersMap/controller'

/**
 * 地图类型与控制器注册
 */

const MapRegister: Record<MapType, any> = {
    'baidu': BaiduMapController,
    'openlayers': OpenlayersController
}

export default MapRegister