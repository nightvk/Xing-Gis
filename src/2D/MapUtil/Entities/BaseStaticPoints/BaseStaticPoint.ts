
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry, Point } from 'ol/geom'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'


import { BaseStaticPointOptions, PointType } from './constant'
import { Feature } from 'ol'
import Utils from '../../../../Utils'
import Layers from '../../Layers'



/**
 * @desc 基本静态点
 * @desc 绘制优先级  style > icon > point
 */

export default class BaseStaticPoint {

    public id: string | number = ''
    public name: string = ''
    public coordinates: [number, number] = [0, 0]
    public feature: Feature<Point> = new Feature()

    private options: BaseStaticPointOptions = {}


    constructor(point: PointType) {
        const { id, name, coordinate, options } = point
        this.id = id ?? name
        this.name = name
        this.coordinates = coordinate
        this.options = options ?? {}
        this.initLayer()
        this.initPoint()
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
    }

    /**
     * @desc 构建初始图层
     */

    private initLayer = () => {
        const layer = this.options.layer
        if (!Utils.isExist(layer)) {
            this.layer = param.options?.layer instanceof VectorLayer ? param.options?.layer :
                Layers.create(param.options?.layer ?? 'BaseStaticPoints')
        }
    }

    /**
    * @desc 构建初始点
    */

    private initPoint = () => {

    }

    /**
     * @desc 显示
     */
    public show = () => {
        this.feature.setStyle(this.getStyle())
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
    public update = (point: PointType) => {
        return this
    }
}