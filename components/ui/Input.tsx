import React, { InputHTMLAttributes, FC } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sofka-light-blue focus:border-transparent transition-all outline-none text-sm ${error ? 'border-sofka-error focus:ring-sofka-error' : ''
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-sofka-error mt-1 ml-1">{error}</span>}
        </div>
    );
};

export default Input;
