import { Map as OlMap } from 'ol'
import { MapMode } from '@/2D/constant'
import Tool from './Tool'
import Events from './Events'
import LayerGroups from './Layers/group'
import { MapInstanceConstraint } from '@/2D/constraint'

export default class OpenlayersMap extends MapInstanceConstraint {
    public map!: OlMap // openlayers 实例
    private mapMode: MapMode = MapMode.REALTIME// 地图当前的模式
    private modeChangeIsClearLayers: boolean = false// 地图切换模式时是否清空图层

    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        Tool.create(container, center, zoom)
        Tool.setOSMLayer()
        Tool.initOverlay()
        Events.init()
    }

    /** 模式切换 */
    private modeChange(value: MapMode) {
        if (this.modeChangeIsClearLayers) {
            LayerGroups.remove(this.mapMode);
            LayerGroups.create(value);
        } else {
            LayerGroups.hidden(this.mapMode);
            LayerGroups.create(value);
        }
    }

    /** 设置地图模式  */
    public set mode(value: MapMode) {
        this.modeChange(value);
        this.mapMode = value;
    }

    /** 获取地图模式 */
    public get mode() {
        return this.mapMode;
    }
}