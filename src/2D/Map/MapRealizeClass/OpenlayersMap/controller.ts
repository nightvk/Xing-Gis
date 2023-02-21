

import MapControllerConstraint from '../../MapConstraintClass/MapControllerConstraint'
import Tool from './Tool'
import OpenlayersMap from './index'

import PointGather from './Point/gather'
import PointDraw from './Point/draw'
import Point from './Point/index'
import { PointType, SPLASHES_POINT_DEFAULT_LAYERNAME } from './Point/constant'


export default class OpenlayersMapController extends MapControllerConstraint {
    public instance!: OpenlayersMap
    public tool: Tool = Tool

    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.instance = new OpenlayersMap(container, center, zoom)
    }


    public point = {
        create: (point: PointType) => {
            let _point = {
                ...point,
                options: {
                    ...point.options,
                    layer: point.options?.layer ?? SPLASHES_POINT_DEFAULT_LAYERNAME
                }
            }
            return new Point(_point)
        },
        draw: () => { },
        createGather: (layerName: string, groupLayerName?: string) => { return new PointGather(layerName, groupLayerName) }
    }
}
