import BaiduMapController from '../MapRealizeClass/BaiduMap/controller'
import OpenlayersController from '../MapRealizeClass/OpenlayersMap/controller'


export const DEFAULT_MAP_CENTER = [0, 0] as [number, number]
export const DEFAULT_MAP_ZOOM = 8





/** 注册地图类型 */
export type MapType = 'baidu' | 'openlayers' 


export type MapControllerRes<T> =
    T extends 'baidu' ? BaiduMapController :
    T extends 'openlayers' ? OpenlayersController :
    never