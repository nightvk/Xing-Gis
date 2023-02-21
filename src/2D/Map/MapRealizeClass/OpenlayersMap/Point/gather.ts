
import Layers from '../Layers/index'
import Point from './index'

import type { LayerType } from '../Layers/index'
import type { PointType } from './constant'
import Utils from '@/Utils'

export default class PointGather {
    private layer!: LayerType
    private store: Map<string | number, Point> = new Map()

    constructor(layerName: string, groupLayerName?: string) {
        this.layer = Layers.create(layerName, groupLayerName)
    }

    /** 绘制 (新增 + 修改) */
    public draw = (param: PointType): Point => {
        const { id, name, options } = param

        const _id = id ?? name

        if (this.store.has(_id)) {
            const newPoint = this.store.get(id)?.update(param)!
            this.store.set(_id, newPoint)
            return newPoint
        } else {
            const newPoint = new Point(param)
            this.store.set(_id, newPoint!)

            // 若单点有自己的图层属性,则控制器所属图层不渲染此点
            if (!Utils.isExist(options?.layer)) {
                this.layer.getSource()?.addFeature(newPoint?.feature!)
            }
            return newPoint
        }
    }

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