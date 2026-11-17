import { cn } from '../../utils/format.js'

export function Field({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ label, error, hint, icon: Icon, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint} className={className}>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />}
        <input
          id={inputId}
          className={cn('input', Icon && 'pl-10', error && 'border-red-400')}
          {...props}
        />
      </div>
    </Field>
  )
}

export function Select({ label, error, hint, options = [], className = '', id, ...props }) {
  const selectId = id || props.name
  return (
    <Field label={label} htmlFor={selectId} error={error} hint={hint} className={className}>
      <select id={selectId} className="select" {...props}>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value
          const text = typeof option === 'string' ? option : option.label
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
    </Field>
  )
}

export function Textarea({ label, error, hint, className = '', id, ...props }) {
  const textareaId = id || props.name
  return (
    <Field label={label} htmlFor={textareaId} error={error} hint={hint} className={className}>
      <textarea id={textareaId} className={cn('textarea', error && 'border-red-400')} {...props} />
    </Field>
  )
}
