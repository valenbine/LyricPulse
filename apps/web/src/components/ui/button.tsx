import { cva, type VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-accent-foreground shadow-[0_0_32px_rgba(34,197,94,0.32)] hover:bg-accent/90',
        secondary:
          'border border-white/10 bg-white/10 text-foreground hover:border-white/20 hover:bg-white/15',
        ghost: 'text-muted-foreground hover:bg-white/10 hover:text-foreground'
      },
      size: {
        default: 'h-11',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type SharedButtonProps = VariantProps<typeof buttonVariants> & {
  asLink?: boolean
}

export type ButtonProps = SharedButtonProps &
  (
    | ButtonHTMLAttributes<HTMLButtonElement>
    | AnchorHTMLAttributes<HTMLAnchorElement>
  )

export function Button({
  asLink,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (asLink) {
    const { disabled, ...anchorProps } =
      props as AnchorHTMLAttributes<HTMLAnchorElement> & {
        disabled?: boolean
      }

    return (
      <a
        className={classes}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
        {...anchorProps}
      />
    )
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
}
