

import MapControllerConstraint from '../../MapConstraintClass/MapControllerConstraint'
import Tool from './Tool'
import OpenlayersMap from './index'

import PointGather from './Point/gather'
import PointDraw from './Point/draw'
import Point from './Point/index'
import { PointType, SPLASHES_POINT_DEFAULT_LAYERNAME, DrawPointOptionsType } from './Point/constant'

import { DrawsOptionsType } from './Draws/constant'


export default class OpenlayersMapController extends MapControllerConstraint {
    public instance!: OpenlayersMap
    public tool: Tool = Tool

    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.instance = new OpenlayersMap(container, center, zoom)
    }

    /** 点的相关操作 */
    public point = {
        create: (point: PointType) => {
            const { layer = SPLASHES_POINT_DEFAULT_LAYERNAME } = point.options ?? {}
            let _point = {
                ...point,
                options: {
                    ...point.options,
                    layer
                }
            }
            return new Point(_point)
        },
        draw: {
            start: PointDraw.drawStart,
            end: PointDraw.drawEnd,
            change: PointDraw.drawChange,
        },
        createGather: (layerName: string, groupLayerName?: string) => {
            return new PointGather(layerName, groupLayerName)
        }
    }
}
