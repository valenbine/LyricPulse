import { useId, type ReactNode } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function Field({
  label,
  children
}: {
  label: string
  children: ReactNode
}) {
  const fieldId = useId()

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div id={fieldId}>{children}</div>
    </div>
  )
}

export function ControlGroup({
  label,
  children
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

export function NumberField({
  label,
  value,
  step,
  onChange
}: {
  label: string
  value: number
  step?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="space-y-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <Input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="space-y-2 text-xs text-muted-foreground">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-medium text-foreground">{value.toFixed(2)}</span>
      </div>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), min, max))
        }
      />
    </label>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
