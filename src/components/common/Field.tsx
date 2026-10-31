import { useId } from 'react'
import { Input } from '@/components/ui/input'

interface FieldProps extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  label: string
  prefix?: string
  suffix?: string
  hint?: string
  error?: string
}

export function Field({ label, prefix, suffix, hint, error, id, className = '', ...inputProps }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint && !error ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const prefixId = prefix ? `${inputId}-prefix` : undefined
  const suffixId = suffix ? `${inputId}-suffix` : undefined
  const describedBy = [prefixId, suffixId, hintId, errorId].filter(Boolean).join(' ') || undefined

  const paddingLeft = prefix ? 'pl-7' : ''
  const paddingRight = suffix ? (suffix.length > 2 ? 'pr-16' : 'pr-8') : ''

  // The label and input share a parent element; e2e helpers locate inputs through the label's parent
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span id={prefixId} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${paddingLeft} ${paddingRight}`}
          {...inputProps}
        />
        {suffix && (
          <span id={suffixId} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hintId && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {errorId && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
