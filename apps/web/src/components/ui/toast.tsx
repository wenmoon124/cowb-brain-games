'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const toastViewportVariants = cva(
  'fixed top-lg right-lg z-toast flex max-h-screen w-full flex-col-reverse gap-sm sm:max-w-sm'
)

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(toastViewportVariants(), className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-sm overflow-hidden rounded-lg border border-border bg-card p-lg pr-lg shadow-lg transition-all data-[state=open]:animate-slide-down data-[state=closed]:animate-fade-in',
  {
    variants: {
      variant: {
        default: 'border-border',
        success: 'border-l-4 border-l-success',
        error: 'border-l-4 border-l-error',
        warning: 'border-l-4 border-l-warning',
        info: 'border-l-4 border-l-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold text-text-primary', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-md top-md rounded-sm p-xs text-text-muted transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toasts: ToastData[]
  toast: (data: Omit<ToastData, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastContainer')
  }
  return context
}

export function ToastContainer({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 11)
      setToasts((prev) => [...prev, { ...data, id }])
      const duration = data.duration ?? 5000
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss]
  )

  const contextValue = React.useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastProvider duration={5000}>
        {children}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id)
            }}
          >
            <div className="flex-1">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && (
                <ToastDescription>{t.description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
  ToastProvider,
  type ToastVariant,
}
