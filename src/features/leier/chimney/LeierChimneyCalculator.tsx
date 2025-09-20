import React, { useState, useMemo, useEffect } from 'react';
import { useSupabaseData } from '../../../hooks/useSupabaseData';
import { ChimneyAccordion } from './components/ChimneyAccordion';
import { ChimneyReport } from './components/ChimneyReport';
import { ClientDataModal } from './components/ClientDataModal';
import { VentilationModal } from './components/VentilationModal';
import { ChimneyComponentsModal } from './components/ChimneyComponentsModal';
import { calculateChimneySystem, calculateVentilation } from './chimneyLogic';
import type { ChimneyOptions, ClientData, ReportItem, VentilationData, VentilationItem, ChimneySystemType, ChimneyComponentsData } from './types';
import { INITIAL_CHIMNEY_OPTIONS, CHIMNEY_SYSTEMS, INITIAL_CHIMNEY_COMPONENTS_DATA } from './chimneyData';
import { Card, CardContent } from '../../../components/ui/Card';
import { SettingsIcon } from '../../../components/icons/SettingsIcon';
import { LoadingOverlay } from '../../../components/ui/Spinner';

export const LeierChimneyCalculator: React.FC = () => {
    const [activeSystem, setActiveSystem] = useState<ChimneySystemType | null>(null);
    const [options, setOptions] = useState<ChimneyOptions>(INITIAL_CHIMNEY_OPTIONS);
    const [clientData, setClientData] = useState<ClientData>({ name: '', street: '', city: '', phone: '', description: '', rabatZakupowyChimney: 0, rabatZakupowyVent: 0, marzaChimney: 20, marzaVent: 20 });
    const [ventilationData, setVentilationData] = useState<VentilationData>({ LK1: 0, LK2: 0, 'LK2-40': 0, 'LK2-P': 0, LK3: 0, 'LK3-P': 0, LK4: 0, 'LK4-P': 0 });
    
    const [chimneyComponents, setChimneyComponents, isLoading] = useSupabaseData<ChimneyComponentsData>('leier_chimney_components', INITIAL_CHIMNEY_COMPONENTS_DATA);

    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [isVentModalOpen, setVentModalOpen] = useState(false);
    const [isComponentsModalOpen, setComponentsModalOpen] = useState(false);

    const [reportItems, setReportItems] = useState<ReportItem[]>([]);
    
    const handleOptionsChange = (system: ChimneySystemType, key: string, value: any) => {
        setOptions(prev => ({
            ...prev,
            [system]: {
                ...prev[system],
                [key]: value
            }
        }));
    };
    
    const chimneyCalculation = useMemo<ReportItem[] | null>(() => {
        if (!activeSystem) return null;
        return calculateChimneySystem(activeSystem, options[activeSystem], clientData.rabatZakupowyChimney, chimneyComponents);
    }, [activeSystem, options, clientData.rabatZakupowyChimney, chimneyComponents]);

    useEffect(() => {
        if (chimneyCalculation) {
            setReportItems(chimneyCalculation);
        } else {
            setReportItems([]);
        }
    }, [chimneyCalculation]);

    const ventilationCalculation = useMemo<VentilationItem[]>(() => {
        return calculateVentilation(ventilationData, clientData.rabatZakupowyVent, chimneyComponents);
    }, [ventilationData, clientData.rabatZakupowyVent, chimneyComponents]);

    const handleCalculate = (system: ChimneySystemType) => {
        setActiveSystem(system);
    };
    
    const handleClear = () => {
        setActiveSystem(null);
    }

    const handleQuantityChange = (index: number, delta: number) => {
        setReportItems(prevItems => {
            const newItems = [...prevItems];
            const item = newItems[index];
            if (item && (item.quantity + delta >= 0)) {
                const newQuantity = item.quantity + delta;
                const newTotal = newQuantity * item.price;
                newItems[index] = { ...item, quantity: newQuantity, total: newTotal };
            }
            return newItems;
        });
    };
    
    const activeSystemName = activeSystem ? CHIMNEY_SYSTEMS.find(s => s.id === activeSystem)?.name : '';

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych kominów Leier..." />;
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-red-700">LEIER - Kalkulator Systemów Kominowych</h1>
                    <p className="text-slate-500">Wybierz system i skonfiguruj parametry</p>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setComponentsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <SettingsIcon /> Zarządzaj Elementami
                    </button>
                    <button onClick={() => setClientModalOpen(true)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Dane Klienta
                    </button>
                    <button onClick={() => setVentModalOpen(true)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Pustaki Wentylacyjne
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ChimneyAccordion
                        options={options}
                        onOptionChange={handleOptionsChange}
                        onCalculate={handleCalculate}
                        onClear={handleClear}
                    />
                </div>

                <div className="lg:col-span-2">
                    {activeSystem && reportItems.length > 0 ? (
                         <ChimneyReport
                            systemName={activeSystemName || ''}
                            systemType={activeSystem}
                            options={options[activeSystem]}
                            items={reportItems}
                            ventilationItems={ventilationCalculation}
                            clientData={clientData}
                            onQuantityChange={handleQuantityChange}
                        />
                    ) : (
                         <Card>
                            <CardContent className="text-center py-20">
                                <h3 className="text-lg font-semibold text-slate-700">Wybierz system kominowy</h3>
                                <p className="text-slate-500 mt-2">Wybierz jeden z systemów z menu po lewej stronie i kliknij "Kalkuluj", aby zobaczyć zestawienie.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <ClientDataModal
                isOpen={isClientModalOpen}
                onClose={() => setClientModalOpen(false)}
                data={clientData}
                onSave={setClientData}
            />
            <VentilationModal
                isOpen={isVentModalOpen}
                onClose={() => setVentModalOpen(false)}
                data={ventilationData}
                onSave={setVentilationData}
            />
            <ChimneyComponentsModal
                isOpen={isComponentsModalOpen}
                onClose={() => setComponentsModalOpen(false)}
                components={chimneyComponents}
                onSave={setChimneyComponents}
            />
        </div>
    );
};
