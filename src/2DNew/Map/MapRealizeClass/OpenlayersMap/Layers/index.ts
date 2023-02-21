import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'
import MapUtil from '../index'

const layerStore: Map<string, VectorLayer<VectorSource<Geometry>>> = new Map()


/**
 * @desc 图层管理器
 */
export default abstract class Layers {

    static create = (layerName: string): VectorLayer<VectorSource<Geometry>> => {
        
        if (!layerStore.has(layerName)) {
            const layer = new VectorLayer({ source: new VectorSource<Geometry>() })
            layer.set('name', layerName)
            layerStore.set(layerName, layer);
            MapUtil.get().map.addLayer(layer);
        }
        return layerStore.get(layerName)!
    }
}