import { Style } from "ol/style"
import { Coordinate } from 'ol/coordinate';

/** 绘制图层的默认图层名 */
export const DRAW_DEFAULT_LAYERNAME = 'DRAW_DEFAULT_LAYERNAME'



/** 绘制的配置项 */
export interface DrawsOptionsType {
    type: DrawType
    /** 绘制到指定的图层 */
    layer?: string
    /** 绘制器的样式 */
    style?: Style
    /** 基于初始位置绘制 */
    initCoordinates?: Coordinate[]
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