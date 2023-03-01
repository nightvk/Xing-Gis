
import Layers from '../../Layers/index'
import Line from './index'
import Utils from '@/Utils'

import type { LayerType } from '../../Layers/index'
import type { LineType } from './constant'
import type { GeoGatherConstraint } from '@/2D/constraint'

export default class LineGather implements GeoGatherConstraint {
    private layer!: LayerType
    private store: Map<string | number, Line> = new Map()

    constructor(layerName: string, groupLayerName?: string) {
        this.layer = Layers.create(layerName, groupLayerName)
    }

    /** 绘制 (新增 + 修改) */
    public draw = (param: LineType): Line => {
        const { id, name, options } = param

        const _id = id ?? name

        if (this.store.has(_id)) {
            const newLine = this.store.get(id)?.update(param)!
            this.store.set(_id, newLine)
            return newLine
        } else {
            const newLine = new Line(param)
            this.store.set(_id, newLine!)

            // 若线条有自己的图层属性,则控制器所属图层不渲染
            if (!Utils.isExist(options?.layer)) {
                this.layer.getSource()?.addFeature(newLine?.feature!)
            }
            return newLine
        }
    }

    /** 删除*/
    public remove = (id: string | number) => {
        const line = this.store.get(id)
        if (!Utils.isExist(line)) return

        this.layer.getSource()?.removeFeature(line.feature)
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