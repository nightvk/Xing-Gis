import { useState } from 'react'
import { Select } from 'antd'
import Map2D from '../2DNew'
import Map3D from '../3D'
import './index.less'

type modeType = '2D' | '3D'

function App() {
  const [mode, setMode] = useState<modeType>('2D')

  return (
    <div className="App">
      <Select
        className='gis-mode'
        value={mode}
        onChange={setMode}
        options={[
          { label: '2D', value: '2D' },
          { label: '3D', value: '3D' },
        ]}
      />
      {
        mode === '2D' &&
        <Map2D />
      }
      {
        mode === '3D' &&
        <Map3D />
      }
    </div >
  )
}

export default App
