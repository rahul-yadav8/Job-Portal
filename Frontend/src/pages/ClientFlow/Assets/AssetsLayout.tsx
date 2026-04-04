import { AssetProvider } from './AssetsContext'
import Assets from './Assets'
import { useLocation } from 'react-router-dom'
import { parseQueryStrings } from '@/utils/url'
import AssetsDetails from './AssetsDetails'
import { Routes, Route } from 'react-router-dom'
import CreateEditAssets from './components/CreateEditAssets'

export default function AssetsLayout() {
  const location = useLocation()

  const queryParams = parseQueryStrings(location.search)
  return (
    <AssetProvider>
      {' '}
      <Routes>
        <Route path='/' element={queryParams?.assetId ? <AssetsDetails /> : <Assets />} />
        <Route path='/create' element={<CreateEditAssets />} />
        <Route path='/:id/edit' element={<CreateEditAssets />} />
      </Routes>
    </AssetProvider>
  )
}
