import { cn } from '@/utilities/ui'

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'default'
}
const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        'flex flex-1 items-center justify-center rounded-md border border-transparent dark:bg-white/10 bg-black/10 px-8 py-3 text-base font-medium dark:text-white dark:hover:bg-white hover:bg-black light:bg-black dark:hover:text-black hover:text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden w-full',
        props.className,
      )}
    >
      {children}
    </button>
  )
}

export default CustomButton
