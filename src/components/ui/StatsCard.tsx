import React from 'react';
import { Card, CardContent } from './Card';

interface StatsCardProps {
    value: string | number;
    label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => (
    <Card>
        <CardContent className="text-center">
            <div className="text-2xl font-bold text-blue-600">{value}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
        </CardContent>
    </Card>
);
