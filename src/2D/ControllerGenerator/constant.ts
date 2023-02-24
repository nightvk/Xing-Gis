import BaiduMapController from '../Map/BaiduMap/controller'
import OpenlayersController from '../Map/OpenlayersMap/controller'


export const DEFAULT_MAP_CENTER = [0, 0] as [number, number]
export const DEFAULT_MAP_ZOOM = 8


export type MapControllerRes<T> =
    T extends 'baidu' ? BaiduMapController :
    T extends 'openlayers' ? OpenlayersController :
    never