import Navbar from '@/components/custom/Navbar'
import Stepper from '@/components/custom/Stepper'

export default function CreateRules() {
  const steps = ['Configure Rule', 'Assign Assets']

  return (
    <>
      <Navbar
        title='Rules / Create New Rule'
        description='Configure detection parameters for proactive asset monitoring monitoring and early failure warning..'
      />

      {/* Stepper component */}
      <Stepper activeStep={0} steps={steps} />
    </>
  )
}
