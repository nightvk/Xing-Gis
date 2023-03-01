
import Draws from '../../Draws'
import { LineString } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

import { DrawType } from '../../Draws/constant'
import Utils from '@/Utils';
import { GeoDrawConstraint } from '@/2D/constraint';
import type { DrawLineOptionsType } from './constant'

export default abstract class DrawPoint extends GeoDrawConstraint {
    private static instance: Draws
    /** 绘制上图 */
    public static drawStart = (options: DrawLineOptionsType, drawEndCallback: Function) => {
        const drawOptions = {
            ...options,
            type: 'LineString' as DrawType,
        }

        const DrawInstance = new Draws(drawOptions, drawEndCallback)

        this.instance = DrawInstance
    }

    /** 绘制结束 */
    public static drawEnd = () => {
        this.instance?.destroy()
    }
    /** 中途更改 */
    public static drawChange = (coordinates: [number, number][]) => {
        if (Utils.isExist(this.instance.feature)) {
            this.instance.feature.setGeometry(new LineString(coordinates.map(i => fromLonLat(i))))
        } else {
            console.warn('请先调用 drawStart 方法,才能中途更新坐标')
        }
    }
}