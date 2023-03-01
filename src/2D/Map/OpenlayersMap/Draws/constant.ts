import { Style } from "ol/style"
import { Coordinate } from 'ol/coordinate';
import { PointStyleType } from '../Geometry/Point/constant'



/** 绘制图层的默认图层名 */
export const DRAW_DEFAULT_LAYERNAME = 'DRAW_DEFAULT_LAYERNAME'
export const SNAP_DEFAULT_LAYERNAME = 'SNAP_DEFAULT_LAYERNAME'
export const MODIFY_DEFAULT_LAYERNAME = 'MODIFY_DEFAULT_LAYERNAME'



/** 绘制的配置项 */
export interface DrawsOptionsType {
    type: DrawType
    /** 绘制到指定的图层 */
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
    drawEndStyle?: any

    /** 通用样式配置 */
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number

    [k: string]: any
}


/** 可绘制的类型 */
export type DrawType =
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'Circle'
    | 'Rectangle'
    | 'Square'
    | 'Arrow';