
import Draws from '../../Draws'
import { Polygon as OlPolygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

import { DrawType } from '../../Draws/constant'
import Utils from '@/Utils';
import { GeoDrawConstraint } from '@/2D/constraint';
import type { DrawPolygonOptionsType } from './constant'

export default abstract class DrawPolygon extends GeoDrawConstraint {
    private static instance: Draws
    /** 绘制上图 */
    public static drawStart = (options: DrawPolygonOptionsType, drawEndCallback: Function) => {
        const drawOptions = {
            ...options,
            type: 'Polygon' as DrawType,
        }

        this.instance = new Draws(drawOptions, drawEndCallback)
    }

    /** 绘制结束 */
    public static drawEnd = () => {
        this.instance?.destroy()
    }
    /** 中途更改 */
    public static drawChange = (coordinates: [number, number][]) => {
        if (Utils.isExist(this.instance.feature)) {
            this.instance.feature.setGeometry(new OlPolygon([coordinates.map(i => fromLonLat(i))]))
        } else {
            console.warn('请先调用 drawStart 方法,才能中途更新坐标')
        }
    }
}