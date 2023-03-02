

import OpenlayersTool from './Tool'
import OpenlayersMap from './index'
import { MapControllerConstraint } from '@/2D/constraint'

import PointGather from './Geometry/Point/gather'
import PointDraw from './Geometry/Point/draw'
import Point from './Geometry/Point/index'
import { PointType, SPLASHES_POINT_DEFAULT_LAYERNAME } from './Geometry/Point/constant'

import LineGather from './Geometry/Line/gather'
import LineDraw from './Geometry/Line/draw'
import Line from './Geometry/Line/index'
import { LineType, SPLASHES_LINE_DEFAULT_LAYERNAME } from './Geometry/Line/constant'

import PolygonGather from './Geometry/Polygon/gather'
import PolygonDraw from './Geometry/Polygon/draw'
import Polygon from './Geometry/Polygon/index'
import { PolygonType, SPLASHES_POLYGON_DEFAULT_LAYERNAME } from './Geometry/Polygon/constant'

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

    /** 线的相关操作 */
    public Line = {
        create: (line: LineType) => new Line({
            ...line,
            options: {
                layer: SPLASHES_LINE_DEFAULT_LAYERNAME,
                ...line.options,
            }
        }),
        draw: {
            start: LineDraw.drawStart,
            end: LineDraw.drawEnd,
            change: LineDraw.drawChange,
        },
        createGather: (layerName: string, groupLayerName?: string) => new LineGather(layerName, groupLayerName)
    }

    /** 多边形的相关操作 */
    public Polygon = {
        create: (polygon: PolygonType) => new Polygon({
            ...polygon,
            options: {
                layer: SPLASHES_POLYGON_DEFAULT_LAYERNAME,
                ...polygon.options,
            }
        }),
        draw: {
            start: PolygonDraw.drawStart,
            end: PolygonDraw.drawEnd,
            change: PolygonDraw.drawChange,
        },
        createGather: (layerName: string, groupLayerName?: string) => new PolygonGather(layerName, groupLayerName)
    }
}
