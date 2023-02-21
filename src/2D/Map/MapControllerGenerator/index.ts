import Utils from '@/Utils'
import { DEFAULT_MAP_ZOOM, DEFAULT_MAP_CENTER } from './constant'
import MapRegister from './register'

import type { MapType, MapControllerRes } from './constant'
import type MapControllerConstraint from '../MapConstraintClass/MapControllerConstraint'

/**
 * 地图控制器生成器
 */
export default abstract class MapControllerGenerator {
    public static MapController: MapControllerConstraint
    /**
     * 
     * @param type 地图类型 MapType
     * @param container 地图容器 HTMLElement
     * @param center 中心点 [number,number]
     * @param zoom 层级 number
     * @returns 地图控制器
     */
    static createMapController = <T extends MapType>(
        type: T,
        container: HTMLElement,
        center = DEFAULT_MAP_CENTER,
        zoom = DEFAULT_MAP_ZOOM
    ) => {
        if (Utils.isExist(MapRegister[type])) {
            const MapController = MapRegister[type]
            this.MapController = MapController
            return new MapController(container, center, zoom) as MapControllerRes<T>
        }
        else {
            let message = `
                    类型 ${type} 地图未实现!!!
                    请参考 MapControllerEntityClass 目录下各文件夹实现 ${type}Controller,
                    并在 MapControllerGenerator 目录 register.ts 中注册${type}类型地图 
            `
            console.error(message)
            throw new Error(message);
        }
    }

    static change = <T extends MapType>(type: T) => {

    }

}



