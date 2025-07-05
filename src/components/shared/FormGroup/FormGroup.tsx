import React from 'react';
import './FormGroup.css';

interface FormGroupProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  htmlFor?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
  labelClassName = '',
  errorClassName = '',
  htmlFor,
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className={`form-label ${labelClassName}`} htmlFor={htmlFor}>
          {label}
          {required && <span className='required-asterisk'>*</span>}
        </label>
      )}

      <div className='form-control-wrapper'>{children}</div>

      {error && <div className={`form-error ${errorClassName}`}>{error}</div>}
    </div>
  );
};

export default FormGroup;
