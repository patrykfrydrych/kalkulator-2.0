import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface FormGroupProps {
    label: string;
    children: React.ReactNode;
    error?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input: React.FC<InputProps> = ({ error, ...props }) => (
    <input 
        {...props} 
        className={`w-full p-2 border rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-slate-300'}`} 
    />
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
}

export const Select: React.FC<SelectProps> = ({ className = '', ...props }) => (
    <select 
        {...props} 
        className={`w-full p-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 ${className}`} 
    />
);
