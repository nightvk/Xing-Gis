
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { Style, Fill, Stroke, Text } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import MapBrowserEvent from 'ol/MapBrowserEvent';

import Layers from '../../Layers'
import Utils from '@/Utils'
import Tool from '../../Tool';

import type { GeoConstraint } from '@/2D/constraint'
import type { LineOptionsType, LineType } from './constant'
import type { GeometryEventType } from '../constant'
import type { LayerType } from '../../Layers/index'

/**
 * 线
 */
export default class Line implements GeoConstraint {
    public id: string | number = ''
    public name: string = ''
    public coordinate!: [number, number][]
    public feature: Feature<LineString> = new Feature()

    private options: LineOptionsType = {}
    private layer!: LayerType

    constructor(line: LineType) {
        const { id, name, coordinate, options } = line
        this.id = id ?? name ?? Utils.getUuid()
        this.name = name ?? id
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initLine()
    }


    /** 更新 */
    public update = (param: LineType) => {
        const { id, name, coordinate, options } = param
        this.id = id ?? name
        this.name = name
        this.coordinate = coordinate
        this.options = options ?? {}
        this.initLine()
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
    private initLine = () => {

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

        const geometry = new LineString(this.coordinate.map(i => fromLonLat(i)))
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
            this.feature.getGeometry()?.forEachSegment((start, end) => {
                styles.push(new Style({
                    geometry: new Point(end),
                    ...nodeStyle
                }))
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
                this.feature.getGeometry()?.forEachSegment((start, end) => {
                    styles.push(new Style({
                        geometry: new Point(end),
                        ...nodeStyle
                    }))
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

    const color = lineColor ?? stroke?.color ?? '#000000'

    let lineStyleOptions: Record<string, any> = {
        stroke: new Stroke({
            ...stroke,
            color,
            width: stroke?.width ?? 1,
        })
    }

    if (showName !== false) {
        lineStyleOptions.text = new Text({
            text: name,
            fill: new Fill({ color }),
            ...text,
        })
    }

    return new Style(lineStyleOptions)
}