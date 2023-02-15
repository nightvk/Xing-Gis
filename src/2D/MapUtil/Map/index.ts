import { Map as OlMap, View } from 'ol'
import { transform } from 'ol/proj'
import { defaults } from 'ol/interaction'

import Utils from '../../../Utils'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, DEFAULT_MAP_PROJECTION, DEFAULT_MAP_SOURCE_PROJECTION } from '../constant'


/**
 * @description 地图基类
 */
export default class Map {
    public map!: OlMap // openlayers 实例

    private center!: number[]// 中心
    private zoom!: number // 缩放级别
    private container!: string // 容器 ID

    constructor(container: string, center = DEFAULT_MAP_CENTER, zoom = DEFAULT_MAP_ZOOM) {
        this.center = center
        this.zoom = zoom
        this.container = container
        this.initMap()
    }

    /**
     * @desc 初始化
     */
    private initMap = () => {
        const containerEle = document.getElementById(this.container);

        if (!Utils.isExist(containerEle)) {
            console.error('地图容器不存在,初始化地图资源失败');
            return null;
        }

        const view = new View({
            projection: DEFAULT_MAP_PROJECTION,
            center: transform(this.center, DEFAULT_MAP_SOURCE_PROJECTION, DEFAULT_MAP_PROJECTION),
            zoom: this.zoom,
            minZoom: 1,
            maxZoom: 18
        })

        this.map = new OlMap({
            maxTilesLoading: 80,// 最大图层数
            pixelRatio: window.devicePixelRatio,// 分辨率
            target: containerEle!,// 挂载点
            layers: [],// 图层
            controls: [],// 控制器
            view,
            interactions: defaults({
                doubleClickZoom: false // 禁止双击缩放地图
            })
        })
    }
}