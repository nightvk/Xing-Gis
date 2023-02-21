/** 
 * 地图工具 约束类
 * 所有的地图工具都应该实现以下方法
 */
export default abstract class MapToolConstraint {
    /** 创建地图 */
    public abstract create: Function
    /** 销毁地图 */
    public abstract destory: Function
    /** 销毁Icon */
    public abstract changeIcon: Function
    /** 获取实例,建议所有获取地图实例都走此属性,以便于拦截 */
    public abstract get: () => any
    /** 移动地图 */
    public abstract flayTo: (center: [number, number], zoom: number) => void
    /** 设置地图网格线 */
    public abstract setGrid: (show: boolean) => void
    /** 设置鼠标经纬度 */
    public abstract setMousePos: (show: boolean) => void
    /** 设置地图缩略图 */
    public abstract setOverviewMap: (show: boolean) => void
    /** 设置地图比例尺 */
    public abstract setScaleLine: (show: boolean) => void
}