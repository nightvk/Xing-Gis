import Utils from "../Utils"

export type MapType = 'baidu' | 'openlayers'

export type MapControllerRes<T> =
    T extends 'baidu' ? BaiduMapController :
    T extends 'openlayers' ? OpenlayersController :
    never

const DEFAULT_MAP_CENTER = [0, 0] as [number, number]
const DEFAULT_MAP_ZOOM = 8


/**
 * 地图控制器生成器
 */
export default abstract class MapControllerGenerator {

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


        if (type === 'baidu') return new BaiduMapController(container, center, zoom) as MapControllerRes<T>
        if (type === 'openlayers') return new OpenlayersController(container, center, zoom) as MapControllerRes<T>
        else {
            let message = `
                    类型 ${type} 地图未实现!!!
                    请实现 class ${type}Controller extends MapControllerConstraint {},
                    并在 MapControllerGenerator 中 注册${type}类型地图 
            `
            console.error(message)
            throw new Error(message);
        }
    }

}




/** 
 * 地图控制器 约束类
 * 所有的地图控制器都应该实现以下方法
 */
abstract class MapControllerConstraint {
    /** 返回地图实例 */
    public abstract getInstace: () => any
    /** 初始化地图,所有的地图初始化工作应该都在此函数中完成! */
    protected abstract initMap: (container: HTMLElement, center: [number, number], zoom: number) => void
    /** 销毁 */
    public abstract destory: () => any
    /** 定位 */
    public abstract flayTo: (center: [number, number], zoom: number) => any
}


class BaiduMap {

}

class BaiduMapController extends MapControllerConstraint {
    protected instance!: BaiduMap
    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.initMap(container, center, zoom);
    }

    protected initMap = (container: HTMLElement, center: [number, number], zoom: number) => {

        window.MapController = this
    }

    public getInstace = () => {
        return this.instance
    }

    public flayTo = (center: [number, number], zoom: number) => { }

    public destory = () => { }
}


class OpenlayersMap {

}

class OpenlayersController extends MapControllerConstraint {
    protected instance!: OpenlayersMap

    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.initMap(container, center, zoom);
    }

    /** 初始化 */
    protected initMap = (container: HTMLElement, center: [number, number], zoom: number) => {

        window.MapController = this
    }
    public getInstace = () => {
        return this.instance
    }

    public flayTo = (center: [number, number], zoom: number) => {

    }

    public destory = () => {
        window.MapController = null
    }

}

/**                                        使用 */

const MapController = MapControllerGenerator.createMapController('baidu', document.getElementById('2D')!)


const map = MapController.getInstace()