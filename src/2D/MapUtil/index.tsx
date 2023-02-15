import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import Utils from '../../Utils'
import Map from './Map'



export default abstract class MapUtil {

    static instance: Map



    static create = (container: string, center?: number[]) => {
        if (Utils.isExist(this.instance)) {
            this.destory()
        }

        this.instance = new Map(container, center)

        // 初始化地图工具

        return this.instance
    }

    /**
     * @desc 获取Map实例
     */
    static get = () => {
        if (!Utils.isExist(this.instance)) {
            // new MapError('请先创建地图实例')
            console.error('请先创建地图实例');
        }
        return this.instance
    }


    /**
     * 销毁
     */
    static destory = () => {
        this.instance?.map.dispose()
        // @ts-ignore
        this.instance = null
    }


    /**
     * @desc 设置 OSM 图层
     */
    static setOSMLayer = (options?: { url?: string, opacity?: number }) => {
        const map = MapUtil.get().map

        map.getAllLayers().forEach(layer => {
            if (layer.get('name') === 'MAP_TILE_LAYER') {
                map.removeLayer(layer)
            }
        })

        const osmLayer = new TileLayer({
            opacity: options?.opacity ?? 1,
            source: new OSM() // { url: options?.url ?? ''}

        })

        osmLayer.set('name', 'MAP_TILE_LAYER')
        map.addLayer(osmLayer)
    }
}