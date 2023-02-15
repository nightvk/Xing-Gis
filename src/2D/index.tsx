import { useEffect } from 'react'
import MapUtil from './MapUtil'

import './index.less'

export default function Map2D() {

    useEffect(() => {
        MapUtil.create('map-2d', [104.06, 30.67])
        MapUtil.setOSMLayer()
        MapUtil.setGrid(true)
        MapUtil.setMousePos(true)
        MapUtil.setOverviewMap(true)
        MapUtil.setScaleLine(true)
    }, [])



    return (
        <div className='map-2d'>
            <div id='map-2d'></div>
        </div>
    )
}