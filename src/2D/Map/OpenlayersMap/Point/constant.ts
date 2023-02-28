import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry, Point } from 'ol/geom'
import { Style } from 'ol/style'
import { Coordinate } from 'ol/coordinate';


import type { Options as IconOptions } from 'ol/style/Icon'
import type { Options as StrokeOptions } from 'ol/style/Stroke'
import type { Options as CircleOptions } from 'ol/style/Circle'


/** 散点的图层名 */
export const SPLASHES_POINT_DEFAULT_LAYERNAME = 'SPLASHES_POINT_DEFAULT_LAYERNAME'

/** 点的事件回调类型 */
export type PointEventType = Function | {
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

export type PointLayerType = string | VectorLayer<VectorSource<Geometry>>

/** 点的初始化类型 */
export interface PointType {
    /** id 唯一 */
    id: string | number
    /** 点的名字,默认以此名字作为标牌显示 */
    name: string
    /** 坐标 */
    coordinate: [number, number]
    /** 配置项 */
    options?: PointOptionsType
}

/** 点的样式类型 */
export interface PointStyleType {
    /** 绘制为Icon的基本属性 */
    icon?: Partial<IconOptions>
    /** 绘制为点的基本属性 */
    circle?: {
        radius?: number
        fill?: string
        stroke?: Partial<StrokeOptions>
    } & Omit<CircleOptions, 'stroke' | 'fill' | 'radius'>
    /** 自定义绘制样式 */
    style?: Style
}

export interface PointOptionsType extends PointStyleType {
    /** 图层 */
    layer?: PointLayerType
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
    /** 事件 */
    events?: {
        pointerMoveIn?: Function
        pointerMoveOut?: Function
        singleClick?: PointEventType
        doubleClick?: PointEventType
        contextmenuClick?: PointEventType
    }
}




export interface DrawPointOptionsType {
    layer?: string
    /** 基于初始位置绘制 */
    initCoordinates?: Coordinate[]


    /** 当type 为 LineString 时绘制为虚线 */
    lineType?: 'dash'
    /** 绘制的图形名称 */
    name?: string;
    /** 鼠标指针的样式 */
    pointerStyle?: PointStyleType
    /** 绘制结束图形的样式 */
    drawEndStyle?: PointStyleType

    /** 通用样式配置 */
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
}