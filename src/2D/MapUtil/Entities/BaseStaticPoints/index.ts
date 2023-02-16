import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'
import { Feature } from 'ol'

import BaseStaticPoint from './BaseStaticPoint'

import type { BaseStaticPointOptions, PointType } from './constant'
import Utils from '../../../../Utils'
import Layers from '../../Layers'


/**
 * @desc 基本静态点 控制器
 */

export default class BaseStaticPoints {
    private layer: VectorLayer<VectorSource<Geometry>>
    private store: Map<string | number, BaseStaticPoint>

    constructor(layer: VectorLayer<VectorSource<Geometry>> | string) {
        this.layer = layer instanceof VectorLayer ? layer : Layers.create(layer)
        this.store = new Map()
    }

    /**
     * @desc 绘制
     */
    public draw(param: PointType) {
        const id = param.id ?? param.name

        const newPoint = this.store.has(id) ?
            this.store.get(id)!.update(param) :
            new BaseStaticPoint(param)

        this.store.set(id, newPoint)
        return newPoint
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
}

const test = new BaseStaticPoints('2')

test.draw({
    id: '1',
    name: '1',
    coordinate: [0, 0]
})


