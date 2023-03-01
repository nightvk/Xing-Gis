import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry, LineString } from 'ol/geom'

/** 事件回调类型 */
export type GeometryEventType = Function | {
    /** 弹窗面板的类名 */
    className?: string
    /** 弹出弹窗回调 */
    callback?: Function,
    /** 菜单的配置项 */
    menus?: {
        /** 菜单名 */
        label: string,
        /** 点击此菜单的回调 */
        click: Function
    }[]
}

export type GeometryLayerType = string | VectorLayer<VectorSource<Geometry>>
