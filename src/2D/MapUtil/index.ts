import { Graticule } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Fill, Stroke, Text } from 'ol/style'
import Overlay from 'ol/Overlay'
import { MousePosition, OverviewMap, ScaleLine } from 'ol/control'

import Map from './Map'
import Event from './Events'
import AuxiliaryUtils from './AuxiliaryUtils'
import { DEFAULT_MAP_SOURCE_PROJECTION, MAP_TILE_LAYER_NAME } from './constant'
import Utils from '../../Utils'

import './index.less'

/**
 * @desc 地图交互类
 */
export default abstract class MapUtil {

    static instance: Map
    /**
     * @desc 地图全局 tooltip 提示框
     */
    static tooltipOverlay = new Overlay({ offset: [15, 10] })

    /**
     * 新建地图
     * @param container 容器ID
     * @param center 中心点
     * @returns 
     */
    static create = (container: string, center?: number[]) => {
        if (Utils.isExist(this.instance)) {
            this.destory()
        }

        this.instance = new Map(container, center)
        this.instance.map.addOverlay(this.tooltipOverlay)

        Event.init()

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
     * @desc 销毁Map实例
     */
    static destory = () => {
        this.instance?.map.dispose();
        // @ts-ignore
        this.instance = null
        // Event.clear()
        // Measure.destory()
    }


    /**
     * @desc 设置 OSM 图层
     */
    static setOSMLayer = (options?: { url?: string, opacity?: number }) => {
        const map = MapUtil.get().map

        map.getAllLayers().forEach(layer => {
            if (layer.get('name') === MAP_TILE_LAYER_NAME) {
                map.removeLayer(layer)
            }
        })

        const osmLayer = new TileLayer({
            opacity: options?.opacity ?? 1,
            source: new OSM() // { url: options?.url ?? ''}

        })

        osmLayer.set('name', MAP_TILE_LAYER_NAME)
        map.addLayer(osmLayer)
    }


    /**
     * @desc 设置地图网格线
     */
    static setGrid = (show: boolean) => {
        const map = MapUtil.get().map
        const gridLayerName = 'MAP_GRID_LAYER'
        if (show === false) {
            map.getAllLayers().forEach(layer => {
                if (layer.get('name') === gridLayerName) {
                    map.removeLayer(layer)
                }
            })
        } else {
            const labelStyle = new Text({
                font: '12px 微软雅黑',
                textBaseline: 'bottom',
                fill: new Fill({ color: '#d5ecff', }),
                stroke: new Stroke({ color: 'rgba(0,0,0,1)', width: 2 })
            })

            const labelFormatter = (type: 'lon' | 'lat') => {
                let tags = ['W', 'E']
                if (type === 'lat') {
                    tags = ['S', 'N']
                }
                return (val: number) => {
                    const faVal = Math.abs(Math.round(val * 100) / 100)
                    return val === 0 ? '' :
                        val < 0 ? `${tags[0]} ${faVal}°` : `${tags[1]} ${faVal}°`
                }
            }

            const graticule = new Graticule({
                strokeStyle: new Stroke({
                    color: 'rgba(214,221,227,0.4)',
                    width: 1,
                    lineDash: [2, 4]
                }),
                showLabels: true,
                wrapX: true,
                lonLabelPosition: 0,
                latLabelPosition: 1,
                lonLabelStyle: labelStyle,
                latLabelStyle: labelStyle,
                lonLabelFormatter: labelFormatter('lon'),
                latLabelFormatter: labelFormatter('lat')
            })

            graticule.set('name', gridLayerName)
            graticule.setZIndex(40)
            map.addLayer(graticule)
        }
    }

    /**
     * @desc 设置鼠标经纬度
     */
    static setMousePos = (show: boolean, formatter = false) => {
        const map = MapUtil.get().map
        const mousePositionName = 'MAP_MOUSE_POSITION_CONTROL'

        if (show === false) {
            map.getControls().getArray().forEach(control => {
                if (control.get('name') === mousePositionName) {
                    map.removeControl(control)
                }
            })
        } else {
            const target = document.createElement('div')
            const view = document.querySelector('.ol-viewport')

            if (!Utils.isExist(view)) {
                console.error('添加鼠标经纬度失败,容器不存在！');
                return false
            }

            view!.append(target)

            const mousePosition = new MousePosition({
                target,
                className: 'custom-mouse-position',
                projection: DEFAULT_MAP_SOURCE_PROJECTION,
                coordinateFormat: (coordinate) => {
                    if (!Utils.isExist(coordinate)) return ''
                    else {
                        let lon = (coordinate![0] % 180).toFixed(6)
                        let lat = coordinate![1].toFixed(6)

                        if (formatter === true) {
                            lon = AuxiliaryUtils.transformLonLat('lon', Number(lon))
                            lat = AuxiliaryUtils.transformLonLat('lat', Number(lat))
                            return `<span>经度：${lon}</span><br/><span>纬度：${lat}</span>`
                        } else {
                            return `<span>经度：${lon}°</span><br/><span>纬度：${lat}°</span>`
                        }

                    }
                }
            })
            mousePosition.set('name', mousePositionName)
            map.addControl(mousePosition)
        }
    }

    /**
     * @desc 设置地图缩略图
     */
    static setOverviewMap = (show: boolean, layers?: any) => {
        const map = MapUtil.get().map
        const overviewMapName = 'MAP_OVERVIEW_CONTROL'
        if (show === false) {
            map.getControls().getArray().forEach(control => {
                if (control.get('name') === overviewMapName) {
                    map.removeControl(control)
                }
            })
        } else {
            const overviewMap = new OverviewMap({
                collapsed: false,
                className: 'custom-ol-overview',
                collapseLabel: '\u00BB',
                label: '\u00AB',
                layers: layers ?? [
                    new TileLayer({
                        source: new OSM({})
                    })
                ]
            })
            overviewMap.set('name', overviewMapName)
            map.addControl(overviewMap)
        }
    }

    /**
     * @desc 设置地图比例尺
     */
    static setScaleLine = (show: boolean) => {
        const map = MapUtil.get().map
        const scaleLineName = 'MAP_SCALELINE_CONTROL'
        if (show === false) {
            map.getControls().getArray().forEach(control => {
                if (control.get('name') === scaleLineName) {
                    map.removeControl(control)
                }
            })
        } else {
            const scaleLine = new ScaleLine({
                className: 'ol-scale-line',
                units: 'metric'
            })
            scaleLine.set('name', scaleLineName)
            map.addControl(scaleLine)
        }
    }
}