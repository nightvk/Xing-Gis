import { Collection, Feature } from 'ol';
import { Fill, Stroke, Style, Circle as CircleStyle, Text, Icon, } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { createBox, createRegularPolygon } from 'ol/interaction/Draw';
import { Coordinate } from 'ol/coordinate';
import { Circle as CircleGeo, LineString, Point, Polygon, Geometry } from 'ol/geom';

import {
    DRAW_DEFAULT_LAYERNAME,
    SNAP_DEFAULT_LAYERNAME,
    MODIFY_DEFAULT_LAYERNAME,
    DrawsOptionsType, DrawType
} from './constant'
import Layers, { LayerType } from '../Layers';
import { toLonLat, fromLonLat } from 'ol/proj';

import Utils from '@/Utils';
import Tool from '../Tool';


type CoordinateType = Coordinate | Coordinate[] | Coordinate[][]

/**
 * 几何图形绘制类
 */
export default class Draws {
    /** 绘制类型 */
    public type: DrawType
    /** 配置项 */
    public options: DrawsOptionsType
    /** 绘制完成的回调 */
    private drawEndCallback: Function


    /** 绘制器 */
    public interaction!: Draw
    private interactionLayer: LayerType
    /** 修改器 */
    public modify!: Modify
    private modifyLayer!: LayerType
    /** 吸附对齐 */
    public snap!: Snap
    private snapLayer!: LayerType

    /** 实例 */
    public feature: Feature

    /** 绘制的坐标 */
    private coordinates: CoordinateType = [0, 0]


    constructor(options: DrawsOptionsType, drawEndCallback?: Function) {
        const _options: DrawsOptionsType = {
            layer: DRAW_DEFAULT_LAYERNAME,
            ...options,
        }
        this.options = _options
        this.interactionLayer = Layers.create(this.options.layer ?? DRAW_DEFAULT_LAYERNAME)
        this.type = this.options.type

        this.drawEndCallback = drawEndCallback ?? Utils.emptyFunc

        this.feature = new Feature()

        this.initSnap()
        this.initModify()
        this.initInteraction()
    }

    /** 初始化修改器 */
    private initModify = () => {
        this.modifyLayer = Layers.create(MODIFY_DEFAULT_LAYERNAME)
        const modify = new Modify({
            source: this.modifyLayer.getSource()!,
            insertVertexCondition: () => this.type !== 'Arrow'
        })

        modify.on('modifyend', evt => {
            const feature = evt.features.item(0);
            const geo = feature.getGeometry();
            if (geo instanceof CircleGeo) {
                this.options = {
                    ...this.options,
                    center: geo.getCenter(),
                    radius: geo.getRadius()
                }
            } else if (
                geo instanceof LineString ||
                geo instanceof Point ||
                geo instanceof Polygon
            ) {
                this.coordinates = geo?.getCoordinates();
                this.drawEndCallback?.(this.getDrawInfo())
            }
        })
        this.modify = modify

        Tool.get().addInteraction(modify)

    }

    /** 初始化吸附 */
    private initSnap = () => {
        this.snapLayer = Layers.create(SNAP_DEFAULT_LAYERNAME)
        this.snap = new Snap({
            source: this.snapLayer.getSource()!,
        })
        Tool.get().addInteraction(this.snap)
    }

    /** 初始化绘制器 */
    private initInteraction = () => {
        let type = this.type
        let geometryFunction;
        let maxPoints = 100;

        if (type === 'Square') {
            this.type = 'Circle';
            geometryFunction = createRegularPolygon(4);
        }
        if (type === 'Rectangle') {
            this.type = 'Circle';
            geometryFunction = createBox();
        }
        if (type === 'Arrow') {
            this.type = 'LineString';
            maxPoints = 2;
        }

        const map = Tool.get()

        this.interaction = new Draw({
            source: this.interactionLayer.getSource()!,
            // @ts-ignore 这里的 type 需要转换成openlayers需要的原始 Type 类型
            type,
            style: getInteractionDefaultStyle(this.options),
            maxPoints,
            geometryFunction,
        });
        this.interaction.setMap(map)
        map.addInteraction(this.interaction)

        // 存在初始坐标的情况下,初始化实例
        if (Utils.isExist(this.options?.initCoordinates)) {
            setTimeout(() => {
                let geometry: Geometry
                const coordinates = this.options.initCoordinates!

                if (this.type === 'Point') {
                    geometry = new Point(fromLonLat(coordinates[0]))
                }
                if (this.type === 'LineString') {
                    geometry = new LineString(coordinates.map(i => fromLonLat(i)))
                }
                if (this.type === 'Polygon') {
                    geometry = new Polygon([coordinates.map(i => fromLonLat(i))])
                }

                this.drawEndEvt({ feature: new Feature({ geometry: geometry! }) })

            }, 0)
        }

        this.interaction.on('drawend', this.drawEndEvt)
    }


    /** 绘制结束回调 */
    private drawEndEvt = (evt: any) => {
        const geo = evt?.feature?.getGeometry()
        if (!Utils.isExist(geo)) return

        const map = Tool.get()
        map.removeInteraction(this.interaction)

        let coordinates: CoordinateType = [];

        if (geo instanceof CircleGeo) {
            this.options = {
                ...this.options,
                center: geo?.getCenter(),
                radius: geo?.getRadius()
            }
        }
        // 将坐标统一成 [[number,number]] 格式,方便上层应用使用
        else if (geo instanceof Point) {
            this.coordinates = [geo?.getCoordinates()]
        } else if (geo instanceof LineString) {
            this.coordinates = geo?.getCoordinates()
        } else if (geo instanceof Polygon) {
            this.coordinates = geo?.getCoordinates()?.[0]
        }

        let style: Style[] =
            Utils.isFunction(this.options.drawEndStyle) ?
                [this.options.drawEndStyle()].flat() :
                getDrawEndDefauleStyle(this.options)

        if (this.type === 'Arrow') {
            style.push(getArrowStyle(coordinates as Coordinate[], this.options))
        }

        this.feature = evt.feature
        this.feature.setStyle(style)

        this.feature.on('change', (evt) => {
            if (this.type === 'Arrow') {
                this.changeStyle(evt.target.getGeometry().getCoordinates());
            }
        })

        this.modifyLayer.getSource()?.clear()
        this.modifyLayer.getSource()?.addFeature(this.feature)

        this.snapLayer.getSource()?.clear()
        this.snapLayer.getSource()?.addFeature(this.feature)

        this.drawEndCallback?.(this.getDrawInfo())
    }


    /** 箭头样式改变回调 */
    private changeStyle = (coordinates: Coordinate[]) => {
        const style = this.feature.getStyle();
        if (Array.isArray(style)) {
            const s = style[1];

            const geo = s.getGeometry();
            if (geo instanceof Point) {
                const start: any = coordinates![0];
                const end: any = coordinates![1];
                geo.setCoordinates(end);

                const rotation = calcuRotation(start, end);
                s.getImage().setRotation(-rotation);
            }
        }
    };

    /** 销毁 */
    public destroy = () => {
        this.drawEndCallback = Utils.emptyFunc
        Tool.get().removeInteraction(this.interaction)
        Tool.get().removeInteraction(this.modify)
        Tool.get().removeInteraction(this.snap)

        this.interactionLayer.dispose()
        this.modifyLayer.dispose()
        this.snapLayer.dispose()
    }
    /** 获取绘制图形的信息 */
    public getDrawInfo = () => {
        const { name, center, radius } = this.options
        let coordinates: any = [];
        const isDeep = this.coordinates?.some((co) => co instanceof Array);
        if (!isDeep) {
            if (Boolean(this.coordinates)) coordinates = toLonLat(this.coordinates as Coordinate);
        } else {
            const tmpArr = this.coordinates as Coordinate[] | Coordinate[][];

            coordinates = tmpArr?.map((co) => {
                const isTwoDeep = co.some((c) => c instanceof Array);
                if (!isTwoDeep) {
                    return toLonLat(co as Coordinate);
                } else {
                    return co.map((c) => toLonLat(c as Coordinate));
                }
            });
        }
        return {
            coordinates,
            name,
            center,
            radius,
        };


    }
}


/** 获取绘制器默认样式 */
const getInteractionDefaultStyle = (options: DrawsOptionsType): Style[] => {
    const {
        lineType,
        pointerStyle,
    } = options

    let pointer: Style
    let line: Style

    // 绘制时点的样式
    if (Utils.isExist(pointerStyle)) {
        pointerStyle!
        if (Utils.isExist(pointerStyle.style)) {
            pointer = pointerStyle.style;
        }

        if (Utils.isExist(pointerStyle.icon)) {
            pointer = new Style({
                image: new Icon({ ...pointerStyle.icon })
            })
        }

        if (Utils.isExist(pointerStyle.circle)) {
            const { fill, stroke, radius = 4 } = pointerStyle.circle ?? {}
            pointer = new Style({
                image: new CircleStyle({
                    ...pointerStyle.circle,
                    fill: new Fill({ color: fill ?? 'red' }),
                    stroke: new Stroke({ ...(stroke ?? {}) }),
                    radius
                })
            })
        }
    } else {
        pointer = new Style({
            image: new CircleStyle({
                radius: 6,
                stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.7)', }),
                fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)', }),
            })
        })
    }

    // 绘制时线条的样式
    let strokeOptions: any = {
        color: 'rgba(255, 255, 255, 0.5)',
        width: 1,
    }

    if (lineType === 'dash') {
        strokeOptions.lineDash = [10, 10]
    }
    line = new Style({
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)', }),
        stroke: new Stroke(strokeOptions),
    })


    return [pointer!, line]
}

/** 获取绘制结束时显示在地图上的默认样式 */
const getDrawEndDefauleStyle = (options: DrawsOptionsType): Style[] => {
    const {
        fillColor = 'rgba(255,204,51,0.2)',
        strokeColor = 'rgba(255,204,51,0.8)',
        strokeWidth = 1,
        lineType,
        name,
        type,
    } = options

    let styleOptions: Record<string, any> = {}

    if (Utils.isExist(name)) {
        styleOptions.text = new Text({
            text: name,
            fill: new Fill({ color: fillColor }),
            font: '16px sans-serif',
        })
    }

    // 点显示的默认样式
    if (type === 'Point') {
        styleOptions.image = new CircleStyle({
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor }),
            radius: 5,
        })
    }

    // 线显示的默认样式
    if (
        type === 'LineString' ||
        type === 'Polygon'

    ) {
        let strokeOptions: Record<string, any> = {
            width: strokeWidth,
            color: strokeColor
        }
        if (lineType === 'dash') {
            strokeOptions.lineDash = [10, 10]
        }

        styleOptions.stroke = new Stroke(strokeOptions)
    }

    return [new Style(styleOptions)]
}


/** 绘制为箭头时的样式 */
const getArrowStyle = (coordinates: Coordinate[], options: DrawsOptionsType): Style => {
    const start = coordinates[0];
    const end = coordinates[1];
    const rotation = calcuRotation(start, end);
    return new Style({
        geometry: new Point(end),
        image: new Icon({
            src: 'assets/images/arrow.png',
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: -rotation,
            color: options?.fillColor ?? 'rgba(255,204,51,0.8)',
        }),
    })
}

/** 计算箭头需要旋转的角度 */
const calcuRotation = (start: Coordinate, end: Coordinate) => {
    let dx = end[0] - start[0];
    let dy = end[1] - start[1];
    let rotation = Math.atan2(dy, dx);
    return rotation;
};