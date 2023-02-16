
import { Geometry } from 'ol/geom'
import { Style } from 'ol/style'
import { Feature } from 'ol'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
/**
 * @desc 静态实例 构造器 基类
 * @desc 不允许 new,请继承此类后复写所有方法
 */
export default abstract class BaseStaticGeometry {

    public id: string | number
    public name: string
    public coordinates: any[] = []
    public feature: Feature<Geometry>

    /** 配置项 */
    private options: Record<string, any>


    constructor() {
        console.error('静态实例构造器基类,不允许 new,请继承此类后复写所有方法')
        throw new Error('静态实例构造器基类,不允许 new,请继承此类后复写所有方法')
    }

    /**
     * @desc 构建样式
     */
    private getStyle: () => Style;

    /**
     * @desc 添加至图层
     */

    public addToLayer: (layer: VectorLayer<VectorSource<Geometry>> | string) => void

    /**
    * @desc 构建初始实例
    */
    private initGeometry: () => void

    /**
     * @desc 显示
     */
    public show: () => void

    /**
    * @desc 隐藏
    */
    public hidden: () => void

    /**
     * @desc 更新
     */
    public update: (param: any) => any

    /**
     * @desc 删除
     */
    public remove: () => void
}