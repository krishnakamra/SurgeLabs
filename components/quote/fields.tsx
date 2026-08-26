"use client";

import type { QuoteField } from "@/content/quote-form";
import { cn } from "@/lib/cn";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export type FieldValue = string | string[];

/**
 * Choices are buttons with aria-pressed, not radios or checkboxes.
 *
 * The brief asked for controlled state and onClick handlers rather than form
 * semantics, so the accessible name and state have to be carried explicitly:
 * a pressed toggle button announces correctly, where a styled div would not.
 */
export function ChoiceField({
  field,
  value,
  onChange,
}: {
  field: Extract<QuoteField, { kind: "choice" }>;
  value: FieldValue | undefined;
  onChange: (next: FieldValue) => void;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (option: string) => {
    if (!field.multi) {
      onChange(selected[0] === option ? "" : option);
      return;
    }
    onChange(selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option]);
  };

  return (
    <fieldset>
      <legend className={cn(SPEC, "text-fg-faint")}>
        {field.label}
        {field.required ? <span className="text-accent-text"> *</span> : null}
        {field.multi ? <span className="text-fg-faint"> · pick any</span> : null}
      </legend>

      <div className="mt-4 flex flex-wrap gap-3">
        {field.options.map((option) => {
          const on = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option.value)}
              className={cn(
                "border-[length:var(--hairline)] px-4 py-3 text-left transition-colors duration-[var(--dur-snap)] ease-press",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                on
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-rule-strong bg-transparent text-fg hover:border-fg",
              )}
            >
              <span className={cn(SPEC, "block")}>{option.label}</span>
              {option.hint ? (
                <span className={cn("mt-1 block text-2xs", on ? "text-accent-fg/75" : "text-fg-faint")}>
                  {option.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={cn(SPEC, "block text-fg-faint")}>
        {label}
        {required ? <span className="text-accent-text"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-3 w-full border-[length:var(--hairline)] border-rule-strong bg-surface px-4 py-3 text-base text-fg",
          "placeholder:text-fg-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        )}
      />
    </div>
  );
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className={cn(SPEC, "block text-fg-faint")}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-3 w-full resize-y border-[length:var(--hairline)] border-rule-strong bg-surface px-4 py-3 text-base text-fg",
          "placeholder:text-fg-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        )}
      />
    </div>
  );
}
