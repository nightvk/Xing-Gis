import { useEffect } from 'react'
import MapUtil from './MapUtil'
import SimplePointController from './MapUtil/Controller/SimplePointController'

import AirportIcon from './images/airport.png'
import './index.less'


export default function Map2D() {

    useEffect(() => {
        MapUtil.create('map-2d', [104.06, 30.67])
        MapUtil.setOSMLayer()
        MapUtil.setGrid(true)
        MapUtil.setMousePos(true)
        MapUtil.setOverviewMap(true)
        MapUtil.setScaleLine(true)

        const AirPortController = new SimplePointController('airport')

        AirPortController.draw({
            id: 1,
            name: '成都测试机场',
            coordinate: [104.06, 30.67],
            options: { icon: { src: AirportIcon } }
        })

        AirPortController.draw({
            id: 2,
            name: '自定义toolTip',
            coordinate: [105.06, 30.67],
            options: {
                icon: { src: AirportIcon },
                toolTip: {
                    class: 'custom-toolTip',
                    text: `
                        <div>自定义tooltip第一行</div>
                        <div>自定义tooltip第二行</div>
                    `,
                }
            }

        })

    }, [])



    return (
        <div className='map-2d'>
            <div id='map-2d'></div>
        </div>
    )
}