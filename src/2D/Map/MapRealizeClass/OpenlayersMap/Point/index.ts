
import { Feature } from 'ol'
import { Point as OlPoint } from 'ol/geom'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import MapBrowserEvent from 'ol/MapBrowserEvent';

import Layers from '../Layers'
import Utils from '@/Utils'
import type { PointOptionsType, PointType, PointEventType } from './constant'
import type { LayerType } from '../Layers/index'
import HoverAndSelectIcon from '../../../MapStaticResource/hover_and_select_bkg.svg'
import Tool from '../Tool';

/**
 * 点
 */
export default class Point {
    public id: string | number = ''
    public name: string = ''
    public coordinate: [number, number] = [0, 0]
    public feature: Feature<OlPoint> = new Feature()

    private options: PointOptionsType = {}
    private layer!: LayerType

    constructor(point: PointType) {
        const { id, name, coordinate, options } = point
        this.id = id ?? name ?? Utils.getUuid()
        this.name = name ?? id
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initPoint()
    }


    /** 更新 */
    public update = (param: PointType) => {
        const { id, name, coordinate, options } = param
        this.id = id ?? name
        this.name = name
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initPoint()
        return this
    }

    /** 删除  */
    public remove = () => {
        if (Utils.isExist(this.layer)) {
            this.layer.getSource()?.removeFeature(this.feature)
        }
    }


    /** 激活 */
    public active = () => {
        this.feature.setStyle([...this.getStyle(), this.getHoverStyle()])
    }

    /** 显示 */
    public show = () => {
        this.feature.setStyle(this.getStyle())
    }

    /** 隐藏 */
    public hidden = () => {
        this.feature.setStyle(new Style())
    }

    /** 开启编辑状态 TODO */
    public startEdit = (editEndCallback: (coordinate: [number, number]) => {}) => {

    }

    /** 退出编辑状态 TODO */
    public endEdit = () => {

    }


    /**  移入事件   */
    private pointerMoveIn = (e: MapBrowserEvent<any>, target: Record<string, any>) => {
        let { hoverActive = false, active = false, toolTip = {} } = this.options ?? {}
        let { text = this.name, show = true, className } = toolTip

        if (show) {
            const ele = document.createElement('div')
            ele.className = `ol-map-tooltip ${className ?? ''}`
            ele.innerHTML = text

            Tool.tooltipOverlay.setElement(ele)
            Tool.tooltipOverlay.setPosition(e.coordinate)
        }
        // 非激活状态 但需要显示hover效果
        if (hoverActive === true && active === false) {
            this.feature.setStyle([...this.getStyle(), this.getHoverStyle()])
        }
    }

    /** 移出事件 */
    private pointerMoveOut = () => {
        Tool.tooltipOverlay.setElement(undefined)
        let { active = false } = this.options ?? {}
        if (active === false) {
            this.feature.setStyle(this.getStyle())
        }
    }
    /** 右键事件 */
    private contextmenuClick = (e: MapBrowserEvent<any>, source: Record<string, any>) => {
        generateEventFunc(this.options?.events?.contextmenuClick, e, source)()
    }

    /** 单击事件 */
    private singleClick = (e: MapBrowserEvent<any>, source: Record<string, any>) => {
        generateEventFunc(this.options?.events?.singleClick, e, source)()
    }

    /** 双击事件 */
    private doubleClick = (e: MapBrowserEvent<any>, source: Record<string, any>) => {
        generateEventFunc(this.options?.events?.doubleClick, e, source)()
    }

    /** 初始化实例 */
    private initPoint = () => {
        const geometry = new OlPoint(fromLonLat(this.coordinate))
        this.feature.setGeometry(geometry)
        this.feature.setStyle(this.getStyle())
        this.feature.set('source', this.options.source)
        this.feature.set('pointerMoveIn', this.pointerMoveIn)
        this.feature.set('pointerMoveOut', this.pointerMoveOut)
        this.feature.set('singleClick', this.singleClick)
        this.feature.set('doubleClick', this.doubleClick)
        this.feature.set('contextmenuClick', this.contextmenuClick)

        const layer = this.options.layer
        if (Utils.isExist(layer)) {
            const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
            this.layer = _layer
            _layer.getSource()?.addFeature(this.feature)
        }
    }


    /** 样式构建 (优先级:style > icon > circle ) */
    private getStyle = (): Style[] => {
        let styles: Style[] = []
        const { style, icon, circle, active } = this.options

        if (Utils.isExist(style)) {
            styles.push(style)
        }
        else if (Utils.isExist(icon)) {
            styles.push(new Style({
                image: new Icon({ ...icon })
            }))

        }
        else {// 默认画圆
            const { fill, stroke, radius = 4 } = circle ?? {}
            styles.push(new Style({
                image: new Circle({
                    ...circle,
                    fill: new Fill({ color: fill?.color ?? 'red' }),
                    stroke: new Stroke({ ...(stroke ?? {}) }),
                    radius
                })
            }))
        }

        if (active === true) {
            styles.push(this.getHoverStyle())
        }

        return styles
    }

    /** 激活样式 */
    private getHoverStyle = (): Style => {
        return new Style({
            image: new Icon({
                src: HoverAndSelectIcon,
                scale: 0.8
            })
        })
    }
}


/** 单击双击右键的事件生成函数 */
const generateEventFunc = (event: PointEventType | undefined, e: MapBrowserEvent<any>, target: Record<string, any>) => {
    return () => {
        if (!Utils.isExist(event)) {
            return
        }

        if (Utils.isFunction(event)) {
            event(e, target)
            return
        }

        const { callback = Utils.emptyFunc, menus = [], className } = event ?? {}
        callback(e, target)

        const ele = document.createElement('div')
        ele.className = `ol-map-menus ${className ?? ''}`

        if (menus.length === 0) {
            Tool.menuOverlay.setElement(undefined)
        } else {
            menus.forEach(menu => {
                const menuEle = document.createElement('div')
                menuEle.className = 'menu-item'
                menuEle.innerHTML = menu.label
                menuEle.addEventListener('click', () => {
                    menu.click?.(e, target)
                    Tool.menuOverlay.setElement(undefined)

                })
                ele.appendChild(menuEle)
            })

            Tool.menuOverlay.setElement(ele)
            Tool.menuOverlay.setPosition(e.coordinate)
        }
    }
}