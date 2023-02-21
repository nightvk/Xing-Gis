import { Map as OlMap, View } from 'ol'
import { Projection, transform } from 'ol/proj';
import Overlay from 'ol/Overlay'
import { defaults } from 'ol/interaction'
import { Graticule } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Fill, Stroke, Text } from 'ol/style'
import { MousePosition, OverviewMap, ScaleLine } from 'ol/control'

import MapToolConstraint from '../../../MapConstraintClass/MapToolConstraint'
import { DEFAULT_MAP_PROJECTION, DEFAULT_MAP_SOURCE_PROJECTION, MAP_TILE_LAYER_NAME, } from '../Assist/constant'
import { transformLonLat } from '../Assist/function'

import Utils from '@/Utils'

import './index.less'

/**
 * @desc 地图交互类 <直接操作或作用于地图本身>
 */
export default abstract class Tool extends MapToolConstraint {

    private static instance: OlMap
    /** 地图全局 唯一 tooltip 提示框*/
    public static tooltipOverlay = new Overlay({ offset: [15, 10] })

    /** 地图全局 唯一 菜单*/
    public static menuOverlay = new Overlay({ offset: [15, 10] })

    /** 创建地图 */
    public static create = (container: HTMLElement, center: [number, number], zoom: number) => {
        if (!Utils.isExist(container)) {
            console.error('地图容器不存在,初始化地图资源失败');
            return null;
        }

        const view = new View({
            projection: DEFAULT_MAP_PROJECTION,
            center: transform(center, DEFAULT_MAP_SOURCE_PROJECTION, DEFAULT_MAP_PROJECTION),
            zoom,
            minZoom: 1,
            maxZoom: 18
        })

        this.set(new OlMap({
            maxTilesLoading: 80,// 最大图层数
            pixelRatio: window.devicePixelRatio,// 分辨率
            target: container,// 挂载点
            layers: [],// 图层
            controls: [],// 控制器
            view,
            interactions: defaults({
                doubleClickZoom: false // 禁止双击缩放地图
            })
        }))
    }

    /** 销毁Map实例 */
    public static destory = () => {
        this.instance.dispose();
        // @ts-ignore
        this.set(null)
    }

    /** 全局 overlay 上图 */
    public static initOverlay = () => {
        this.instance.addOverlay(this.tooltipOverlay)
        this.instance.addOverlay(this.menuOverlay)
    }


    /** 获取Map实例 */
    public static get = () => {
        if (!Utils.isExist(this.instance)) {
            //throw new MapError('请先创建地图实例')
            console.error('请先创建地图实例');
        }
        return this.instance
    }

    /** 设置Map实例 */
    public static set = (map: OlMap) => {
        this.instance = map
    }

    /** 改变图标 */
    public static changeIcon = () => {
        console.log('此处改变图标!TODO');
    }


    /** 移动地图 */
    public static flayTo = (center: [number, number], zoom: number) => {
        this.get().getView().animate({
            center: transform(center, DEFAULT_MAP_SOURCE_PROJECTION, DEFAULT_MAP_PROJECTION),
            duration: 1000,
            zoom,
        });
    }

    /** 设置地图网格线 */
    static setGrid = (show: boolean) => {
        const map = this.get()
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
        const map = this.get()
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
                            lon = transformLonLat('lon', Number(lon))
                            lat = transformLonLat('lat', Number(lat))
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
        const map = this.get()
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
        const map = this.get()
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

    /** 设置 OSM 图层 */
    static setOSMLayer = (options?: { url?: string, opacity?: number }) => {

        Tool.get().getAllLayers().forEach(layer => {
            if (layer.get('name') === MAP_TILE_LAYER_NAME) {
                this.instance.removeLayer(layer)
            }
        })

        const osmLayer = new TileLayer({
            opacity: options?.opacity ?? 1,
            source: new OSM() // { url: options?.url ?? ''}

        })

        osmLayer.set('name', MAP_TILE_LAYER_NAME)
        Tool.get().addLayer(osmLayer)
    }

}

    // /**
    //  * @desc 设置 OSM 图层
    //  */
    // static setOSMLayer = (options?: { url?: string, opacity?: number }) => {
    //     const map = MapUtil.get().map

    //     map.getAllLayers().forEach(layer => {
    //         if (layer.get('name') === MAP_TILE_LAYER_NAME) {
    //             map.removeLayer(layer)
    //         }
    //     })

    //     const osmLayer = new TileLayer({
    //         opacity: options?.opacity ?? 1,
    //         source: new OSM() // { url: options?.url ?? ''}

    //     })

    //     osmLayer.set('name', MAP_TILE_LAYER_NAME)
    //     map.addLayer(osmLayer)
    // }


