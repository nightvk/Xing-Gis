import MapControllerConstraint from '../../MapConstraintClass/MapControllerConstraint'
import OpenlayersMap from './index'

export default class OpenlayersMapController extends MapControllerConstraint {
    protected instance!: OpenlayersMap
    constructor(container: HTMLElement, center: [number, number], zoom: number) {
        super()
        this.initMap(container, center, zoom);
    }

    protected initMap = (container: HTMLElement, center: [number, number], zoom: number) => {

        window.MapController = this
    }

    public getInstace = () => {
        return this.instance
    }

    public flayTo = (center: [number, number], zoom: number) => { }

    public destory = () => { }

    public createSimplePointGather = (layerName: string) => {

    }


    public createPoint = () => { };
    public drawPoint = () => { };
    public createPointGather = () => { };
    
    public createLine = () => { };
    public drawLine = () => { };
    public createLineGather = () => { };
    public createPolygon = () => { };
    public drawPolygon = () => { };
    public createPolygonGather = () => { };
    public createCircle = () => { };
    public drawCircle = () => { };
    public createCircleGather = () => { };
    public createSector = () => { };
    public drawSector = () => { };
    public createSectorGather = () => { };
    public createRectangle = () => { };
    public drawRectangle = () => { };
    public createRectangleGather = () => { };
}
