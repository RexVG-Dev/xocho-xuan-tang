import { useState } from 'react';

export function ConfirmRadios({ onChange, value }: { value: string[]; onChange: (val: string[]) => void }) {
  const options = [
    { label: 'Acepto aviso de privacidad', value: 'privacy' },
    { label: 'Acepto terminos y condiciones', value: 'terms' },
    { label: 'Acepto políticas de envío', value: 'shipping' },
  ];

  function handleToggle(val: string) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  return (
    <div className="space-y-2 mb-4">
      {options.map((opt, idx) => (
        <label key={opt.value} className={`flex items-center gap-2 text-sm font-medium ${idx === 0 ? 'font-semibold' : 'font-normal text-gray-500'}`}>
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => handleToggle(opt.value)}
            className="accent-red-500 w-4 h-4"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
