export interface Manufacturer {
    id: string;
    name: string;
    type: string;
    productCount: number;
    status: 'active' | 'development';
    icon: string;
}

// POROTHERM Types
export interface PorothermSettings {
    basicDiscount: number | null;
    margin: number | null;
    cashDiscount: number | null;
}

export interface PorothermTransportCosts {
    leborkMalbork: number | null;
    gnaszynMalbork: number | null;
}

export interface PorothermProduct {
    id: string;
    name: string;
    location: "Lębork" | "Gnaszyn";
    netPrice: number | null;
    additionalDiscount: number | null;
    unitsPerPallet: number | null;
    palletsPerTruck: number | null;
    category: string;
    specifications: string;
}

export interface PorothermAgreement {
    id: string;
    name: string;
    code: string;
    validUntil: string;
    transportCosts: PorothermTransportCosts;
    settings: PorothermSettings;
    products: PorothermProduct[];
    lastUpdate: string;
}

export interface PorothermData {
    agreements: PorothermAgreement[];
    defaultAgreementId: string;
    selectedAgreementId?: string;
}

// SOLBET Types
export interface SolbetSettings {
    transportCost: number | null;
    discountPercent: number | null;
    margin: number | null;
}

export interface SolbetProduct {
    id: string;
    name: string;
    density: 500 | 600;
    width: number | null;
    height: number | null;
    length: number | null;
    priceNet: number | null;
    category: string;
    unitsPerPallet: number | null;
    palletsPerTruck: number | null;
    mortarType?: string;
    mortarConsumption?: number | null;
}

export interface SolbetData {
    settings: SolbetSettings;
    products: SolbetProduct[];
}

// BRUK-BET Types
export interface BrukbetFactory {
    id: string;
    nazwa: string;
    kosztTransportu: number | null;
}

export interface BrukbetSettings {
    transportRate: number | null;
    margin: number | null;
    factory: string;
    factories: BrukbetFactory[];
    maxPalletsPerTruck: number | null;
    discounts: Record<string, number | null>;
}

export interface BrukbetProduct {
    id: string;
    symbol: string;
    grupa: string;
    nazwa: string;
    zp: string;
    waga: number | null;
    maxPalletsPerTruck: number | null;
    iloscNaPalecie: number | null;
    jednostka: string;
    cenaNetto: number | null;
}

export interface BrukbetData {
    settings: BrukbetSettings;
    products: BrukbetProduct[];
}


// SEMMELROCK Types
export interface SemmelrockSettings {
    transportRate: number | null;
    margin: number | null;
    truckWeight: number | null;
    maxPalletsPerTruck: number | null;
    discounts: Record<string, number | null>;
}

export interface SemmelrockProduct {
    symbol: string;
    grupa: string;
    nazwa: string;
    iloscNaPalecie: number | null;
    jednostka: string;
    waga: number | null;
    cenaNetto: number | null;
    maxPalletsPerTruck: number | null;
}

export interface SemmelrockData {
    settings: SemmelrockSettings;
    products: SemmelrockProduct[];
}


// POLBRUK Types
export interface PolbrukSettings {
    transportRate: number | null;
    margin: number | null;
    truckWeight: number | null;
    maxPalletsPerTruck: number | null;
}

export interface PolbrukProduct {
    symbol: string;
    nazwa: string;
    kolor: string;
    ksztalt: string;
    jednostka: string;
    iloscNaPalecie: number | null;
    waga: number | null;
    maxPalletsPerTruck: number | null;
    cenaNetto: number | null;
    rabat: number | null;
}

export interface PolbrukData {
    settings: PolbrukSettings;
    products: PolbrukProduct[];
}

// LEIER Types
export interface LeierSettings {
    transportRate: number | null;
    margin: number | null;
}

export interface LeierProduct {
    id: string;
    symbol: string;
    nazwa: string;
    jednostka: string;
    iloscNaPalecie: number | null;
    waga: number | null;
    cenaNetto: number | null;
    rabat: number | null;
    palletsPerTruck: number | null;
}

export interface LeierData {
    settings: LeierSettings;
    products: LeierProduct[];
}

export type CalculatedLeierProduct = LeierProduct & {
    cenaPoRabacie: number;
    transportPerUnit: number;
    cenaSprzedazyNetto: number;
    cenaSprzedazyBrutto: number;
};
