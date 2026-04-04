import StatCard from '@/components/ui/StatCard'

interface CardItem {
  title: string
  count: number
  description: string
  icon: React.ReactNode
}

interface CardProps {
  cardData: CardItem[]
}

export default function Card({ cardData }: CardProps) {
  return (
    <div className='grid w-full grid-cols-1 gap-4 pb-5 sm:grid-cols-2 lg:grid-cols-3'>
      {cardData.map((item: CardItem) => (
        <StatCard title={item.title} count={item.count} description={item.description} icon={item.icon} />
      ))}
    </div>
  )
}
