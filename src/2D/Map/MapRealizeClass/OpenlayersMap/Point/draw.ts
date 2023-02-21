
import Draws from '../Draws'
import { DrawPointOptionsType } from './constant'

import { DrawType } from '../Draws/constant'

export default abstract class DrawPoint {
    /** 绘制上图 */
    public static draw = (options: DrawPointOptionsType, drawEndCallback: Function) => {
        const drawOptions = {
            ...options,
            type: 'Point' as DrawType,
        }

        const DrawInstance = new Draws(drawOptions, drawEndCallback)
    }
}