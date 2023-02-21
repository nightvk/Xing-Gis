import { FeatureLike } from 'ol/Feature'
import MapBrowserEvent from 'ol/MapBrowserEvent'
import Utils from '@/Utils'
import Tool from '../Tool'


export type EventType = 'singleClick' | 'doubleClick' | 'pointerMoveIn' | 'pointerMoveOut' | 'contextmenuClick'

/**
 * @desc 地图事件
 */
export default abstract class Events {
    // 地图是否正在移动
    private static isMoveing = false

    // 通过像素拾取到的元素
    private static eventFeature: FeatureLike | undefined

    /**
     * @desc 地图事件初始化
     */
    public static init = () => {
        const map = Tool.get()

        map.on('click', Events.singleClick)
        map.on('dblclick', Events.doubleClick)
        map.on('pointermove', Events.pointerMoveIn)
        // @ts-ignore
        map.on('contextmenu', Events.contextmenuClick)
        map.on('movestart', () => {
            Events.isMoveing = true;
            Tool.menuOverlay.setElement(undefined)
        })
        map.on('moveend', () => { Events.isMoveing = false })
    }

    /**
     * @desc 清理
     */
    public static clear = () => {
        Events.isMoveing = false
        Events.eventFeature = undefined
    }

    /**
     * @desc 单击
     */
    private static singleClick = (e: MapBrowserEvent<any>) => {
        const feature = Tool.get().forEachFeatureAtPixel(e.pixel, f => f)
        Tool.menuOverlay.setElement(undefined)
        if (Utils.isExist(feature)) {
            const func = feature?.get('singleClick')
            const source = feature?.get('source') ?? {}
            func?.(e, source)
        }
    }

    /**
     * @desc 双击
     */
    private static doubleClick = (e: MapBrowserEvent<any>) => {
        const feature = Tool.get().forEachFeatureAtPixel(e.pixel, f => f)
        if (Utils.isExist(feature)) {
            const func = feature?.get('doubleClick')
            const source = feature?.get('source') ?? {}
            func?.(e, source)
        }
    }

    /**
     * @desc 右键
     */
    private static contextmenuClick = (e: MapBrowserEvent<any>) => {
        e.originalEvent?.stopPropagation()
        e.originalEvent?.preventDefault()
        Tool.menuOverlay.setElement(undefined)
        const feature = Tool.get().forEachFeatureAtPixel(e.pixel, f => f)

        if (Utils.isExist(feature)) {
            const func = feature?.get('contextmenuClick')
            const source = feature?.get('source') ?? {}
            func?.(e, source)
        }
    }
    /**
     * @desc 移入
     */
    private static pointerMoveIn = (e: MapBrowserEvent<any>) => {
        if (Events.isMoveing === true) {
            return false;
        }
        const map = Tool.get()
        const feature = map.forEachFeatureAtPixel(e.pixel, f => f)
        const mapEle = map.getTargetElement()

        Events.pointerMoveOut(e)

        if (Utils.isExist(feature)) {
            mapEle.style.cursor = 'pointer'
            Events.eventFeature = feature
            const func = feature?.get('pointerMoveIn')
            const source = feature?.get('source') ?? {}
            func?.(e, source)
        }
        else {
            mapEle.style.cursor = ''
        }

    }
    /**
     * @desc 移出
     */
    private static pointerMoveOut = (e: MapBrowserEvent<any>) => {
        if (Utils.isExist(Events.eventFeature)) {
            const func = Events.eventFeature?.get('pointerMoveOut')
            const source = Events.eventFeature?.get('source')
            func?.(e, source)
            Events.eventFeature = undefined
        }
    }
}