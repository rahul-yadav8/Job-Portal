import clsx from 'clsx'

export default function Stepper({ activeStep = 0, steps = [] }: { activeStep: number; steps: string[] }) {
  return (
    <div className='w-full p-4 bg-white border rounded-md'>
      <div className='flex items-center'>
        {steps.map((step, index) => {
          const isActive = index === activeStep && activeStep !== 0
          const isCompleted = index < activeStep && activeStep !== 0

          return (
            <div key={index} className='flex items-center flex-1'>
              {/* Step Content */}
              <div className='flex items-center gap-2 whitespace-nowrap'>
                {/* Circle */}
                <div
                  className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    {
                      'bg-[#3B82F6] text-white': isActive || isCompleted,
                      'bg-gray-300 text-gray-600': !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Label */}
                <span
                  className={clsx('text-sm font-medium', {
                    'text-[#3B82F6]': isActive || isCompleted,
                    'text-gray-500': !isActive && !isCompleted,
                  })}
                >
                  {step}
                </span>
              </div>

              {/* Line */}
              <div
                className={clsx('mx-3 h-[2px]', {
                  'flex-1': index !== steps.length - 1,
                  'w-full': index === steps.length - 1,
                  'bg-[#3B82F6]': index < activeStep && activeStep !== 0,
                  'bg-gray-300': index >= activeStep || activeStep === 0,
                })}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
