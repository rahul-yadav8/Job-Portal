'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/custom/button'

type Mode = 'recurring' | 'manual'
type Tab = 'standard' | 'advanced'

export default function ScheduleSelector() {
  const [mode, setMode] = useState<Mode>('recurring')
  const [tab, setTab] = useState<Tab>('standard')
  const [frequency, setFrequency] = useState('6')
  const [unit, setUnit] = useState('hours')
  const [cron, setCron] = useState('')

  return (
    <div className='w-full max-w-xl space-y-6'>
      <div className='flex w-fit rounded-md bg-muted p-1'>
        <Button
          variant={mode === 'recurring' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setMode('recurring')}
        >
          Recurring
        </Button>
        <Button variant={mode === 'manual' ? 'default' : 'ghost'} size='sm' onClick={() => setMode('manual')}>
          Manual Only
        </Button>
      </div>

      {mode === 'recurring' && (
        <Tabs defaultValue='standard' value={tab} onValueChange={(val) => setTab(val as Tab)}>
          <TabsList className='grid w-[300px] grid-cols-2'>
            <TabsTrigger value='standard'>Standard</TabsTrigger>
            <TabsTrigger value='advanced'>Advanced (Cron)</TabsTrigger>
          </TabsList>

          <TabsContent value='standard' className='mt-4'>
            <div className='flex items-center gap-3'>
              <span className='text-sm text-muted-foreground'>Every</span>

              <Input
                type='number'
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className='w-20'
              />

              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='minutes'>Minutes</SelectItem>
                  <SelectItem value='hours'>Hours</SelectItem>
                  <SelectItem value='days'>Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className='mt-2 text-xs text-muted-foreground'>
              Runs every {frequency} {unit}
            </p>
          </TabsContent>

          <TabsContent value='advanced' className='mt-4'>
            <Input placeholder='* * * * *' value={cron} onChange={(e) => setCron(e.target.value)} />
            <p className='mt-2 text-xs text-muted-foreground'>Enter a valid cron expression</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
