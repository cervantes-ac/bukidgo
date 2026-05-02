import { AlertCircle } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0A3D2F'
          }}
        >
          {label}
          {required && <span style={{ color: '#C4622D', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: `1px solid ${error ? '#C4622D' : '#E8DCC8'}`,
          borderRadius: '4px',
          outline: 'none',
          transition: 'border-color 0.2s',
          backgroundColor: '#F5F5F0',
          color: '#0A3D2F',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? '#C4622D' : '#C4622D';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#C4622D' : '#E8DCC8';
        }}
        {...props}
      />
      {error && (
        <div
          id={`${inputId}-error`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '0.5rem',
            fontSize: '12px',
            color: '#C4622D'
          }}
          role="alert"
        >
          <AlertCircle style={{ width: 14, height: 14 }} />
          {error}
        </div>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          style={{
            marginTop: '0.5rem',
            fontSize: '12px',
            color: '#1E4D2B'
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
