import Plants from './Plants'
import { PlantProvider } from './PlantsContext'
import PlantsDetails from './PlantsDetails'
import { useRouteQuery } from '@/hooks/useRouteQuery'

export default function PlantsLayout() {
  const { params } = useRouteQuery()

  const plantId = params.id

  return <PlantProvider>{plantId ? <PlantsDetails id={plantId} /> : <Plants />}</PlantProvider>
}
