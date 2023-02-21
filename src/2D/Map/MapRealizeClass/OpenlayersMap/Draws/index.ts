import { Collection, Feature } from 'ol';
import { Fill, Stroke, Style, Circle as CircleStyle, Text, Icon, } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { createBox, createRegularPolygon } from 'ol/interaction/Draw';

import { DRAW_DEFAULT_LAYERNAME, DrawsOptionsType, DrawType } from './constant'
import { LayerType } from '../Layers'
import Layers from '../Layers';

import Utils from '@/Utils';
import Tool from '../Tool';

export default class Draws {
    /** 绘制到具体的图层 */
    public layer: LayerType
    /** 绘制类型 */
    public type: DrawType
    /** 配置项 */
    public options: DrawsOptionsType
    /** 绘制完成的回调 */
    private drawEndCallback: Function


    /** 绘制器 */
    public interaction!: Draw
    /** 修改器 */
    public modify!: Modify
    /** 吸附对齐 */
    public snap!: Snap
    /** 实例 */
    public feature!: Feature


    constructor(options: DrawsOptionsType, drawEndCallback: Function) {
        const _options: DrawsOptionsType = {
            layer: DRAW_DEFAULT_LAYERNAME,
            ...options,
        }
        this.options = _options
        this.layer = Layers.create(this.options.layer!)
        this.type = this.options.type

        this.drawEndCallback = drawEndCallback

        this.initInteraction()
    }


    /** 初始化绘制器 */
    public initInteraction = () => {
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

        const draw = new Draw({
            source: this.layer.getSource()!,
            // @ts-ignore
            type,
            style: this.options.style ?? this.getInteractionDefaultStyle(),
            maxPoints,
            geometryFunction,
        });

        draw.setMap(map)
        map.addInteraction(draw)
        this.interaction = draw;
        this.interactionEventBind()

        if (Utils.isExist(this.options?.initCoordinates)) {
            draw.appendCoordinates(this.options.initCoordinates)
            draw.finishDrawing()
        }

    }

    /** 销毁 */
    public destroy = () => {

    }


    /** 初始化修改器 */
    private initModify = () => {

    }
    /** 初始化吸附对齐 */
    private initSnap = () => {

    }

    /** 获取绘制器默认样式 */
    private getInteractionDefaultStyle = (): Style => {
        let strokeOptions: any = {
            color: 'rgba(255, 255, 255, 0.5)',
            width: 2,
        }

        if (this.options.lineType === 'dash') {
            strokeOptions.lineDash = [10, 10]
        }

        return new Style({
            fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)', }),
            stroke: new Stroke(strokeOptions),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.7)', }),
                fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)', }),
            }),
        })
    }

    /** 绘制器事件绑定 */
    private interactionEventBind = () => {

    }
}