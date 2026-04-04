import { RulesProvider } from './RulesContext'
import { Routes, Route } from 'react-router-dom'
import Rules from './Rules'
import CreateRules from './components/CreateRules'

export default function RulesLayout() {
  return (
    <RulesProvider>
      <Routes>
        <Route path='/' element={<Rules />} />
        <Route path='/create-rules' element={<CreateRules />} />
      </Routes>
    </RulesProvider>
  )
}
