import React, { useState, useMemo, useRef } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { INITIAL_BRUKBET_DATA } from '../../constants';
import { calculateBrukbetProduct } from '../../services/calculationService';
import { exportBrukbetToExcel, formatCurrency } from '../../services/exportService';
import type { BrukbetData, BrukbetFactory, BrukbetProduct } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input, Select } from '../../components/ui/FormControls';
import { AddIcon } from '../../components/icons/AddIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SettingsIcon } from '../../components/icons/SettingsIcon';
import { BrukbetProductForm } from './BrukbetProductForm';
import { BrukbetFactoryManagerModal } from './BrukbetFactoryManagerModal';
import { LoadingOverlay } from '../../components/ui/Spinner';

declare const XLSX: any;

export const BrukbetCalculator: React.FC = () => {
    const [data, setData, isLoading] = useSupabaseData<BrukbetData>('brukbet', INITIAL_BRUKBET_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isFactoryModalOpen, setIsFactoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<BrukbetProduct | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openProductModal = (product: BrukbetProduct | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return data.products;
        return data.products.filter(p => 
            (p.nazwa?.toLowerCase().includes(term)) || (p.symbol?.toLowerCase().includes(term)) ||
            (p.grupa?.toLowerCase().includes(term)) || (p.zp?.toLowerCase().includes(term))
        );
    }, [data.products, searchTerm]);

    const calculatedProducts = useMemo(() => {
        return filteredProducts.map(p => calculateBrukbetProduct(p, data.settings));
    }, [filteredProducts, data.settings]);

    const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const factoryId = e.target.value;
        const factory = data.settings.factories.find(f => f.id === factoryId);
        if (factory) setData(prev => ({ ...prev, settings: { ...prev.settings, factory: factoryId, transportRate: factory.kosztTransportu } }));
    };
    
    const handleSettingChange = (key: keyof Omit<BrukbetData['settings'], 'factories' | 'discounts' | 'factory'>, value: string) => {
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && isNaN(finalValue)) return;
        setData(prev => ({...prev, settings: {...prev.settings, [key]: finalValue }}));
    };

    const handleDiscountChange = (group: string, value: string) => {
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && (isNaN(finalValue) || finalValue < 0 || finalValue > 100)) return;
        setData(prev => ({...prev, settings: {...prev.settings, discounts: {...prev.settings.discounts, [group]: finalValue }}}));
    };
    
    const handleSaveFactories = (newFactories: BrukbetFactory[]) => {
        setData(prev => {
            const currentSelectedFactoryExists = newFactories.some(f => f.id === prev.settings.factory);
            const newSelectedFactoryId = currentSelectedFactoryExists ? prev.settings.factory : (newFactories[0]?.id || null);
            const newSelectedFactory = newFactories.find(f => f.id === newSelectedFactoryId);

            return {
                ...prev,
                settings: {
                    ...prev.settings, factories: newFactories, factory: newSelectedFactoryId || '',
                    transportRate: newSelectedFactory ? newSelectedFactory.kosztTransportu : 0,
                }
            };
        });
    };

    const handleSaveProduct = (productData: BrukbetProduct) => {
        setData(prev => ({
            ...prev,
            products: productData.id 
                ? prev.products.map(p => p.id === productData.id ? { ...p, ...productData } : p)
                : [...prev.products, { ...productData, id: `bruk_${Date.now()}` }]
        }));
        closeProductModal();
    };
    
    const handleDeleteProduct = (productId: string) => {
        if(window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
             setData(currentData => ({
                ...currentData,
                products: currentData.products.filter(p => p.id !== productId)
            }));
        }
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

                const headers = rows[0].map(h => String(h || '').trim());
                const lowerCaseHeaders = headers.map(h => h.toLowerCase());
                const requiredHeaders = ['symbol', 'nazwa', 'cena netto'];
                const missingRequiredHeaders = requiredHeaders.filter(rh => !lowerCaseHeaders.includes(rh.toLowerCase()));

                if (missingRequiredHeaders.length > 0) {
                    throw new Error(`Brak wymaganych kolumn w pliku: ${missingRequiredHeaders.join(', ')}`);
                }

                const getIndex = (header: string) => lowerCaseHeaders.indexOf(header.toLowerCase());

                const colIndices = {
                    symbol: getIndex('symbol'), grupa: getIndex('grupa'), nazwa: getIndex('nazwa'), zp: getIndex('zp'),
                    waga: getIndex('waga palety (t)'), maxPalletsPerTruck: getIndex('maks. palet na auto'),
                    iloscNaPalecie: getIndex('ilość na palecie'), jednostka: getIndex('jednostka'), cenaNetto: getIndex('cena netto'),
                };

                const newProducts: BrukbetProduct[] = rows.slice(1).map((row, i) => {
                    if (!row || row.every(cell => cell === null || cell === '')) return null;
                    const symbol = row[colIndices.symbol];
                    const nazwa = row[colIndices.nazwa];
                    if ((!symbol || String(symbol).trim() === '') && (!nazwa || String(nazwa).trim() === '')) return null;

                    return {
                        id: `bruk_imported_${Date.now()}_${i}`, symbol: String(symbol || ''), grupa: String(row[colIndices.grupa] || 'STANDARD'), nazwa: String(nazwa || ''), zp: String(row[colIndices.zp] || ''),
                        waga: parseFloat(String(row[colIndices.waga])) || 0, maxPalletsPerTruck: parseInt(String(row[colIndices.maxPalletsPerTruck])) || 0,
                        iloscNaPalecie: parseInt(String(row[colIndices.iloscNaPalecie])) || 0, jednostka: String(row[colIndices.jednostka] || 'szt.'), cenaNetto: parseFloat(String(row[colIndices.cenaNetto])) || 0,
                    };
                }).filter((p): p is BrukbetProduct => p !== null);

                if (newProducts.length === 0) throw new Error("Nie znaleziono żadnych prawidłowych produktów do zaimportowania.");

                setData(prev => ({...prev, products: newProducts }));
                alert(`Import zakończony! Zaimportowano ${newProducts.length} produktów.`);
            } catch (error) {
                console.error("Błąd podczas importu pliku BRUK-BET:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                if(e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych Bruk-Bet..."/>
    }

    const groupColors: Record<string, string> = { 'PRESTIGE': 'bg-amber-100 text-amber-800', 'UNI-DECOR': 'bg-sky-100 text-sky-800', 'STANDARD': 'bg-slate-100 text-slate-800', 'WYROBY UZUPEŁNIAJĄCE': 'bg-gray-100 text-gray-800' };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-blue-600">BRUK-BET</h1><p className="text-slate-500">Kostka brukowa i płyty</p></div>
                 <div className="flex gap-2">
                     <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                     <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><UploadIcon /> Importuj XLS</button>
                    <button onClick={() => exportBrukbetToExcel(calculatedProducts)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><DownloadIcon /> Eksportuj XLS</button>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                     <CardHeader><CardTitle>Ustawienia Główne</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="sm:col-span-2">
                             <label className="text-sm font-medium text-slate-600 flex items-center justify-between mb-1">
                                 <span>Zakład produkcyjny</span>
                                 <button onClick={() => setIsFactoryModalOpen(true)} className="p-1 text-slate-500 hover:text-blue-600 rounded-full hover:bg-blue-50" title="Zarządzaj zakładami"><SettingsIcon /></button>
                             </label>
                             <Select value={data.settings.factory} onChange={handleFactoryChange} className="w-full">{data.settings.factories.map(f => <option key={f.id} value={f.id}>{f.nazwa}</option>)}</Select>
                         </div>
                         <div><label className="text-sm font-medium text-slate-600">Stawka transportu</label><p className="font-semibold pt-2 mt-1 text-lg">{formatCurrency(data.settings.transportRate || 0)}</p></div>
                         <FormGroup label="Marża (%)"><Input type="number" step="1" min="0" max="100" value={data.settings.margin ?? ''} onChange={e => handleSettingChange('margin', e.target.value)} /></FormGroup>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Rabaty</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">{Object.entries(data.settings.discounts).map(([group, discount]) => (<FormGroup label={`${group} (%)`} key={group}><Input type="number" step="1" min="0" max="100" value={discount ?? ''} onChange={e => handleDiscountChange(group, e.target.value)} /></FormGroup>))}</CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div><CardTitle>Produkty ({calculatedProducts.length} / {data.products.length})</CardTitle></div>
                   <div className="flex gap-2 w-full sm:w-auto">
                        <input type="text" placeholder="Szukaj produktów..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 p-2 border border-slate-300 rounded-md text-sm" />
                        <button onClick={() => openProductModal()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"><AddIcon /> Dodaj</button>
                   </div>
                </CardHeader>
                <CardContent><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr>{['Symbol', 'Nazwa', 'ZP', 'Grupa', 'Cena netto', 'Rabat(%)', 'Po rabacie', 'Transp/szt.', 'Sprzedaż netto', 'Sprzedaż brutto', 'Ilość/paleta', 'Jednostka', 'Waga palety (t)', 'Maks. palet', 'Akcje'].map((h, i) => <th key={h} scope="col" className={`px-4 py-3 ${i === 1 ? 'w-full' : ''}`}>{h}</th>)}</tr></thead>
                    <tbody>{calculatedProducts.map(p => (<tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap align-top">{p.symbol}</td>
                        <td className="px-4 py-2 align-top">{p.nazwa}</td><td className="px-4 py-2 whitespace-nowrap align-top">{p.zp}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><span className={`px-2 py-1 text-xs font-medium rounded-full ${groupColors[p.grupa] || 'bg-slate-100 text-slate-800'}`}>{p.grupa}</span></td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatCurrency(p.cenaNetto || 0)}</td><td className="px-4 py-2 whitespace-nowrap align-top">{p.rabat}%</td>
                        <td className="px-4 py-2 bg-slate-50 font-semibold whitespace-nowrap align-top">{formatCurrency(p.cenaPoRabacie)}</td>
                        <td className="px-4 py-2 bg-slate-50 whitespace-nowrap align-top">{formatCurrency(p.transportPerUnit)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-700 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyNetto)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-900 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyBrutto)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.iloscNaPalecie}</td><td className="px-4 py-2 whitespace-nowrap align-top">{p.jednostka}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.waga}</td><td className="px-4 py-2 whitespace-nowrap align-top">{p.maxPalletsPerTruck}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><div className="flex items-center gap-2"><button onClick={() => openProductModal(p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button><button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button></div></td>
                    </tr>))}</tbody>
                </table></div></CardContent>
            </Card>
             <Modal isOpen={isProductModalOpen} onClose={closeProductModal} title={editingProduct ? 'Edytuj Produkt BRUK-BET' : 'Dodaj Produkt BRUK-BET'}>
                <BrukbetProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeProductModal} groups={Object.keys(data.settings.discounts)}/>
            </Modal>
            <BrukbetFactoryManagerModal isOpen={isFactoryModalOpen} onClose={() => setIsFactoryModalOpen(false)} factories={data.settings.factories} onSave={handleSaveFactories}/>
        </div>
    );
};
