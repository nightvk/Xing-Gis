
import { Feature } from 'ol'
import { Polygon as OlPolygon, Point } from 'ol/geom'
import { Style, Fill, Stroke, Text, Icon, Circle } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import MapBrowserEvent from 'ol/MapBrowserEvent';

import Layers from '../../Layers'
import Utils from '@/Utils'
import Tool from '../../Tool';

import type { GeoConstraint } from '@/2D/constraint'
import type { PolygonOptionsType, PolygonType } from './constant'
import type { GeometryEventType } from '../constant'
import type { LayerType } from '../../Layers/index'

/**
 * 线
 */
export default class Polygon implements GeoConstraint {
    public id: string | number = ''
    public name: string = ''
    public coordinate!: [number, number][]
    public feature: Feature<OlPolygon> = new Feature()

    private options: PolygonOptionsType = {}
    private layer!: LayerType

    constructor(polygon: PolygonType) {
        const { id, name, coordinate, options } = polygon
        this.id = id ?? name ?? Utils.getUuid()
        this.name = name ?? id
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initPolygon()
    }


    /** 更新 */
    public update = (param: PolygonType) => {
        const { id, name, coordinate, options } = param
        this.id = id ?? name
        this.name = name
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initPolygon()
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
        this.feature.setStyle(this.getActiveStyle())
    }

    /** 显示 */
    public show = () => {
        this.feature.setStyle(this.getStyle())
    }

    /** 隐藏 */
    public hidden = () => {
        this.feature.setStyle(new Style())
    }

    /**  移入事件   */
    private pointerMoveIn = (e: MapBrowserEvent<any>, source: Record<string, any>) => {
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
            this.feature.setStyle(this.getActiveStyle())
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
    private initPolygon = () => {

        // 图层初始化
        const layer = this.options.layer
        if (Utils.isExist(layer)) {
            const _layer = typeof layer === 'string' ? Layers.create(layer) : layer
            this.layer = _layer
        }

        // 删除旧实例
        const source = this.layer?.getSource()
        const oldFeature = source?.getFeatureById(this.id)
        if (Utils.isExist(oldFeature)) {
            source?.removeFeature(oldFeature)
        }

        const geometry = new OlPolygon([this.coordinate.map(i => fromLonLat(i))])
        this.feature.setGeometry(geometry)
        this.feature.setStyle(this.getStyle())
        this.feature.setId(this.id)
        this.feature.set('source', this.options.source)
        this.feature.set('pointerMoveIn', this.pointerMoveIn)
        this.feature.set('pointerMoveOut', this.pointerMoveOut)
        this.feature.set('singleClick', this.singleClick)
        this.feature.set('doubleClick', this.doubleClick)
        this.feature.set('contextmenuClick', this.contextmenuClick)

        this.layer?.getSource()?.addFeature(this.feature)
    }

    /** 样式构建 lineStyle  nodeStyle */
    private getStyle = (): Style[] => {
        const { lineStyle, nodeStyle, active = false, showName = false } = this.options

        if (active === true) {
            return this.getActiveStyle()
        }

        let styles: Style[] = []

        // 线的样式
        styles.push(getBaseLineStyle({
            lineStyle,
            name: this.name,
            showName
        }))

        // 节点样式
        if (Utils.isExist(nodeStyle)) {
            this.coordinate.forEach(i => {
                styles.push(getNodeStyle(nodeStyle, new Point(fromLonLat(i))))
            })
        }

        return styles
    }

    /** 激活样式 */
    private getActiveStyle = (): Style[] => {
        const { activeStyle, lineStyle, showName = false } = this.options

        const defaultActiveLineParam: any = {
            lineStyle,
            name: this.name,
            showName,
            lineColor: 'red'
        }

        // activeStyle不存在 返回默认的激活样式
        if (Utils.isNotExist(activeStyle)) {
            return [getBaseLineStyle(defaultActiveLineParam)]
        }

        // activeStyle存在 使用传入的样式
        else {
            let styles: Style[] = []

            const { lineStyle, nodeStyle } = activeStyle!

            defaultActiveLineParam.lineStyle = lineStyle
            styles.push(getBaseLineStyle({
                ...defaultActiveLineParam,
                lineColor: lineStyle?.stroke?.color ?? 'red'
            }))

            // 节点样式
            if (Utils.isExist(nodeStyle)) {
                this.coordinate.forEach(i => {
                    styles.push(getNodeStyle(nodeStyle, new Point(i)))
                })
            }

            return styles
        }
    }
}


/** 单击双击右键的事件生成函数 */
const generateEventFunc = (event: GeometryEventType | undefined, e: MapBrowserEvent<any>, target: Record<string, any>) => {
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


// 构建线的基本样式
const getBaseLineStyle = (param: {
    lineStyle: any,
    name: string,
    showName: boolean,
    lineColor?: any// 直接指定线的颜色
}) => {
    const { lineStyle, name, lineColor, showName } = param
    const stroke = lineStyle?.stroke
    const text = lineStyle?.text
    const fill = lineStyle?.fill ?? 'rgba(255,255,255,0.1)'

    const color = lineColor ?? stroke?.color ?? '#000000'

    let lineStyleOptions: Record<string, any> = {
        fill: new Fill({ color: fill }),
        stroke: new Stroke({
            ...stroke,
            color,
            width: stroke?.width ?? 1,
        })
    }

    if (showName !== false) {
        lineStyleOptions.text = new Text({
            text: name,
            ...text,
            fill: new Fill({ color: text?.fill ?? color }),
        })
    }

    return new Style(lineStyleOptions)
}

// 构建节点的基本样式
const getNodeStyle = (nodeStyle: any, geometry: any): Style => {
    const { style, circle, icon } = nodeStyle
    if (Utils.isExist(style)) {
        style as Style
        style.setGeometry(geometry)
        return style
    }
    else if (Utils.isExist(icon)) {
        return new Style({
            geometry,
            image: new Icon({ ...icon }),
        })
    }
    else {// 默认画圆
        const { fill, stroke, radius = 4 } = circle ?? {}
        return new Style({
            geometry,
            image: new Circle({
                ...circle,
                fill: new Fill({ color: fill ?? 'red' }),
                stroke: new Stroke({ ...(stroke ?? {}) }),
                radius
            }),
        })
    }
}