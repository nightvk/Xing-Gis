
import { Coordinate } from 'ol/coordinate';
import { PointStyleType } from '../Point/constant'

import type { Options as StrokeOptions } from 'ol/style/Stroke'
import type { Options as TextOptions } from 'ol/style/Text'
import type { GeometryEventType, GeometryLayerType } from '../constant'

/** 散线的图层名 */
export const SPLASHES_LINE_DEFAULT_LAYERNAME = 'SPLASHES_LINE_DEFAULT_LAYERNAME'

/** 线的初始化类型 */
export interface LineType {
    /** id 唯一 */
    id: string | number
    /** 线的名字,默认以此名字作为标牌显示 */
    name: string
    /** 坐标 */
    coordinate: [number, number][]
    /** 配置项 */
    options?: LineOptionsType
}

interface BaseStyleType {
    lineStyle?: {
        stroke?: Partial<StrokeOptions>
        text?: Partial<TextOptions>
    },
    nodeStyle?: Omit<PointStyleType, 'text'>,
}

/** 线的样式类型 */
export interface LineStyleType extends BaseStyleType {
    activeStyle?: BaseStyleType
}

export interface LineOptionsType extends LineStyleType {
    /** 图层 */
    layer?: GeometryLayerType
    /** 鼠标移入显示的标牌 */
    toolTip?: {
        /** 是否展示,默认展示 */
        show?: boolean
        /** 标牌面板的类名 */
        className?: string
        /** 显示内容 */
        text?: string
    }

    /** 将原始数据缓存 */
    source?: Record<string, any>
    /** 是否激活 激活后会附带激活背景*/
    active?: boolean
    /** 鼠标移入是否开启激活状态 */
    hoverActive?: boolean
    /** 上图时,是否展示名字 默认不展示 */
    showName?: boolean
    /** 事件 */
    events?: {
        pointerMoveIn?: Function
        pointerMoveOut?: Function
        singleClick?: GeometryEventType
        doubleClick?: GeometryEventType
        contextmenuClick?: GeometryEventType
    }
}




export interface DrawLineOptionsType {
    layer?: string
    /** 基于初始位置绘制 */
    initCoordinates?: Coordinate[]


    /** 当type 为 LineString 时绘制为虚线 */
    lineType?: 'dash'
    /** 绘制的图形名称 */
    name?: string;
    /** 绘制时鼠标指针的样式 */
    pointerStyle?: PointStyleType
    /** 绘制结束图形的样式 */
    drawEndStyle?: LineStyleType

    /** 通用样式配置 */
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
}