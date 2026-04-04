import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { IconLoader2 } from '@tabler/icons-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const buttonVariants = cva(
  'inline-flex justify-center items-center whitespace-nowrap rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-low bg-primary-confirm shadow-sm text-secondary-text hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        activeNav: 'hover:bg-activeNav',
        activeLink: 'bg-[#7A58E7] ',
        link: 'text-primary underline-offset-4 hover:underline',
        none: 'bg-transparent outline-none hover:bg-transparent ',
      },
      size: {
        default: 'h-[40px] px-[20px] py-[16px] text-sm font-medium leading-[20px]',
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'text-[14px] font-semibold',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonPropsBase
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

type ButtonProps = ButtonPropsBase &
  (
    | { asChild: true }
    | {
        asChild?: false
        loading?: boolean
        leftSection?: JSX.Element
        rightSection?: JSX.Element
      }
  )

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const { asChild, ...rest } = props
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...rest}>
          {children}
        </Slot>
      )
    }

    const { loading = false, leftSection, rightSection, disabled, ...otherProps } = props

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...otherProps}
      >
        {((leftSection && loading) || (!leftSection && !rightSection && loading)) && (
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        {!loading && leftSection && <div className='mr-2'>{leftSection}</div>}
        {children}
        {!loading && rightSection && <div className='ml-2'>{rightSection}</div>}
        {rightSection && loading && <IconLoader2 className='ml-2 h-4 w-4 animate-spin' />}
      </button>
    )
  }
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
