
import React, { useState, useMemo, useRef } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { INITIAL_LEIER_DATA } from '../../constants';
import { calculateLeierProduct } from '../../services/calculationService';
import { exportLeierToExcel, formatCurrency } from '../../services/exportService';
import type { LeierData, LeierProduct, CalculatedLeierProduct } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FormGroup, Input } from '../../components/ui/FormControls';
import { AddIcon } from '../../components/icons/AddIcon';
import { DeleteIcon } from '../../components/icons/DeleteIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { LeierProductForm } from './LeierProductForm';
import { LeierChimneyCalculator } from './chimney/LeierChimneyCalculator';
import { LoadingOverlay } from '../../components/ui/Spinner';

declare const XLSX: any;

const LeierMaterialsCalculator: React.FC = () => {
    const [data, setData, isLoading] = useSupabaseData<LeierData>('leier', INITIAL_LEIER_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<LeierProduct | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openProductModal = (product: LeierProduct | null = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const handleSettingChange = (key: keyof LeierData['settings'], value: string) => {
        const finalValue = value === '' ? null : parseFloat(value);
        if (finalValue !== null && isNaN(finalValue)) return;
        setData(prev => ({ ...prev, settings: { ...prev.settings, [key]: finalValue } }));
    };

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return !term
            ? data.products
            : data.products.filter(p =>
                (p.nazwa?.toLowerCase().includes(term)) ||
                (p.symbol?.toLowerCase().includes(term))
            );
    }, [data.products, searchTerm]);

    const calculatedProducts = useMemo<CalculatedLeierProduct[]>(() => {
        return filteredProducts.map(p => calculateLeierProduct(p, data.settings));
    }, [filteredProducts, data.settings]);

    const handleSaveProduct = (productData: LeierProduct) => {
        setData(prev => ({
            ...prev,
            products: productData.id
                ? prev.products.map(p => (p.id === productData.id ? { ...p, ...productData } : p))
                : [...prev.products, { ...productData, id: `leier_${Date.now()}` }]
        }));
        closeProductModal();
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            setData(currentData => ({
                ...currentData,
                products: currentData.products.filter(p => p.id !== productId),
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
                    symbol: getIndex('Symbol'),
                    nazwa: getIndex('Nazwa'),
                    rabat: getIndex('Rabat (%)'),
                    jednostka: getIndex('Jednostka'),
                    iloscNaPalecie: getIndex('Ilość na palecie'),
                    waga: getIndex('Waga palety (t)'),
                    cenaNetto: getIndex('Cena netto'),
                    palletsPerTruck: getIndex('palet/auto'),
                };

                const newProducts: LeierProduct[] = rows.slice(1).map((row, i) => {
                    if (!row || row.every(cell => cell === null || cell === '')) return null;
                    const nazwa = row[colIndices.nazwa];
                    if (!nazwa || String(nazwa).trim() === '') return null;

                    return {
                        id: `leier_imported_${Date.now()}_${i}`,
                        symbol: String(row[colIndices.symbol] || ''),
                        nazwa: String(nazwa),
                        rabat: parseFloat(String(row[colIndices.rabat])) || null,
                        jednostka: String(row[colIndices.jednostka] || 'szt.'),
                        iloscNaPalecie: parseFloat(String(row[colIndices.iloscNaPalecie])) || null,
                        waga: parseFloat(String(row[colIndices.waga])) || null,
                        cenaNetto: parseFloat(String(row[colIndices.cenaNetto])) || null,
                        palletsPerTruck: parseFloat(String(row[colIndices.palletsPerTruck])) || null,
                    };
                }).filter((p): p is LeierProduct => p !== null);

                if (newProducts.length > 0) {
                    setData(prev => ({ ...prev, products: newProducts }));
                    alert(`Import zakończony! Zaimportowano ${newProducts.length} produktów.`);
                } else {
                    throw new Error("Nie znaleziono prawidłowych produktów do zaimportowania.");
                }
            } catch (error) {
                console.error("Błąd podczas importu pliku LEIER:", error);
                alert(`Wystąpił błąd podczas importu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
            } finally {
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (isLoading) {
        return <LoadingOverlay text="Ładowanie danych materiałów Leier..." />
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-blue-600">LEIER - Materiały Budowlane</h1><p className="text-slate-500">Systemy budowlane</p></div>
                <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><UploadIcon /> Importuj XLS</button>
                    <button onClick={() => exportLeierToExcel(calculatedProducts)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><DownloadIcon /> Eksportuj XLS</button>
                </div>
            </header>
            <Card>
                <CardHeader><CardTitle>Ustawienia Ogólne</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <FormGroup label="Stawka transportu (zł)"><Input type="number" step="50" value={data.settings.transportRate ?? ''} onChange={e => handleSettingChange('transportRate', e.target.value)} /></FormGroup>
                    <FormGroup label="Marża (%)"><Input type="number" step="1" min="0" max="100" value={data.settings.margin ?? ''} onChange={e => handleSettingChange('margin', e.target.value)} /></FormGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Produkty ({calculatedProducts.length} / {data.products.length})</CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input type="text" placeholder="Szukaj produktów..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 p-2 border border-slate-300 rounded-md text-sm" />
                        <button onClick={() => openProductModal()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"><AddIcon /> Dodaj</button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    {['Symbol', 'Nazwa', 'Cena netto', 'Jednostka', 'Rabat(%)', 'Po rabacie', 'Transp/szt.', 'Sprzedaż netto', 'Sprzedaż brutto', 'Ilość/paleta', 'Waga (t)', 'Palet/auto', 'Akcje']
                                        .map((h, i) => <th key={h} scope="col" className={`px-4 py-3 ${i === 1 ? 'w-full' : ''}`}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {calculatedProducts.map(p => (
                                    <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap align-top">{p.symbol}</td>
                                        <td className="px-4 py-2 align-top">{p.nazwa}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{formatCurrency(p.cenaNetto || 0)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.jednostka}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.rabat || 0}%</td>
                                        <td className="px-4 py-2 bg-slate-50 font-semibold whitespace-nowrap align-top">{formatCurrency(p.cenaPoRabacie)}</td>
                                        <td className="px-4 py-2 bg-slate-50 whitespace-nowrap align-top">{formatCurrency(p.transportPerUnit)}</td>
                                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-700 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyNetto)}</td>
                                        <td className="px-4 py-2 bg-blue-50 font-bold text-blue-900 whitespace-nowrap align-top">{formatCurrency(p.cenaSprzedazyBrutto)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.iloscNaPalecie}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.waga}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">{p.palletsPerTruck}</td>
                                        <td className="px-4 py-2 whitespace-nowrap align-top">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openProductModal(p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <Modal isOpen={isProductModalOpen} onClose={closeProductModal} title={editingProduct ? 'Edytuj Produkt LEIER' : 'Dodaj Produkt LEIER'}>
                <LeierProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={closeProductModal} />
            </Modal>
        </div>
    );
};

export const LeierCalculator: React.FC = () => {
    return (
        <div className="space-y-8">
            <LeierMaterialsCalculator />

            <div className="border-t-4 border-dashed border-slate-300 my-8"></div>

            <LeierChimneyCalculator />
        </div>
    )
}