/** 
 * 地图控制器 约束类
 * 所有的地图控制器都应该实现以下方法
 */
export default abstract class MapControllerConstraint {
    /** 返回地图实例 */
    public abstract getInstace: () => any
    /** 初始化地图,所有的地图初始化工作应该都在此函数中完成! */
    protected abstract initMap: (container: HTMLElement, center: [number, number], zoom: number) => void
    /** 销毁 */
    public abstract destory: Function
    /** 定位 */
    public abstract flayTo: (center: [number, number], zoom: number) => any


    /** 点 */
    public abstract createPoint: Function
    /** 交互点 */
    public abstract drawPoint: Function
    /** 点集 */
    public abstract createPointGather: Function

    /** 线 */
    public abstract createLine: Function
    /** 交互线 */
    public abstract drawLine: Function
    /** 线集 */
    public abstract createLineGather: Function

    /** 多边形 */
    public abstract createPolygon: Function
    /** 交互多边形 */
    public abstract drawPolygon: Function
    /** 多边形集 */
    public abstract createPolygonGather: Function

    /** 圆 */
    public abstract createCircle: Function
    /** 交互多边形 */
    public abstract drawCircle: Function
    /** 圆集 */
    public abstract createCircleGather: Function

    /** 扇形 */
    public abstract createSector: Function
    /** 交互多扇形 */
    public abstract drawSector: Function
    /** 扇形集 */
    public abstract createSectorGather: Function

    /** 矩形 */
    public abstract createRectangle: Function
    /** 交互矩形 */
    public abstract drawRectangle: Function
    /** 矩形集 */
    public abstract createRectangleGather: Function

}
