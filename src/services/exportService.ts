// This tells TypeScript that a global variable 'XLSX' exists,
// which is loaded from a <script> tag in index.html.
declare const XLSX: any;

import type { PorothermAgreement } from '../types';
import type { ChimneyComponent } from '../features/leier/chimney/types';

export const formatCurrency = (value: number) => `${Number(value).toFixed(2)} zł`;
export const formatPercentage = (value: number) => `${(Number(value) * 100).toFixed(1)}%`;

const exportToExcel = (data: any[], sheetName: string, fileName: string) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
};

export const exportPorothermToExcel = (products: any[], agreement: PorothermAgreement) => {
    const excelData = products.map(product => ({
        'Nazwa produktu': product.name,
        'Lokalizacja': product.location,
        'Cennik net': product.netPrice,
        'Rabat dod.': `${(product.additionalDiscount * 100).toFixed(1)}%`,
        'Zakup netto': product.netPurchasePrice.toFixed(2),
        'Transp/szt.': product.transportPerUnit.toFixed(2),
        'Loco Malbork': product.localPrice.toFixed(2),
        'Cena netto KL': product.customerNetPrice.toFixed(2),
        'Cena brutto KL': product.customerGrossPrice.toFixed(2),
        'szt./paleta': product.unitsPerPallet,
        'palety/auto': product.palletsPerTruck,
        'Kategoria': product.category || '',
        'Specyfikacja': product.specifications || ''
    }));
    const fileName = `POROTHERM_${agreement.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'POROTHERM', fileName);
};

export const exportSolbetToExcel = (products: any[]) => {
    const excelData = products.map(p => ({
        'ID': p.id,
        'Nazwa produktu': p.name,
        'Gęstość': p.density,
        'Szerokość': p.width,
        'Wysokość': p.height,
        'Długość': p.length,
        'Cena netto': p.priceNet,
        'Kategoria': p.category,
        'Sztuk na palecie': p.unitsPerPallet,
        'Palet na auto': p.palletsPerTruck,
    }));
    const fileName = `SOLBET_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'SOLBET', fileName);
};

export const exportBrukbetToExcel = (products: any[]) => {
    const excelData = products.map(p => ({
        'Symbol': p.symbol,
        'Nazwa': p.nazwa,
        'ZP': p.zp,
        'Grupa': p.grupa,
        'Cena netto': p.cenaNetto,
        'Rabat (%)': p.rabat,
        'Cena po rabacie': p.cenaPoRabacie.toFixed(2),
        'Koszt transportu/szt.': p.transportPerUnit.toFixed(2),
        'Cena sprzedaży netto': p.cenaSprzedazyNetto.toFixed(2),
        'Cena sprzedaży brutto': p.cenaSprzedazyBrutto.toFixed(2),
        'Ilość na palecie': p.iloscNaPalecie,
        'Jednostka': p.jednostka,
        'Waga palety (t)': p.waga,
        'Maks. palet na auto': p.maxPalletsPerTruck,
    }));
    const fileName = `BRUKBET_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'BRUK-BET', fileName);
};

export const exportSemmelrockToExcel = (products: any[]) => {
    const excelData = products.map(p => ({
        'Symbol': p.symbol,
        'Grupa': p.grupa,
        'Nazwa': p.nazwa,
        'Cena netto': p.cenaNetto,
        'Jednostka': p.jednostka,
        'Rabat (%)': p.rabat,
        'Cena po rabacie': p.cenaPoRabacie.toFixed(2),
        'Koszt transportu/szt.': p.transportPerUnit.toFixed(2),
        'Cena sprzedaży netto': p.cenaSprzedazyNetto.toFixed(2),
        'Cena sprzedaży brutto': p.cenaSprzedazyBrutto.toFixed(2),
        'Ilość na palecie': p.iloscNaPalecie,
        'Maks. palet/auto': p.maxPalletsPerTruck,
        'Waga palety (t)': p.waga,
    }));
    const fileName = `SEMMELROCK_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'SEMMELROCK', fileName);
};

export const exportPolbrukToExcel = (products: any[]) => {
    const excelData = products.map(p => ({
        'Symbol': p.symbol,
        'Nazwa': p.nazwa,
        'Kolor': p.kolor,
        'Kształt': p.ksztalt,
        'Cena detaliczna': p.cenaNetto,
        'Rabat (%)': p.rabat,
        'Cena po rabacie': p.cenaPoRabacie.toFixed(2),
        'Koszt transportu/szt.': p.transportPerUnit.toFixed(2),
        'Cena sprzedaży netto': p.cenaSprzedazyNetto.toFixed(2),
        'Cena sprzedaży brutto': p.cenaSprzedazyBrutto.toFixed(2),
        'Ilość na palecie': p.iloscNaPalecie,
        'Jednostka': p.jednostka,
        'Waga palety (t)': p.waga,
        'Maks. palet na auto': p.maxPalletsPerTruck,
    }));
    const fileName = `POLBRUK_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'POLBRUK', fileName);
};

export const exportLeierToExcel = (products: any[]) => {
    const excelData = products.map(p => ({
        'Symbol': p.symbol,
        'Nazwa': p.nazwa,
        'Cena netto': p.cenaNetto,
        'Jednostka': p.jednostka,
        'Rabat (%)': p.rabat,
        'Cena po rabacie': p.cenaPoRabacie.toFixed(2),
        'Koszt transportu/szt.': p.transportPerUnit.toFixed(2),
        'Cena sprzedaży netto': p.cenaSprzedazyNetto.toFixed(2),
        'Cena sprzedaży brutto': p.cenaSprzedazyBrutto.toFixed(2),
        'Ilość na palecie': p.iloscNaPalecie,
        'Waga palety (t)': p.waga,
        'Palet/auto': p.palletsPerTruck,
    }));
    const fileName = `LEIER_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'LEIER', fileName);
};

export const exportLeierChimneyComponentsToExcel = (components: ChimneyComponent[]) => {
    const excelData = components.map(c => ({
        'ID': c.id,
        'Nazwa': c.name,
        'Cena netto': c.price.toFixed(2),
    }));
    const fileName = `LEIER_Elementy_Kominowe_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, 'Elementy Kominowe', fileName);
};
