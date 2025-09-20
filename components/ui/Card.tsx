
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-4 sm:p-6 border-b border-slate-200 ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-800">{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm text-slate-500 mt-1">{children}</p>
);