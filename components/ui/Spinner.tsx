
import React from 'react';

export const Spinner: React.FC = () => (
    <div className="flex items-center justify-center h-full p-8">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = "Ładowanie danych z bazy..." }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
        <Spinner />
        <p className="mt-4 text-slate-600 font-medium">{text}</p>
    </div>
)
