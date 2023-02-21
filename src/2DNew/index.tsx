import { useEffect } from 'react'
import './index.less'




export default function Map2D() {

    useEffect(() => {
        console.log(1111);

    }, [])



    return (
        <div className='map-2d'>
            <div id='map-2d'></div>
        </div>
    )
}


// import AirportIcon from './images/airport.png'
// import PortIcon from './images/port.png'

// MapUtil.create('map-2d', [104.06, 30.67])
// MapUtil.setOSMLayer()
// MapUtil.setGrid(true)
// MapUtil.setMousePos(true)
// MapUtil.setOverviewMap(true)
// MapUtil.setScaleLine(true)

// const AirPortController = new SimplePointController('airport')

// AirPortController.draw({
//     id: 1,
//     name: '成都测试机场',
//     coordinate: [104.06, 30.67],
//     options: { icon: { src: AirportIcon } }
// })

// AirPortController.draw({
//     id: 2,
//     name: '自定义toolTip',
//     coordinate: [105.06, 30.67],
//     options: {
//         icon: { src: AirportIcon },
//         toolTip: {
//             class: 'custom-toolTip',
//             text: `
//                 <div>自定义tooltip第一行</div>
//                 <div>自定义tooltip第二行</div>
//             `,
//         }
//     }

// })


// const PortController = new ComplexPointController('port')

// PortController.draw({
//     id: 3,
//     name: '右键单击菜单',
//     coordinate: [104.06, 31.67],
//     options: {
//         icon: { src: PortIcon },
//         events: {
//             contextmenuClick: {
//                 callback: () => console.log('同时触发了右键点击事件'),
//                 menus: [
//                     { label: '菜单1', event: (e: any, target: any) => console.log('点击了菜单1', e, target) },
//                     { label: '菜单2', event: (e: any, target: any) => console.log('点击了菜单2', e, target) },
//                 ],
//             }
//         }
//     }
// })

// PortController.draw({
//     id: 4,
//     name: '左键单击事件',
//     coordinate: [105.06, 31.67],
//     options: {
//         showHover: true,
//         icon: { src: PortIcon },
//         events: {
//             singleClick: () => console.log('点击了左键')
//         }
//     }

// })

// PortController.draw({
//     id: 5,
//     name: '左键单击菜单',
//     coordinate: [106.06, 31.67],
//     options: {
//         icon: { src: PortIcon },
//         toolTip: { show: false },
//         active: true,
//         events: {
//             singleClick: {
//                 callback: () => console.log('点击了左键的同时出现菜单'),
//                 menus: [
//                     { label: '菜单1', event: (e: any, target: any) => console.log('点击了菜单1', e, target) },
//                     { label: '菜单2', event: (e: any, target: any) => console.log('点击了菜单2', e, target) },
//                 ],
//             }
//         }
//     }
// })

// PortController.draw({
//     id: 6,
//     name: '左键双击菜单',
//     coordinate: [107.06, 31.67],
//     options: {
//         icon: { src: PortIcon },
//         toolTip: { show: false },
//         events: {
//             doubleClick: {
//                 callback: () => console.log('双击左键的同时出现菜单'),
//                 menus: [
//                     { label: '菜单1', event: (e: any, target: any) => console.log('点击了菜单1', e, target) },
//                     { label: '菜单2', event: (e: any, target: any) => console.log('点击了菜单2', e, target) },
//                 ],
//             }
//         }
//     }

// })
