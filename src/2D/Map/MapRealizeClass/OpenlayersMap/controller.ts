

import OpenlayersTool from './Tool'
import OpenlayersMap from './index'
import { MapControllerConstraint } from '@/2D/constraint'

import PointGather from './Point/gather'
import PointDraw from './Point/draw'
import Point from './Point/index'
import { PointType, SPLASHES_POINT_DEFAULT_LAYERNAME } from './Point/constant'



export default class OpenlayersMapController implements MapControllerConstraint {
    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        this.instance = new OpenlayersMap(container, center, zoom)
    }

    public instance: OpenlayersMap
    public Tool: OpenlayersTool = OpenlayersTool

    /** 点的相关操作 */
    public Point = {
        create: (point: PointType) => new Point({
            ...point,
            options: {
                layer: SPLASHES_POINT_DEFAULT_LAYERNAME,
                ...point.options,
            }
        }),
        draw: {
            start: PointDraw.drawStart,
            end: PointDraw.drawEnd,
            change: PointDraw.drawChange,
        },
        createGather: (layerName: string, groupLayerName?: string) => new PointGather(layerName, groupLayerName)
    }
}
