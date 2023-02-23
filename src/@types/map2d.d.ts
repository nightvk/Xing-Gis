/** 2D 地图的类型 */
type MapType = 'baidu' | 'openlayers'


/** 几何图形的操作类型 */
interface GeoAction {
    create: Function
    createGather: Function
    draw: {
        start: Function
        end: Function
        change: Function
    }
}
