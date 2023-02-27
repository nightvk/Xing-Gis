import { useState } from 'react'
import { Button, message, Select, Menu, Dropdown } from 'antd'
import './index.less'


import MapControllerGenerator2D from '../2D/ControllerGenerator'
import type { MapControllerRes } from '../2D/ControllerGenerator/constant'

import Utils from '@/Utils'

import AirportIcon from '../2D/images/airport.png'
import PointGather from '../2D/Map/OpenlayersMap/Point/gather'


let airportGather: PointGather

type modeType = '2D' | '3D'

function App() {
  const [mode, setMode] = useState<modeType>('2D')
  const [MapController, setMapController] = useState<MapControllerRes<MapType>>()

  /** 初始化地图 */
  const initMap = (type: MapType) => {
    if (mode === '2D') {
      if (MapController) MapController.Tool.destroy()
      setMapController(MapControllerGenerator2D.createMapController(type, document.getElementById('map-2d')!))
    }
    else if (mode === '3D') {

    }
  }

  /** 地图工具 */
  const MapTool: Record<string, Function> = {
    /** 设置网格线 */
    setGrid: () => {
      MapController!.Tool?.setGrid(true)
    },

    /** 显示指针经纬度 */
    setMousePos: () => {
      MapController!.Tool?.setMousePos(true)
    },
    /** 显示鸟瞰图 */
    setOverviewMap: () => {
      MapController!.Tool?.setOverviewMap(true)
    },
    /** 显示比例尺 */
    setScaleLine: () => {
      MapController!.Tool?.setScaleLine(true)
    },
    /** 移动 */
    flayTo: () => {
      MapController!.Tool?.flayTo([116.38, 39.3], 8)
    },
  }

  /** 点操作 */
  const pointAction: Record<string, Function> = {
    basicScatter: () => {
      const { create } = MapController!.Point
      const coordinate: Coordinate2D = [103.06, 30.67]

      create({
        id: 9,
        name: '散点',
        coordinate,
        // options: { circle: { radius: 12, fill: { color: 'red' }, } }
      })
      MapController!.Tool.flayTo(coordinate)
    },
    iconPoint: () => {
      const { create } = MapController!.Point
      const coordinate: Coordinate2D = [104.06, 30.67]

      create({
        id: 9,
        name: '散点',
        coordinate,
        options: {
          icon: { src: AirportIcon }
          // 自定义样式点 此处传入 style ： Style 可自定义点的样式 
        }
      })
      MapController!.Tool.flayTo(coordinate)
    },
    gatherAdd: () => {

      airportGather = MapController!.Point.createGather('airports')!

      const coordinate: Coordinate2D = [103.06, 29.67]

      airportGather.draw({
        id: 1,
        name: '点集-点1',
        coordinate,
        options: { icon: { src: AirportIcon } }
      })

      MapController!.Tool.flayTo(coordinate)
    },
    gatherEdit: () => {
      const coordinate: Coordinate2D = [103.06, 29.67]

      airportGather.draw({
        id: 1,// 只要id一致,即是修改
        name: '点集-点1-修改',
        coordinate,
        options: { icon: { src: AirportIcon } }
      })
    },
    gatherRemove: () => {
      airportGather.remove(1)
    },
    gatherClear: () => {
      airportGather.clear()
    },
    gatherShow: () => {
      airportGather.show(1)
    },
    gatherHidden: () => {
      airportGather.hidden(1)
    },
    drawPoint: () => {
      const { start } = MapController!.Point.draw
      start({}, (e: any) => {
        console.log('e', e)
      })
    },
    drawInitPoint: () => {
      const { start } = MapController!.Point.draw
      start({
        initCoordinates: [[0, 0]],
      }, (e: any) => {
        console.log('e', e)
      })
    },
    drawIconPoint: () => {
      const { start } = MapController!.Point.draw
      start({
        pointerStyle: { icon: { src: AirportIcon } },
        drawEndStyle: { icon: { src: AirportIcon } },
      }, (e: any) => {
        console.log('e', e)
      })
    },
    drawChangePoint: () => {
      const { change } = MapController!.Point.draw
      change([1, 1])
    },
    drawend: () => {
      const { end } = MapController!.Point.draw
      end()
    },
    pointTooltip: () => {
      const { create } = MapController!.Point
      const coordinate: Coordinate2D = [108.06, 30.67]

      create({
        id: 9,
        name: '自定义tooltip',
        coordinate,
        options: {
          icon: { src: AirportIcon },
          toolTip: {
            className: 'custom-toolTip',
            show: true, // 默认为true
            text: `
              <div>自定义第一行</div>
              <div>自定义第二行</div>
            `
          }
        }
      })
      MapController!.Tool.flayTo(coordinate)
    },
    pointmenu: () => {
      const { create } = MapController!.Point
      const coordinate: Coordinate2D = [109.06, 30.67]

      create({
        id: 9,
        name: '菜单',
        coordinate,
        options: {
          icon: { src: AirportIcon },
          events: {
            // doubleClick
            // contextmenuClick
            singleClick: {
              className: '菜单类名',
              menus: [
                { label: '菜单1', click: () => { } },
                { label: '菜单2', click: () => { } },
              ]
            }
          }
        }
      })
      MapController!.Tool.flayTo(coordinate)
    },
  }


  return (
    <div className="App">

      {mode === '2D' && <div id='map-2d'></div>}
      {mode === '3D' && <div id='map-3d'>map3d</div>}
      <div className='map-action'>
        <Select
          value={mode}
          onChange={setMode}
          options={[
            { label: '2D', value: '2D' },
            { label: '3D', value: '3D' },
          ]}
        />
        <Select
          placeholder='请初始化地图'
          onChange={initMap}
          options={[
            { label: 'baidu地图', value: 'baidu' as MapType },
            { label: 'openlayers地图', value: 'openlayers' as MapType },
          ]}
        />
        {/* 地图工具 */}
        <Dropdown
          menu={{
            items: [
              { label: '显示网格线', key: 'setGrid' },
              { label: '显示经纬度', key: 'setMousePos' },
              { label: '显示比例尺', key: 'setScaleLine' },
              { label: '显示鸟瞰图', key: 'setOverviewMap' },
              { label: '移动到北京', key: 'flayTo' },
              { label: '设置图层1-TODO', key: 'TODO1' },
              { label: '设置图层2-TODO', key: 'TODO2' },
              { label: '设置图层3-TODO', key: 'TODO3' },
            ],
            onClick: ({ key }) => MapTool[key]?.()
          }}
          disabled={!MapController}
        >
          <Button>地图工具</Button>
        </Dropdown>

        {/* 点操作 */}
        <Dropdown
          menu={{
            items: [
              { label: '基本散点', key: 'basicScatter' },
              { label: '图标点', key: 'iconPoint' },
              { label: '点-自定义tooltip', key: 'pointTooltip' },
              { label: '点-菜单', key: 'pointmenu' },
              { label: '点集-新增点', key: 'gatherAdd' },
              { label: '点集-修改点', key: 'gatherEdit' },
              { label: '点集-显示点', key: 'gatherShow' },
              { label: '点集-隐藏点', key: 'gatherHidden' },
              { label: '点集-删除点', key: 'gatherRemove' },
              { label: '点集-清空点', key: 'gatherClear' },
              { label: '基本绘制', key: 'drawPoint' },
              { label: '有初始坐标的绘制', key: 'drawInitPoint' },
              { label: '绘制为图标', key: 'drawIconPoint' },
              { label: '绘制中修改坐标', key: 'drawChangePoint' },
              { label: '结束绘制', key: 'drawend' },
            ],
            onClick: ({ key }) => pointAction[key]?.()
          }}
          disabled={!MapController}
        >
          <Button>点操作</Button>
        </Dropdown>

      </div>
    </div >
  )
}

export default App
