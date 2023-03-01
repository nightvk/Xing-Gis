import BaiduMap from './index'
import {MapControllerConstraint} from '@/2D/constraint'

export default class BaiduMapController implements MapControllerConstraint {

    public instance!: BaiduMap
    public Tool: any

    constructor(container: HTMLElement, center: [number, number], zoom: number) {

    }

    public Point = {
        create: () => { },
        createGather: () => { },
        draw: {
            start: () => { },
            end: () => { },
            change: () => { },
        },
    }
    public Line = {
        create: () => { },
        createGather: () => { },
        draw: {
            start: () => { },
            end: () => { },
            change: () => { },
        },
    } 
}
