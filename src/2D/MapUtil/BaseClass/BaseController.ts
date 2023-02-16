
import { Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

/**
 * @desc 静态实例 控制器 基类
 * @desc 不允许 new,请继承此类后复写所有方法
 */
export default class BaseController {
    private layer: VectorLayer<VectorSource<Geometry>>
    private store: Map<string | number, any>

    constructor(layer: VectorLayer<VectorSource<Geometry>> | string) {
        console.error('静态实例控制器基类,不允许 new,请继承此类后复写所有方法')
        throw new Error('静态实例控制器基类,不允许 new,请继承此类后复写所有方法')
    }

    /**
     * @desc 绘制(新增+修改)
     */
    public draw: (param: Record<string, any>) => void;

    /**
     * @desc 删除
     */
    public remove: (id: string | number) => void

    /**
    * @desc 找值
    */
    public find: (id: string | number) => any

    /**
    * @desc 显示
    */
    public show: (id: string | number) => void

    /**
    * @desc 隐藏
    */
    public hidden: (id: string | number) => void

    /**
    * @desc 清空
    */
    public clear: () => void
}