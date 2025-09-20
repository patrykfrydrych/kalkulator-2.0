import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/FormControls';
import type { ChimneyComponentsData, ChimneyComponent } from '../types';
import { exportLeierChimneyComponentsToExcel } from '../../../../services/exportService';
import { DownloadIcon } from '../../../../components/icons/DownloadIcon';
import { UploadIcon } from '../../../../components/icons/UploadIcon';

declare const XLSX: any;

interface ChimneyComponentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    components: ChimneyComponentsData;
    onSave: (data: ChimneyComponentsData) => void;
}

export const ChimneyComponentsModal: React.FC<ChimneyComponentsModalProps> = ({ isOpen, onClose, components, onSave }) => {
    const [localComponents, setLocalComponents] = useState<ChimneyComponentsData>(components);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLocalComponents(components);
            setSearchTerm('');
        }
    }, [isOpen, components]);

    const handleSave = () => {
        onSave(localComponents);
        onClose();
    };

    const handleComponentChange = (id: string, field: 'name' | 'price', value: string) => {
        const updatedComponent = { ...localComponents[id] };
        if (field === 'price') {
            const price = parseFloat(value);
            updatedComponent.price = isNaN(price) ? 0 : price;
        } else {
            updatedComponent.name = value;
        }
        setLocalComponents(prev => ({...prev, [id]: updatedComponent }));
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
                
                if (rows.length < 2) throw new Error("Plik jest pusty lub nie zawiera nagłówków.");

                const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
                const idIndex = headers.indexOf('id');
                const nameIndex = headers.indexOf('nazwa');
                const priceIndex = headers.indexOf('cena netto');

                if (idIndex === -1 || nameIndex === -1 || priceIndex === -1) {
                    throw new Error("Brak wymaganych kolumn w pliku: ID, Nazwa, Cena netto");
                }
                
                const newComponentsData = { ...localComponents };
                let updatedCount = 0;

                rows.slice(1).forEach(row => {
                    const id = row[idIndex];
                    if (id && newComponentsData[id]) {
                        newComponentsData[id] = {
                            id: String(id),
                            name: String(row[nameIndex]),
                            price: parseFloat(String(row[priceIndex])) || 0,
                        };
                        updatedCount++;
                    }
                });
                
                if (updatedCount === 0) throw new Error("Nie znaleziono pasujących ID komponentów do zaktualizowania.");
                
                setLocalComponents(newComponentsData);
                alert(`Import zakończony sukcesem! Zaktualizowano ${updatedCount} elementów.`);
            } catch (error) {
                console.error("Błąd podczas importu elementów kominowych:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                if(e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    const filteredComponents = Object.values(localComponents).filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => a.name.localeCompare(b.name));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Zarządzaj Elementami Systemów Kominowych">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        type="text"
                        placeholder="Szukaj po nazwie lub ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <UploadIcon /> Importuj
                    </button>
                    <button onClick={() => exportLeierChimneyComponentsToExcel(Object.values(localComponents))} className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <DownloadIcon /> Eksportuj
                    </button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2 w-1/2">Nazwa</th>
                                <th className="px-4 py-2">Cena Netto (zakup)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredComponents.map(component => (
                                <tr key={component.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-1 font-mono text-xs text-slate-500">{component.id}</td>
                                    <td className="px-4 py-1">
                                        <Input 
                                            type="text" 
                                            value={component.name} 
                                            onChange={e => handleComponentChange(component.id, 'name', e.target.value)}
                                            className="text-sm p-1"
                                        />
                                    </td>
                                    <td className="px-4 py-1">
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            value={component.price} 
                                            onChange={e => handleComponentChange(component.id, 'price', e.target.value)}
                                            className="text-sm p-1 w-28 text-right"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Anuluj</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Zapisz Zmiany</button>
            </div>
        </Modal>
    );
};
