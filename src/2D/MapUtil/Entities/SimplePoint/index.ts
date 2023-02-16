import { Feature } from 'ol'
import { fromLonLat } from 'ol/proj'
import { Geometry, Point } from 'ol/geom'
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Utils from '../../../../Utils'
import Layers from '../../Layers'
import MapUtil from '../../index';

import type { Options as IconOptions } from 'ol/style/Icon'
import type { Options as CircleOptions } from 'ol/style/Circle'


export interface SimplePointType {
    id?: string | number
    name: string
    coordinate: [number, number]
    options?: SimplePointOptions
}

export interface SimplePointOptions {
    layer?: string | VectorLayer<VectorSource<Geometry>>
    toolTip?: {
        class?: string
        text?: string
    }
    /** 绘制为icon的基本属性 */
    icon?: Partial<IconOptions>
    /** 绘制为点的基本属性 */
    circle?: {
        fillColor?: string// 填充色
        strokeColor?: string// 边框色
        strokeWidth?: number// 边框色
    } & Omit<CircleOptions, 'stroke' | 'fill'>
    style?: Style,
    /** 将原始数据缓存 */
    source?: Record<string, any>
}

/**
 * @desc 简单的点(只有tooltip,纯展示功能)
 * @desc 若传入 layer 属性,则独自上图,不受上层控制器管理
 */
export default class SimplePoint {
    public id: string | number = ''
    public name: string = ''
    public coordinates: [number, number] = [0, 0]
    public feature: Feature<Point> = new Feature()

    private options: SimplePointOptions = {}
    private layer!: VectorLayer<VectorSource<Geometry>>

    constructor(point: SimplePointType) {
        const { id, name, coordinate, options } = point
        this.id = id ?? name
        this.name = name
        this.coordinates = coordinate
        this.options = options ?? {}
        this.initGeometry()
    }

    /**
     * @desc 构建样式
     */
    private getStyle = () => {
        if (Utils.isExist(this.options.style)) {
            return this.options.style
        }
        if (Utils.isExist(this.options.icon)) {
            return new Style({ image: new Icon({ ...this.options.icon }) })
        }
        if (Utils.isExist(this.options.circle)) {
            const { fillColor = 'red', strokeColor = 'blue', strokeWidth = 0, radius = 4 } = this.options.circle
            return new Style({
                image: new Circle({
                    ...this.options.circle,
                    fill: new Fill({ color: fillColor }),
                    stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
                    radius
                })
            })
        }
        return new Style()
    }

    /**
    * @desc 构建初始点
    */
    private initGeometry = () => {
        const geometry = new Point(fromLonLat(this.coordinates))
        this.feature.setGeometry(geometry)
        this.feature.setStyle(this.getStyle())
        this.feature.set('target', this.options.source)
        this.feature.set('pointerMoveIn', this.pointerMoveIn)
        this.feature.set('pointerMoveOut', this.pointerMoveOut)

        if (Utils.isExist(this.options.layer)) {
            const layer = this.options.layer
            const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
            this.layer = _layer
            _layer.getSource()?.addFeature(this.feature)
        }
    }

    /**
     * @desc 显示
     */
    public show = () => {
        this.feature.setStyle(this.getStyle())
    }

    /**
    * @desc 删除
    */
    public remove = () => {
        if (Utils.isExist(this.layer)) {
            this.layer.getSource()?.removeFeature(this.feature)
        } else {
            console.error('删除失败,未传入初始图层')
        }
    }

    /**
    * @desc 隐藏
    */
    public hidden = () => {
        this.feature.setStyle(new Style())
    }

    /**
     * @desc 更新
     */
    public update = (point: SimplePointType) => {
        const { id, name, coordinate, options } = point
        this.id = id ?? name
        this.name = name
        this.coordinates = coordinate
        this.options = options ?? {}
        this.initGeometry()
        return this
    }

    /**
     * @desc 移入显示name
     */
    private pointerMoveIn = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        let { text = this.name } = this.options.toolTip ?? {}

        const ele = document.createElement('div')
        ele.className = `ol-map-tooltip ${this.options.toolTip?.class ?? ''}`
        ele.innerHTML = text

        MapUtil.tooltipOverlay.setElement(ele)
        MapUtil.tooltipOverlay.setPosition(e.coordinate)
    }

    /**
     * @desc 移出取消显示
     */
    private pointerMoveOut = () => {
        MapUtil.tooltipOverlay.setElement(undefined)
    }
}