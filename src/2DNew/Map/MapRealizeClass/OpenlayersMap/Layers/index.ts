import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'
import Utils from '@/Utils'
import LayerGroups from './group'
import Tool from '../Tool'

export type LayerType = VectorLayer<VectorSource<Geometry>>

/**
 * @desc 图层管理器
 */
export default abstract class Layers {
    private static store: Map<string, LayerType> = new Map()

    /**
     * 新建图层
     * @param layerName 当前图层名
     * @param groupName 分组名
     * @returns 
     */
    public static create = (layerName: string, groupName?: string): LayerType => {
        let layer: LayerType

        if (this.store.has(layerName)) {
            layer = this.store.get(layerName)!
        }
        else {
            layer = new VectorLayer({
                source: new VectorSource<Geometry>()
            });
            layer.set('name', this.name);
            Tool.get().addLayer(layer)
        }


        // 添加到分组中
        if (Utils.isExist(groupName)) {
            const group = LayerGroups.create(groupName)!
            group.getLayers().push(layer)
        }

        this.store.set(layerName, layer)

        return layer
    }

    /** 称移所有图层 */
    public static clear = () => {
        const map = Tool.get()
        this.store.forEach(map.removeLayer)
        this.store.clear()
    }

    /** 通过图层名移除图层 */
    public static remove = (name: string) => {
        const map = Tool.get()

        if (this.store.has(name)) {
            map.removeLayer(this.store.get(name)!)
            this.store.delete(name)
        }
    }

    /** 通过图层名查找图层 */
    public static find = (name: string) => {
        return this.store.get(name)
    }

    /** 显示图层 */
    public static show = (name: string) => {
        this.store.get(name)?.setVisible(true)
    }

    /** 隐藏图层 */
    public static hidden = (name: string) => {
        this.store.get(name)?.setVisible(false)
    }
}