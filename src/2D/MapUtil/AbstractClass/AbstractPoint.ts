/**
 * @desc 抽象类 点
 */

export default abstract class AbstractPoint {
    /** 唯一id */
    public abstract id: string | number
    /** 名称 */
    public abstract name: string
    /** 坐标 */
    public abstract coordinate: [number, number]
    /** 实例 */
    public abstract feature: any

    /** 配置项 */
    protected abstract options: Record<string, any>
    /** 图层 */
    protected abstract layer: any

    /** 显示 */
    public abstract show: Function
    /** 隐藏  */
    public abstract hidden: Function
    /** 删除 */
    public abstract remove: Function
    /** 更新 */
    public abstract update: Function
}