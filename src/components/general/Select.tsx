import React, { JSX } from "react";

export interface SelectOptions<TValue extends string> {
  value: TValue;
  options: readonly { value: TValue; label?: string | JSX.Element }[];
  onChange: (newValue: TValue) => void;
  name?: string;
  className?: string;
}

export function Select<TValue extends string>({
  value: value,
  options,
  onChange,
  name = "",
  className = "",
}: SelectOptions<TValue>): JSX.Element {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value as TValue)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
}
