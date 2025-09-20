import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PorothermCalculator } from './features/porotherm/PorothermCalculator';
import { SolbetCalculator } from './features/solbet/SolbetCalculator';
import { SemmelrockCalculator } from './features/semmelrock/SemmelrockCalculator';
import { BrukbetCalculator } from './features/brukbet/BrukbetCalculator';
import { PolbrukCalculator } from './features/polbruk/PolbrukCalculator';
import { LeierCalculator } from './features/leier/LeierCalculator';
import { PlaceholderCalculator } from './features/shared/PlaceholderCalculator';
import { MANUFACTURERS } from './constants';
import { ConnectionStatus } from './components/ui/ConnectionStatus';

const App: React.FC = () => {
    const [currentManufacturer, setCurrentManufacturer] = useState('porotherm');

    const renderCalculator = () => {
        switch (currentManufacturer) {
            case 'porotherm': return <PorothermCalculator />;
            case 'solbet': return <SolbetCalculator />;
            case 'semmelrock': return <SemmelrockCalculator />;
            case 'brukbet': return <BrukbetCalculator />;
            case 'polbruk': return <PolbrukCalculator />;
            case 'leier': return <LeierCalculator />;
            case 'silikaty': return <PlaceholderCalculator manufacturerName="SILIKATY SZLACHTA" onSwitch={() => setCurrentManufacturer('porotherm')} />;
            default: return <PorothermCalculator />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
            <Sidebar 
                manufacturers={MANUFACTURERS} 
                currentManufacturerId={currentManufacturer} 
                onSelectManufacturer={setCurrentManufacturer} 
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {renderCalculator()}
            </main>
            <ConnectionStatus />
        </div>
    );
};

export default App;
