

import MapControllerConstraint from '../../MapConstraintClass/MapControllerConstraint'
import Tool from './Tool'
import OpenlayersMap from './index'

export default class OpenlayersMapController extends MapControllerConstraint {
    public instance!: OpenlayersMap
    public tool: Tool = Tool

    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.instance = new OpenlayersMap(container, center, zoom)
    }


    public point = {
        create: () => { },
        draw: () => { },
        createGather: () => { }
    }

}
