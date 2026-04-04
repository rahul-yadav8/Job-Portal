export interface RightSideDrawerProps {
  className?: string
  isEdit?: boolean
  isLoading?: boolean
  defaultValues?: {
    full_name?: string
    email?: string
  }
  onSubmit?: (values: FormValues) => Promise<void> | void
}
