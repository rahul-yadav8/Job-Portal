import { PredictionsProvider } from './PredictionsContext'
import Predictions from './Predictions'

export default function PredictionsLayout() {
  return (
    <PredictionsProvider>
      <Predictions />
    </PredictionsProvider>
  )
}
