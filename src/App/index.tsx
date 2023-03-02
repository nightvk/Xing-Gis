import { useState } from 'react'
import { Button, message, Select, Menu, Dropdown } from 'antd'
import './index.less'


import MapControllerGenerator2D from '@/2D/ControllerGenerator'
import AirportIcon from '@/2D/images/airport.png'
import type { MapControllerRes } from '@/2D/ControllerGenerator/constant'
import { GeoGatherConstraint } from '@/2D/constraint'
import { Icon, Stroke, Style } from 'ol/style'

type modeType = '2D' | '3D'

function App() {
  const [mode, setMode] = useState<modeType>('2D')
  const [MapController, setMapController] = useState<MapControllerRes<MapType>>()

  // 点集 
  const [pointGather, setPointGather] = useState<GeoGatherConstraint | undefined>(undefined)
  // 线集
  const [lineGather, setLineGather] = useState<GeoGatherConstraint | undefined>(undefined)
  // 多边形集合
  const [polygonGather, setPolygonGather] = useState<GeoGatherConstraint | undefined>(undefined)




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
    basicPoint: () => {
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
    customStylePoint: () => {
      const { create } = MapController!.Point
      const coordinate: Coordinate2D = [104.06, 30.67]

      create({
        id: 9,
        name: '自定义样式',
        coordinate,
        options: {
          icon: { src: AirportIcon },
          // 自定义样式点 此处传入 style ： Style 可自定义点的样式 
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
    gatherAdd: () => {
      let pointGather = MapController!.Point.createGather('airports')!
      const coordinate: Coordinate2D = [103.06, 29.67]

      pointGather!.draw({
        id: 1,
        name: '点集-点1',
        coordinate,
        options: { icon: { src: AirportIcon } }
      })
      setPointGather(pointGather)

      MapController!.Tool.flayTo(coordinate)
    },
    gatherEdit: () => {
      const coordinate: Coordinate2D = [103.06, 29.67]

      pointGather!.draw({
        id: 1,// 只要id一致,即是修改
        name: '点集-点1-修改',
        coordinate,
        options: {
          icon: { src: AirportIcon },

        }
      })
    },
    gatherRemove: () => {
      pointGather!.remove(1)
    },
    gatherClear: () => {
      pointGather!.clear()
    },
    gatherShow: () => {
      pointGather!.show(1)
    },
    gatherHidden: () => {
      pointGather!.hidden(1)
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
    drawStylePoint: () => {
      const { start } = MapController!.Point.draw
      start({
        pointerStyle: { icon: { src: AirportIcon } },
        drawEndStyle: () => {
          return new Style({
            image: new Icon({
              src: AirportIcon
            })
          })
        },
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
    menuPoint: () => {
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
                {
                  label: '菜单1', click: () => {
                    console.log('点击了菜单1')
                  }
                },
                {
                  label: '菜单2', click: () => {
                    console.log('点击了菜单2')
                  }
                },
              ]
            }
          }
        }
      })
      MapController!.Tool.flayTo(coordinate)
    },
  }

  /** 线操作 */
  const LineAction: Record<string, Function> = {
    basicLine: () => {
      const { create } = MapController!.Line
      const coordinate: Coordinate2D[] = [[0, 0], [0, 1], [1, 1]]

      create({
        id: 1,
        name: '基本线条',
        coordinate,
        options: {
          showName: true,
          hoverActive: true,
          lineStyle: {
            stroke: {
              color: 'green'
            }
          }
        }
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    customStyleLine: () => {
      const { create } = MapController!.Line
      const coordinate: Coordinate2D[] = [[-2, -2], [-1, -3], [0, 0]]

      create({
        id: 2,
        name: '自定义样式线条',
        coordinate,
        options: {
          showName: true,
          hoverActive: true,
          lineStyle: {
            stroke: {
              color: 'green',
              width: 2,
              lineDash: [6, 4]
            },
            text: {
              fill: 'red'
            }
          },
          nodeStyle: {
            circle: {
              radius: 6,
              fill: '#000',
              stroke: {
                color: '#fff',
                width: 3
              }
            }
          },
          toolTip: {
            text: '这是自定义样式线条的自定义toolTip'
          }
        }
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    menuLine: () => {
      const { create } = MapController!.Line
      const coordinate: Coordinate2D[] = [[-1, 0], [0, 1], [0, 0]]

      create({
        id: 3,
        name: '带菜单的线',
        coordinate,
        options: {
          source: {
            desc: '这是线条的原始数据'
          },
          events: {
            singleClick: {
              menus: [
                {
                  label: '菜单1', click: (e: any, source: any) => {
                    console.log('点击了菜单1', e, source)
                  }
                },
              ]
            }
          }
        }
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    gatherAdd: () => {
      let lineGather = MapController!.Line.createGather('base')!
      const coordinate: Coordinate2D[] = [[-10, 0], [-10, 1], [-9, 0]]

      lineGather!.draw({
        id: 5,
        name: '线集-线1',
        coordinate,
      })
      setLineGather(lineGather)

      MapController!.Tool.flayTo(coordinate[0])
    },
    gatherEdit: () => {
      const coordinate: Coordinate2D[] = [[-8, 0], [-10, 1], [-7, 0]]

      lineGather!.draw({
        id: 5,// 只要id一致,即是修改
        name: '线集-线1-修改',
        coordinate,
      })
    },
    gatherRemove: () => {
      lineGather!.remove(5)
    },
    gatherClear: () => {
      lineGather!.clear()
    },
    gatherShow: () => {
      lineGather!.show(5)
    },
    gatherHidden: () => {
      lineGather!.hidden(5)
    },
    drawLine: () => {
      const { start } = MapController!.Line.draw
      start({}, (e: any) => {
        console.log('e', e)
      })
    },
    drawInitLine: () => {
      const { start } = MapController!.Line.draw
      const initCoordinates = [[1, 1], [0.19, -1.5]]
      start({
        initCoordinates,
      }, (e: any) => {
        MapController!.Tool.flayTo(initCoordinates[0])
        console.log('e', e)
      })
    },
    drawStyleLine: () => {
      const { start } = MapController!.Line.draw
      start({
        pointerStyle: {
          circle: {
            fill: 'red',
            radius: 10
          }
        },
        drawEndStyle: () => {
          return new Style({
            stroke: new Stroke({
              color: 'red',
              width: 4
            })
          })
        },
      }, (e: any) => {
        console.log('e', e)
      })


    },
    drawChangeLine: () => {
      const { change } = MapController!.Line.draw
      change([[1, 3], [1, 4], [2, 5]])
      MapController!.Tool.flayTo([1, 3])
    },
    drawend: () => {
      const { end } = MapController!.Line.draw
      end()
    },
  }

  /** 多边形操作 */
  const PolygonAction: Record<string, Function> = {
    basicPolygon: () => {
      const { create } = MapController!.Polygon
      const coordinate: Coordinate2D[] = [[0, 0], [0, 1], [1, 1]]

      create({
        id: 1,
        name: '基本多边形',
        coordinate,
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    customStylePolygon: () => {
      const { create } = MapController!.Polygon
      const coordinate: Coordinate2D[] = [[1, 1], [1, 2], [2, 2]]

      create({
        id: 2,
        name: '自定义样式多边形',
        coordinate,
        options: {
          showName: true,
          hoverActive: true,
          lineStyle: {
            fill: 'blue',
            stroke: {
              color: 'green',
              width: 2,
              lineDash: [6, 4]
            },
            text: {
              fill: 'red'
            }
          },
          nodeStyle: {
            circle: {
              radius: 6,
              fill: '#000',
              stroke: {
                color: '#fff',
                width: 3
              }
            }
          },
          activeStyle: {
            lineStyle: {
              fill: "#fff",
              stroke: {
                color: '#eee',
                width: 1,
              },
              text: {
                fill: '#ccc'
              }
            }
          },
          toolTip: {
            text: '这是自定义样式多边形的自定义toolTip'
          }
        }
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    menuPolygon: () => {
      const { create } = MapController!.Polygon
      const coordinate: Coordinate2D[] = [[-1, 0], [0, 1], [0, 0]]

      create({
        id: 3,
        name: '带菜单的多边形',
        coordinate,
        options: {
          source: {
            id: 3,
            desc: '这是多边形的原始数据',
          },
          events: {
            singleClick: {
              menus: [
                {
                  label: '菜单1', click: (e: any, source: any) => {
                    console.log('点击了菜单1', e, source)
                  }
                },
              ]
            }
          }
        }
      })
      MapController!.Tool.flayTo(coordinate[0])
    },
    gatherAdd: () => {
      let polygonGather = MapController!.Polygon.createGather('basePolygon')!
      const coordinate: Coordinate2D[] = [[-10, 0], [-10, 1], [-9, 0]]

      polygonGather!.draw({
        id: 5,
        name: '多边形集-多边形1',
        coordinate,
      })
      setPolygonGather(polygonGather)

      MapController!.Tool.flayTo(coordinate[0])
    },
    gatherEdit: () => {
      const coordinate: Coordinate2D[] = [[-8, 0], [-10, 1], [-7, 0]]

      polygonGather!.draw({
        id: 5,// 只要id一致,即是修改
        name: '多边形集-多边形1-修改',
        coordinate,
      })
    },
    gatherRemove: () => {
      polygonGather!.remove(5)
    },
    gatherClear: () => {
      polygonGather!.clear()
    },
    gatherShow: () => {
      polygonGather!.show(5)
    },
    gatherHidden: () => {
      polygonGather!.hidden(5)
    },
    drawPolygon: () => {
      const { start } = MapController!.Polygon.draw
      start({}, (e: any) => {
        console.log('e', e)
      })
    },
    drawInitPolygon: () => {
      const { start } = MapController!.Polygon.draw
      const initCoordinates = [[1, 1], [0.19, -1.5], [2, 2]]
      start({
        initCoordinates,
      }, (e: any) => {
        MapController!.Tool.flayTo(initCoordinates[0])
        console.log('e', e)
      })
    },
    drawStylePolygon: () => {
      const { start } = MapController!.Polygon.draw
      start({
        pointerStyle: {
          circle: {
            fill: 'red',
            radius: 10
          }
        },
        drawEndStyle: () => {
          return new Style({
            stroke: new Stroke({
              color: 'red',
              width: 4
            })
          })
        },
      }, (e: any) => {
        console.log('e', e)
      })


    },
    drawChangePolygon: () => {
      const { change } = MapController!.Polygon.draw
      change([[1, 3], [1, 4], [2, 5]])
      MapController!.Tool.flayTo([1, 3])
    },
    drawend: () => {
      const { end } = MapController!.Polygon.draw
      end()
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
            { label: '3D-TODO', value: '3D' },
          ]}
        />
        <Select
          placeholder='请初始化地图'
          onChange={initMap}
          options={[
            { label: 'baidu地图-TODO', value: 'baidu' as MapType },
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
              { label: '基本点', key: 'basicPoint' },
              { label: '自定义样式点', key: 'customStylePoint' },
              { label: '带菜单的点', key: 'menuPoint' },
              { label: '点集-新增点', key: 'gatherAdd' },
              { label: '点集-修改点', key: 'gatherEdit', disabled: !pointGather },
              { label: '点集-显示点', key: 'gatherShow', disabled: !pointGather },
              { label: '点集-隐藏点', key: 'gatherHidden', disabled: !pointGather },
              { label: '点集-删除点', key: 'gatherRemove', disabled: !pointGather },
              { label: '点集-清空点', key: 'gatherClear', disabled: !pointGather },
              { label: '基本绘制', key: 'drawPoint' },
              { label: '有初始坐标的绘制', key: 'drawInitPoint' },
              { label: '自定义样式的绘制', key: 'drawStylePoint' },
              { label: '绘制中修改坐标', key: 'drawChangePoint' },
              { label: '结束绘制', key: 'drawend' },
            ],
            onClick: ({ key }) => pointAction[key]?.()
          }}
          disabled={!MapController}
        >
          <Button>点操作</Button>
        </Dropdown>

        {/* 线操作 */}
        <Dropdown
          menu={{
            items: [
              { label: '基本线条', key: 'basicLine' },
              { label: '自定义样式线条', key: 'customStyleLine' },
              { label: '带菜单的线', key: 'menuLine' },
              { label: '带箭头的线-TODO', key: 'arrowLine' },
              { label: '线集-新增线条', key: 'gatherAdd' },
              { label: '线集-修改线条', key: 'gatherEdit', disabled: !lineGather },
              { label: '线集-显示线条', key: 'gatherShow', disabled: !lineGather },
              { label: '线集-隐藏线条', key: 'gatherHidden', disabled: !lineGather },
              { label: '线集-删除线条', key: 'gatherRemove', disabled: !lineGather },
              { label: '线集-清空线条', key: 'gatherClear', disabled: !lineGather },
              { label: '基本绘制', key: 'drawLine' },
              { label: '绘制带箭头的线-TODO', key: 'drawArrowLine' },
              { label: '有初始坐标的绘制', key: 'drawInitLine' },
              { label: '自定义样式的绘制', key: 'drawStyleLine' },
              { label: '绘制中修改坐标', key: 'drawChangeLine' },
              { label: '结束绘制', key: 'drawend' },
            ],
            onClick: ({ key }) => LineAction[key]?.()
          }}
          disabled={!MapController}
        >
          <Button>线操作</Button>
        </Dropdown>

        {/* 多边形操作 */}
        <Dropdown
          menu={{
            items: [
              { label: '基本多边形', key: 'basicPolygon' },
              { label: '自定义样式多边形', key: 'customStylePolygon' },
              { label: '带菜单的多边形', key: 'menuPolygon' },
              { label: '多边形集-新增多边形', key: 'gatherAdd' },
              { label: '多边形集-修改多边形', key: 'gatherEdit', disabled: !polygonGather },
              { label: '多边形集-显示多边形', key: 'gatherShow', disabled: !polygonGather },
              { label: '多边形集-隐藏多边形', key: 'gatherHidden', disabled: !polygonGather },
              { label: '多边形集-删除多边形', key: 'gatherRemove', disabled: !polygonGather },
              { label: '多边形集-清空', key: 'gatherClear', disabled: !polygonGather },
              { label: '基本绘制', key: 'drawPolygon' },
              { label: '有初始坐标的绘制', key: 'drawInitPolygon' },
              { label: '自定义样式的绘制', key: 'drawStylePolygon' },
              { label: '绘制中修改坐标', key: 'drawChangePolygon' },
              { label: '结束绘制', key: 'drawend' },
            ],
            onClick: ({ key }) => PolygonAction[key]?.()
          }}
          disabled={!MapController}
        >
          <Button>多边形操作</Button>
        </Dropdown>
      </div>
    </div >
  )
}

export default App
