import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';

interface PlaceholderCalculatorProps {
    manufacturerName: string;
    onSwitch: () => void;
}

export const PlaceholderCalculator: React.FC<PlaceholderCalculatorProps> = ({ manufacturerName, onSwitch }) => (
    <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
            <div className="text-6xl mb-4">🚧</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{manufacturerName}</h1>
            <p className="text-slate-500 mb-6">Kalkulator w przygotowaniu</p>
            <Card className="max-w-md mx-auto">
                <CardContent>
                    <p className="text-sm text-slate-600 mb-4">Ten kalkulator jest obecnie rozwijany. Funkcjonalność zostanie dodana w przyszłych aktualizacjach.</p>
                    <button onClick={onSwitch} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Przejdź do POROTHERM</button>
                </CardContent>
            </Card>
        </div>
    </div>
);
