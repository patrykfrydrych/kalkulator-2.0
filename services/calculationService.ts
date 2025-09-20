
import type { PorothermProduct, PorothermAgreement, SolbetProduct, SolbetSettings, BrukbetProduct, BrukbetSettings, SemmelrockProduct, SemmelrockSettings, PolbrukProduct, PolbrukSettings, LeierProduct, LeierSettings } from '../types';

const VAT_RATE = 1.23;

export const calculatePorothermProduct = (product: PorothermProduct, agreement: PorothermAgreement) => {
    const netPrice = Number(product.netPrice) || 0;
    const basicDiscount = Number(agreement.settings.basicDiscount) || 0;
    const productAdditionalDiscount = Number(product.additionalDiscount) || 0;
    const cashDiscount = Number(agreement.settings.cashDiscount) || 0;
    const margin = Number(agreement.settings.margin) || 0;

    const basicDiscountAmount = netPrice * basicDiscount;
    const additionalDiscountAmount = netPrice * productAdditionalDiscount;
    const priceAfterDiscounts = netPrice - basicDiscountAmount - additionalDiscountAmount;
    const netPurchasePrice = priceAfterDiscounts * (1 - cashDiscount);
    
    const transportCostPerTruck = product.location === "Lębork" 
        ? Number(agreement.transportCosts.leborkMalbork) || 0
        : Number(agreement.transportCosts.gnaszynMalbork) || 0;
    
    const unitsPerPallet = Number(product.unitsPerPallet) || 0;
    const palletsPerTruck = Number(product.palletsPerTruck) || 0;
    const totalUnitsPerTruck = unitsPerPallet * palletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportCostPerTruck / totalUnitsPerTruck : 0;

    const localPrice = netPurchasePrice + transportPerUnit;
    const customerNetPrice = localPrice * (1 + margin);
    const customerGrossPrice = customerNetPrice * VAT_RATE;
    return { ...product, netPurchasePrice, transportPerUnit, localPrice, customerNetPrice, customerGrossPrice };
};

export const calculateSolbetProduct = (product: SolbetProduct, settings: SolbetSettings) => {
    const priceNet = Number(product.priceNet) || 0;
    const discountPercent = Number(settings.discountPercent) || 0;
    const margin = Number(settings.margin) || 0;
    const transportCost = Number(settings.transportCost) || 0;

    const discountAmount = priceNet * (discountPercent / 100);
    const netPurchasePrice = priceNet - discountAmount;

    const unitsPerPallet = Number(product.unitsPerPallet) || 0;
    const palletsPerTruck = Number(product.palletsPerTruck) || 0;
    const totalUnitsPerTruck = unitsPerPallet * palletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportCost / totalUnitsPerTruck : 0;
    
    const localPrice = netPurchasePrice + transportPerUnit;
    const customerNetPrice = localPrice * (1 + margin / 100);
    const customerGrossPrice = customerNetPrice * VAT_RATE;

    return { ...product, netPurchasePrice, transportPerUnit, localPrice, customerNetPrice, customerGrossPrice };
};

export const calculateBrukbetProduct = (product: BrukbetProduct, settings: BrukbetSettings) => {
    const cenaNetto = Number(product.cenaNetto) || 0;
    const discountPercent = Number(settings.discounts[product.grupa]) || 0;
    const marginPercent = Number(settings.margin) || 0;
    
    const selectedFactory = settings.factories.find(f => f.id === settings.factory);
    const transportCost = selectedFactory ? Number(selectedFactory.kosztTransportu) : 0;

    const cenaPoRabacie = cenaNetto * (1 - discountPercent / 100);

    const unitsPerPallet = parseInt(String(product.iloscNaPalecie)) || 0;
    const palletsPerTruck = Number(product.maxPalletsPerTruck) || 0;
    const totalUnitsPerTruck = unitsPerPallet * palletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportCost / totalUnitsPerTruck : 0;
    
    const localPrice = cenaPoRabacie + transportPerUnit;
    const cenaSprzedazyNetto = localPrice * (1 + marginPercent / 100);
    const cenaSprzedazyBrutto = cenaSprzedazyNetto * VAT_RATE;

    return { ...product, cenaPoRabacie, cenaSprzedazyNetto, cenaSprzedazyBrutto, transportPerUnit, rabat: discountPercent };
};

export const calculateSemmelrockProduct = (product: SemmelrockProduct, settings: SemmelrockSettings) => {
    const cenaNetto = Number(product.cenaNetto) || 0;

    const productGroupKey = Object.keys(settings.discounts).find(key => product.grupa.startsWith(key));
    const discountPercent = productGroupKey ? (Number(settings.discounts[productGroupKey]) || 0) : 0;

    const marginPercent = Number(settings.margin) || 0;
    const transportRate = Number(settings.transportRate) || 0;
    const truckWeight = Number(settings.truckWeight) || 0;
    const palletWeight = Number(product.waga) || 0;
    
    const maxPalletsPerTruck = Number(product.maxPalletsPerTruck) || Number(settings.maxPalletsPerTruck) || 0;

    const cenaPoRabacie = cenaNetto * (1 - discountPercent / 100);

    let calculatedPalletsPerTruck = maxPalletsPerTruck;
    if (palletWeight > 0 && truckWeight > 0) {
        const palletsByWeight = Math.floor(truckWeight / palletWeight);
        calculatedPalletsPerTruck = Math.min(maxPalletsPerTruck, palletsByWeight);
    }
    
    const unitsPerPallet = Number(product.iloscNaPalecie) || 0;
    const totalUnitsPerTruck = unitsPerPallet * calculatedPalletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportRate / totalUnitsPerTruck : 0;
    
    const localPrice = cenaPoRabacie + transportPerUnit;
    const cenaSprzedazyNetto = localPrice * (1 + marginPercent / 100);
    const cenaSprzedazyBrutto = cenaSprzedazyNetto * VAT_RATE;

    return { ...product, rabat: discountPercent, cenaPoRabacie, transportPerUnit, cenaSprzedazyNetto, cenaSprzedazyBrutto };
};

export const calculatePolbrukProduct = (product: PolbrukProduct, settings: PolbrukSettings) => {
    const cenaNetto = Number(product.cenaNetto) || 0;
    const discountPercent = Number(product.rabat) || 0;
    const marginPercent = Number(settings.margin) || 0;
    const transportRate = Number(settings.transportRate) || 0;
    const truckWeight = Number(settings.truckWeight) || 0;
    const maxPalletsPerTruckSetting = Number(product.maxPalletsPerTruck) || Number(settings.maxPalletsPerTruck) || 0;
    const palletWeight = Number(product.waga) || 0;

    const cenaPoRabacie = cenaNetto * (1 - discountPercent / 100);

    let palletsPerTruck = maxPalletsPerTruckSetting;
    if (palletWeight > 0 && truckWeight > 0) {
        const palletsByWeight = Math.floor(truckWeight / palletWeight);
        palletsPerTruck = Math.min(maxPalletsPerTruckSetting, palletsByWeight);
    }

    const unitsPerPallet = Number(product.iloscNaPalecie) || 0;
    const totalUnitsPerTruck = unitsPerPallet * palletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportRate / totalUnitsPerTruck : 0;

    const localPrice = cenaPoRabacie + transportPerUnit;
    const cenaSprzedazyNetto = localPrice * (1 + marginPercent / 100);
    const cenaSprzedazyBrutto = cenaSprzedazyNetto * VAT_RATE;

    return { ...product, rabat: discountPercent, cenaPoRabacie, transportPerUnit, cenaSprzedazyNetto, cenaSprzedazyBrutto };
};

export const calculateLeierProduct = (product: LeierProduct, settings: LeierSettings) => {
    const cenaNetto = Number(product.cenaNetto) || 0;
    const discountPercent = Number(product.rabat) || 0;
    const marginPercent = Number(settings.margin) || 0;
    const transportRate = Number(settings.transportRate) || 0;

    const cenaPoRabacie = cenaNetto * (1 - discountPercent / 100);

    const palletsPerTruck = Number(product.palletsPerTruck) || 22; // Use product value, fallback to 22
    const unitsPerPallet = Number(product.iloscNaPalecie) || 0;
    const totalUnitsPerTruck = unitsPerPallet * palletsPerTruck;
    const transportPerUnit = totalUnitsPerTruck > 0 ? transportRate / totalUnitsPerTruck : 0;
    
    const localPrice = cenaPoRabacie + transportPerUnit;
    const cenaSprzedazyNetto = localPrice * (1 + marginPercent / 100);
    const cenaSprzedazyBrutto = cenaSprzedazyNetto * VAT_RATE;

    return { 
        ...product, 
        cenaPoRabacie, 
        transportPerUnit,
        cenaSprzedazyNetto, 
        cenaSprzedazyBrutto
    };
};