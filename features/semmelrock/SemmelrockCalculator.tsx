
import React, { useState, useMemo, useRef } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { INITIAL_SEMMELROCK_DATA } from '../../constants';
import { calculateSemmelrockProduct } from '../../services/calculationService';
import { exportSemmelrockToExcel, formatCurrency } from '../../services/exportService';
import type { SemmelrockData, SemmelrockProduct } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input } from '../../components/ui/FormControls';
import { AddIcon } from '../../components/icons/AddIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SemmelrockProductForm } from './SemmelrockProductForm';
import { LoadingOverlay } from '../../components/ui/Spinner';

declare const XLSX: any;

export const SemmelrockCalculator: React.FC = () => {
    const [data, setData, isLoading] = useSupabaseData<SemmelrockData>('semmelrock', INITIAL_SEMMELROCK_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SemmelrockProduct | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openProductModal = (product: SemmelrockProduct | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const handleSettingChange = (key: keyof SemmelrockData['settings'], value: string) => {
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && isNaN(finalValue)) return;
        setData(prev => ({...prev, settings: {...prev.settings, [key]: finalValue }}));
    };

    const handleDiscountChange = (group: string, value: string) => {
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && (isNaN(finalValue) || finalValue < 0 || finalValue > 100)) return;
        setData(prev => ({...prev, settings: {...prev.settings, discounts: {...prev.settings.discounts, [group]: finalValue }}}));
    };
    
    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return !term
            ? data.products
            : data.products.filter(p => 
                (p.nazwa && p.nazwa.toLowerCase().includes(term)) ||
                (p.symbol && p.symbol.toLowerCase().includes(term)) ||
                (p.grupa && p.grupa.toLowerCase().includes(term))
              );
    }, [data.products, searchTerm]);

    const calculatedProducts = useMemo(() => {
        return filteredProducts.map(p => calculateSemmelrockProduct(p, data.settings));
    }, [filteredProducts, data.settings]);

    const handleSaveProduct = (productData: SemmelrockProduct) => {
        setData(prev => ({
            ...prev,
            products: prev.products.some(p => p.symbol === productData.symbol)
                ? prev.products.map(p => p.symbol === productData.symbol ? { ...p, ...productData } : p)
                : [...prev.products, { ...productData, symbol: productData.symbol || `semm_${Date.now()}` }]
        }));
        closeProductModal();
    };
    
    const handleDeleteProduct = (productSymbol: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
             setData(currentData => ({
                ...currentData,
                products: currentData.products.filter(p => p.symbol !== productSymbol)
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
                const requiredHeaders = ['Symbol', 'Nazwa', 'Cena netto'];
                const missingRequiredHeaders = requiredHeaders.filter(rh => !lowerCaseHeaders.includes(rh.toLowerCase()));

                if (missingRequiredHeaders.length > 0) {
                    throw new Error(`Brak wymaganych kolumn w pliku: ${missingRequiredHeaders.join(', ')}`);
                }

                const getIndex = (header: string) => lowerCaseHeaders.indexOf(header.toLowerCase());

                const colIndices = {
                    symbol: getIndex('Symbol'), grupa: getIndex('Grupa'), nazwa: getIndex('Nazwa'),
                    iloscNaPalecie: getIndex('Ilość na palecie'), jednostka: getIndex('Jednostka'),
                    waga: getIndex('Waga palety (t)'), cenaNetto: getIndex('Cena netto'),
                    maxPalletsPerTruck: getIndex('Maks. palet/auto'),
                };

                const newProducts: SemmelrockProduct[] = rows.slice(1).map((row, i) => {
                    if (!row || row.every(cell => cell === null || cell === '')) return null;
                    const nazwa = row[colIndices.nazwa];
                    if (!nazwa || String(nazwa).trim() === '') return null;

                    return {
                        symbol: row[colIndices.symbol] || `semm_imported_${Date.now()}_${i}`,
                        grupa: String(row[colIndices.grupa] || ''),
                        nazwa: String(nazwa),
                        iloscNaPalecie: parseFloat(String(row[colIndices.iloscNaPalecie])) || 0,
                        jednostka: String(row[colIndices.jednostka] || 'm²'),
                        waga: parseFloat(String(row[colIndices.waga])) || 0,
                        cenaNetto: parseFloat(String(row[colIndices.cenaNetto])) || 0,
                        maxPalletsPerTruck: parseInt(String(row[colIndices.maxPalletsPerTruck])) || 0,
                    };
                }).filter((p): p is SemmelrockProduct => p !== null);

                if (newProducts.length > 0) {
                    setData(prev => ({ ...prev, products: newProducts }));
                    alert(`Import zakończony! Zaimportowano ${newProducts.length} produktów.`);
                } else {
                    throw new Error("Nie znaleziono prawidłowych produktów do zaimportowania.");
                }
            } catch (error) {
                console.error("Błąd podczas importu pliku SEMMELROCK:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych Semmelrock..."/>
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">SEMMELROCK stein+design</h1>
                    <p className="text-slate-500">Rozwiązania krajobrazowe</p>
                </div>
                <div className="flex gap-2">
                     <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                     <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <UploadIcon /> Importuj XLS
                    </button>
                    <button onClick={() => exportSemmelrockToExcel(calculatedProducts)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <DownloadIcon /> Eksportuj XLS
                    </button>
                </div>
            </header>
            <Card>
                <CardHeader><CardTitle>Ustawienia</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormGroup label="Stawka transportu (zł)"><Input type="number" step="50" value={data.settings.transportRate ?? ''} onChange={e => handleSettingChange('transportRate', e.target.value)} /></FormGroup>
                    <FormGroup label="Marża (%)"><Input type="number" step="1" min="0" max="100" value={data.settings.margin ?? ''} onChange={e => handleSettingChange('margin', e.target.value)} /></FormGroup>
                    <FormGroup label="Masa auta (t)"><Input type="number" step="1" value={data.settings.truckWeight ?? ''} onChange={e => handleSettingChange('truckWeight', e.target.value)} /></FormGroup>
                    <FormGroup label="Max palet/auto"><Input type="number" step="1" value={data.settings.maxPalletsPerTruck ?? ''} onChange={e => handleSettingChange('maxPalletsPerTruck', e.target.value)} /></FormGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Rabaty Grupowe</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(data.settings.discounts).map(([group, discount]) => (
                        <FormGroup label={`Grupa ${group} (%)`} key={group}>
                            <Input type="number" step="1" min="0" max="100" value={discount ?? ''} onChange={e => handleDiscountChange(group, e.target.value)} />
                        </FormGroup>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Produkty ({calculatedProducts.length} / {data.products.length})</CardTitle>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <input type="text" placeholder="Szukaj produktów..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 p-2 border border-slate-300 rounded-md text-sm" />
                        <button onClick={() => openProductModal()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
                            <AddIcon /> Dodaj
                        </button>
                     </div>
                </CardHeader>
                <CardContent><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr>{['Symbol', 'Nazwa', 'Jedn.', 'Grupa', 'Cena Netto', 'Rabat', 'Po rabacie', 'Transp/szt.', 'Netto KL', 'Brutto KL', 'Ilość/pal', 'Maks palet/auto', 'Waga (t)', 'Akcje'].map((h, i) => <th key={h} scope="col" className={`px-4 py-3 ${ i === 1 ? 'w-full' : ''}`}>{h}</th>)}</tr></thead>
                    <tbody>{calculatedProducts.map(p => (<tr key={p.symbol} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap align-top">{p.symbol}</td>
                        <td className="px-4 py-2 align-top">{p.nazwa}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.jednostka}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">{p.grupa}</span></td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatCurrency(p.cenaNetto || 0)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.rabat}%</td>
                        <td className="px-4 py-2 bg-slate-50 font-semibold whitespace-nowrap align-top">{formatCurrency(p.cenaPoRabacie)}</td>
                        <td className="px-4 py-2 bg-slate-50 whitespace-nowrap align-top">{formatCurrency(p.transportPerUnit)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-700 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyNetto)}</td>
                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-900 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyBrutto)}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.iloscNaPalecie}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.maxPalletsPerTruck}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.waga}</td>
                        <td className="px-4 py-2 whitespace-nowrap align-top"><div className="flex items-center gap-2">
                            <button onClick={() => openProductModal(p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                            <button onClick={() => handleDeleteProduct(p.symbol)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                        </div></td>
                    </tr>))}</tbody>
                </table></div></CardContent>
            </Card>
             <Modal isOpen={isProductModalOpen} onClose={closeProductModal} title={editingProduct ? 'Edytuj Produkt SEMMELROCK' : 'Dodaj Produkt SEMMELROCK'}>
                <SemmelrockProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeProductModal} />
            </Modal>
        </div>
    );
};