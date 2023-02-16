import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'
import { Style } from 'ol/style'

import type { Options as IconOptions } from 'ol/style/Icon'
import type { Options as CircleOptions } from 'ol/style/Circle'


type eventType = Function | {
    callback: Function,
    menus: { label: string, event: Function }[]
}


export interface BaseStaticPointOptions {
    layer?: string | VectorLayer<VectorSource<Geometry>>
    toolTip?: {
        class?: string
        text?: string
    }
    // 为基本静态点绑定事件
    events?: {
        singleClick?: eventType
        doubleClick?: eventType
        pointerMoveIn?: eventType
        pointerMoveOut?: eventType
        contextmenuClick?: eventType
    }
    /** 绘制为icon的基本属性 */
    icon?: Partial<IconOptions>
    /** 绘制为点的基本属性 */
    circle?: {
        fillColor?: string// 填充色
        strokeColor?: string// 边框色
        strokeWidth?: number// 边框色
    } & Omit<CircleOptions, 'stroke' | 'fill'>
    style?: Style
}

export type PointType = {
    name: string
    coordinate: [number, number]
    id?: string | number
    options?: BaseStaticPointOptions
}
