
import Layers from '../../Layers/index'
import Polygon from './index'
import Utils from '@/Utils'

import type { LayerType } from '../../Layers/index'
import type { PolygonType } from './constant'
import type { GeoGatherConstraint } from '@/2D/constraint'

export default class PolygonGather implements GeoGatherConstraint {
    private layer!: LayerType
    private store: Map<string | number, Polygon> = new Map()

    constructor(layerName: string, groupLayerName?: string) {
        this.layer = Layers.create(layerName, groupLayerName)
    }

    /** 绘制 (新增 + 修改) */
    public draw = (param: PolygonType): Polygon => {
        const { id, name, options } = param

        const _id = id ?? name

        if (this.store.has(_id)) {
            const newPolygon = this.store.get(id)?.update(param)!
            this.store.set(_id, newPolygon)
            return newPolygon
        } else {
            const newPolygon = new Polygon(param)
            this.store.set(_id, newPolygon!)

            // 若多边形有自己的图层属性,则控制器所属图层不渲染
            if (!Utils.isExist(options?.layer)) {
                this.layer.getSource()?.addFeature(newPolygon?.feature!)
            }
            return newPolygon
        }
    }

    /** 删除*/
    public remove = (id: string | number) => {
        const polygon = this.store.get(id)
        if (!Utils.isExist(polygon)) return

        this.layer.getSource()?.removeFeature(polygon.feature)
        this.store.delete(id)
    }

    /** 找值 */
    public find = (id: string | number) => {
        return this.store.get(id)
    }

    /** 显示 */
    public show = (id: string | number) => {
        this.store.get(id)?.show()
    }

    /** 隐藏 */
    public hidden = (id: string | number) => {
        this.store.get(id)?.hidden()
    }

    /** 激活  */
    public active = (id: string | number) => {
        this.store.get(id)?.active()
    }

    /** 清空 */
    public clear = () => {
        this.layer.getSource()?.clear()
        this.store.clear()
    }

    /** 获取所有 */
    public getList = () => {
        return Array.from(this.store.values())
    }
}