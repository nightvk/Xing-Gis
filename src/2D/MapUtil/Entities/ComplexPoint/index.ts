import { Feature } from 'ol'
import { fromLonLat } from 'ol/proj'
import { Geometry, Point } from 'ol/geom'
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Utils from '../../../../Utils'
import Layers from '../../Layers'
import MapUtil from '../../index';
import HoverAndSelectIcon from '../../../images/hover_and_select_bkg.svg'

import type { Options as IconOptions } from 'ol/style/Icon'
import type { Options as CircleOptions } from 'ol/style/Circle'

import SimplePoint, { SimplePointType, SimplePointOptions } from '../SimplePoint'
import { toSize } from 'ol/size';


export interface ComplexPointType {
    id?: string | number
    name: string
    coordinate: [number, number]
    options: ComplexPointOptions
}


type eventType = Function | {
    callback?: Function,
    class?: string
    menus?: { label: string, event: Function }[]
}


type ComplexPointOptions = SimplePointOptions & {
    /** 激活 */
    active?: boolean
    /** 聚焦 */
    showHover?: boolean
    /** 事件 */
    events?: {
        singleClick?: eventType
        doubleClick?: eventType
        pointerMoveIn?: eventType
        pointerMoveOut?: eventType
        contextmenuClick?: eventType
    }
}

/**
 * @desc 复杂点
 * @desc 带有各种交互事件及交互动画的点
 * @desc 若传入 layer 属性,则独自上图,不受上层控制器管理
 */
export default class ComplexPoint {
    public id: string | number = ''
    public name: string = ''
    public coordinate: [number, number] = [0, 0]
    public feature: Feature<Point> = new Feature()

    private options: ComplexPointOptions = {}
    private layer!: VectorLayer<VectorSource<Geometry>>

    private isFocus: boolean = false

    constructor(point: ComplexPointType) {
        const { id, name, coordinate, options } = point
        this.id = id ?? name
        this.name = name
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initGeometry()
    }

    /**
     * @desc 构建样式
     */
    private getStyle = (): Style[] => {
        if (Utils.isExist(this.options.style)) {
            return [this.options.style]
        }

        let styleOptions: any = {}
        if (Utils.isExist(this.options.icon)) {
            styleOptions = { image: new Icon({ ...this.options.icon }) }
        }
        if (Utils.isExist(this.options.circle)) {
            const { fillColor = 'red', strokeColor = 'blue', strokeWidth = 0, radius = 4 } = this.options.circle
            styleOptions = {
                image: new Circle({
                    ...this.options.circle,
                    fill: new Fill({ color: fillColor }),
                    stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
                    radius
                })
            }
        }

        // 激活状态
        if (this.options.active === true) {
            return [new Style(styleOptions), this.getHoverStyle()]
        }

        return [new Style(styleOptions)]
    }


    /**
   * @desc 构建Hover样式
   */
    private getHoverStyle = () => {
        return new Style({
            image: new Icon({
                src: HoverAndSelectIcon,
                scale: 0.8
            })
        })
    }

    /**
    * @desc 构建初始点
    */
    private initGeometry = () => {
        const geometry = new Point(fromLonLat(this.coordinate))
        this.feature.setGeometry(geometry)
        this.feature.setStyle(this.getStyle())
        this.feature.set('target', this.options.source)
        this.feature.set('pointerMoveIn', this.pointerMoveIn)
        this.feature.set('pointerMoveOut', this.pointerMoveOut)
        this.feature.set('singleClick', this.singleClick)
        this.feature.set('doubleClick', this.doubleClick)
        this.feature.set('contextmenuClick', this.contextmenuClick)

        if (Utils.isExist(this.options.layer)) {
            const layer = this.options.layer
            const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
            this.layer = _layer
            _layer.getSource()?.addFeature(this.feature)
        }
    }

    /**
     * @desc 删除
     */
    public remove = () => {
        if (Utils.isExist(this.layer)) {
            this.layer.getSource()?.removeFeature(this.feature)
        } else {
            console.error('删除失败,未传入初始图层')
        }
    }

    /**
     * @desc 显示TODO
     */
    public show = () => {
        this.feature.setStyle(this.getStyle())
    }

    /**
    * @desc 隐藏
    */
    public hidden = () => {
        this.feature.setStyle(new Style())
    }

    /**
    * @desc 激活 TODO
    */
    public active = () => {
        this.feature.setStyle(new Style())
    }

    /**
     * @desc 更新
     */
    public update = (point: SimplePointType) => {
        const { id, name, coordinate, options } = point
        this.id = id ?? name
        this.name = name
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initGeometry()
        return this
    }

    /**
     * @desc 移入显示name
     */
    private pointerMoveIn = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        let { showHover = false, active = false, toolTip = {} } = this.options ?? {}
        let { text = this.name, show = true } = toolTip

        if (show) {
            const ele = document.createElement('div')
            ele.className = `ol-map-tooltip ${this.options.toolTip?.class ?? ''}`
            ele.innerHTML = text

            MapUtil.tooltipOverlay.setElement(ele)
            MapUtil.tooltipOverlay.setPosition(e.coordinate)
        }
        // 非激活状态 但需要显示hover效果
        if (showHover === true && active === false) {
            this.feature.setStyle([...this.getStyle(), this.getHoverStyle()])
        }
    }

    /**
     * @desc 移出取消显示
     */
    private pointerMoveOut = () => {
        MapUtil.tooltipOverlay.setElement(undefined)
        let { active = false } = this.options ?? {}
        if (active === false) {
            this.feature.setStyle(this.getStyle())
        }
    }

    /**
     * @desc 右键事件
     */
    private contextmenuClick = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        generateEventFunc(this.options?.events?.contextmenuClick, e, target)()
    }

    /**
     * @desc 单击事件
     */
    private singleClick = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        generateEventFunc(this.options?.events?.singleClick, e, target)()
    }

    /**
     * @desc 双击事件
     */
    private doubleClick = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        generateEventFunc(this.options?.events?.doubleClick, e, target)()

    }
}


const generateEventFunc = (event: eventType | undefined, e: MapBrowserEvent<any>, target: Record<string, any>) => {
    return () => {
        if (!Utils.isExist(event)) {
            return
        }

        if (Utils.isFunction(event)) {
            event(e, target)
            return
        }

        const { callback = Utils.emptyFunc, menus = [], class: className } = event ?? {}
        callback(e, target)

        const ele = document.createElement('div')
        ele.className = `ol-map-menus ${className ?? ''}`

        if (menus.length === 0) {
            MapUtil.menuOverlay.setElement(undefined)
        } else {
            menus.forEach(menu => {
                const menuEle = document.createElement('div')
                menuEle.className = 'menu-item'
                menuEle.innerHTML = menu.label
                menuEle.addEventListener('click', () => {
                    menu.event?.(e, target)
                    MapUtil.menuOverlay.setElement(undefined)

                })
                ele.appendChild(menuEle)
            })

            MapUtil.menuOverlay.setElement(ele)
            MapUtil.menuOverlay.setPosition(e.coordinate)
        }
    }
}