import { Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import ComplexPoint, { ComplexPointType } from '../../Entities/ComplexPoint'
import Layers from '../../Layers'
import Utils from '../../../../Utils'

/**
 * @desc 复杂点 控制器
 */

export default class SimplePointController {
    private layer!: VectorLayer<VectorSource<Geometry>>
    private store: Map<string | number, ComplexPoint>

    constructor(layer: VectorLayer<VectorSource<Geometry>> | string) {
        const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
        this.layer = _layer
        this.store = new Map()
    }

    /**
     * @desc 绘制(新增+修改)
     */
    public draw = (param: ComplexPointType) => {
        const id = param.id ?? param.name

        if (this.store.has(id)) {
            const newPoint = this.store.get(id)?.update(param)
            this.store.set(id, newPoint!)
            return newPoint
        } else {
            const newPoint = new ComplexPoint(param)
            this.store.set(id, newPoint!)

            // 若单点有自己的图层属性,则控制器不管理
            if (!Utils.isExist(param.options?.layer)) {
                this.layer.getSource()?.addFeature(newPoint?.feature!)
            }
            return newPoint
        }
    };

    /**
     * @desc 删除
     */
    public remove = (id: string | number) => {
        const point = this.store.get(id)
        if (!Utils.isExist(point)) return

        this.layer.getSource()?.removeFeature(point.feature)
        this.store.delete(id)
    }

    /**
    * @desc 找值
    */
    public find = (id: string | number) => {
        return this.store.get(id)
    }

    /**
    * @desc 显示
    */
    public show = (id: string | number) => {
        this.store.get(id)?.show()
    }

    /**
    * @desc 隐藏
    */
    public hidden = (id: string | number) => {
        this.store.get(id)?.hidden()
    }

    /**
     * @desc 激活
     */
    public active = (id: string | number) => {
        this.store.get(id)?.active()
    }

    /**
    * @desc 清空
    */
    public clear = () => {
        this.layer.getSource()?.clear()
        this.store.clear()
    }
}