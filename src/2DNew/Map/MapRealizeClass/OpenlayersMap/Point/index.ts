
import { Feature } from 'ol'
import { Geometry, Point as OlPoint } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'

import Utils from '../../../../Utils'

import type { PointOptionsType, PointType, PointLayerType } from './constant'


/**
 * 点
 */
export default class Point {
    public id: string | number = ''
    public name: string = ''
    public coordinate: [number, number] = [0, 0]
    public feature: Feature<OlPoint> = new Feature()

    private options: PointOptionsType = {}
    private layer!: VectorLayer<VectorSource<Geometry>>

    constructor(point: PointType) {
        const { id, name, coordinate, options } = point
        this.id = id ?? name ?? Utils.getUuid()
        this.name = name ?? id
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initLayer()
        this.initPoint()
    }

    /** 初始化图层 */
    private initLayer = () => {
        if (Utils.isExist(this.options.layer)) {
            const layer = this.options.layer
            const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
            this.layer = _layer
            _layer.getSource()?.addFeature(this.feature)
        }
    }

    /** 初始化实例 */
    private initPoint = () => {

    }


    /** 样式构建 */
    private getStyle = () => {
        let styles: Style[] = []
        if (Utils.isExist(this.options.style)) {
            styles.push(this.options.style)
        }
        else if (Utils.isExist(this.options.icon)) {

        } else if (Utils.isExist(this.options.circle)) {

        }
    }





}