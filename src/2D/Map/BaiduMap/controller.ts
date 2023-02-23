import BaiduMap from './index'

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
}
