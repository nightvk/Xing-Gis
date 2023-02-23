import { Feature } from "ol"
import { Geometry } from "ol/geom"

/** 2D 地图构造器的约束 */
export abstract class MapControllerConstraint {
    /** 工具集 */
    public abstract Tool: MapToolConstraint
    /** 点的相关操作 */
    public abstract Point: GeoAction

    public abstract instance: MapInstanceConstraint
}
/** 2D 地图实例 约束 */
export abstract class MapInstanceConstraint {
}

/** 2D 地图 工具集 的约束 */
export abstract class MapToolConstraint {
    /** 创建地图 */
    public abstract create: Function
    /** 销毁地图 */
    public abstract destroy: Function

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


/** 几何图形集合体的约束 */
export abstract class GeoGatherConstraint {
    /** 绘制 (新增 + 修改) */
    public abstract draw: Function
    /** 删除*/
    public abstract remove: Function
    /** 找值 */
    public abstract find: Function
    /** 显示 */
    public abstract show: Function
    /** 隐藏 */
    public abstract hidden: Function
    /** 激活  */
    public abstract active: Function
    /** 清空 */
    public abstract clear: Function
    /** 获取所有点 */
    public abstract getList: () => any[]
}

/** 几何图形单体的约束 */
export abstract class GeoConstraint {
    public abstract id: string | number
    public abstract name: string
    public abstract coordinate: [number, number]
    public abstract feature: Feature<Geometry>

    /** 更新 */
    public abstract update: Function
    /** 删除 */
    public abstract remove: Function
    /** 激活 */
    public abstract active: Function
    /** 显示 */
    public abstract show: Function
    /** 隐藏 */
    public abstract hidden: Function
}

/** 交互绘制生成几何图形的约束 */
export abstract class GeoDrawConstraint {
    /** 绘制上图 */
    public abstract drawStart: Function
    /** 绘制结束 */
    public abstract drawEnd: Function
    /** 中途更改 */
    public abstract drawChange: Function
}


