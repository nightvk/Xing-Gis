import GroupLayer, { Options } from 'ol/layer/Group';
import Tool from '../Tool';

/** 图层组 */
export default class LayerGroups {
    private static store: Map<string, GroupLayer> = new Map();

    /** 通过分组名称创建分组 */
    public static create = (name: string, config?: Options): GroupLayer => {
        if (this.store.has(name)) return this.store.get(name)!
        else {
            const layerGroup = new GroupLayer({
                ...config,
                zIndex: 0,
                layers: [],
            });

            layerGroup.set('name', name);
            this.store.set(name, layerGroup)
            Tool.get().addLayer(layerGroup);

            return layerGroup
        }
    }

    /** 称移所有分组 */
    public static clear = () => {
        const map = Tool.get()
        this.store.forEach(map.removeLayer)
        this.store.clear()
    }

    /** 通过分组名称移除分组 */
    public static remove = (name: string) => {
        const map = Tool.get()

        if (this.store.has(name)) {
            map.removeLayer(this.store.get(name)!)
            this.store.delete(name)
        }
    }

    /** 通过分组名称查找分组 */
    public static find = (name: string) => {
        return this.store.get(name)
    }

    /** 显示分组 */
    public static show = (name: string) => {
        this.store.get(name)?.setVisible(true)
    }

    /** 隐藏分组 */
    public static hidden = (name: string) => {
        this.store.get(name)?.setVisible(false)
    }
}