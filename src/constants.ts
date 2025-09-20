import type { Manufacturer, PorothermData, SolbetData, SemmelrockData, BrukbetData, PolbrukData, LeierData } from './types';

export const MANUFACTURERS: Manufacturer[] = [
    { id: 'porotherm', name: 'POROTHERM (Wienerberger)', type: 'Pustaki ceramiczne', productCount: 28, status: 'active', icon: '🧱' },
    { id: 'solbet', name: 'SOLBET', type: 'Beton komórkowy', productCount: 120, status: 'active', icon: '🏗️' },
    { id: 'brukbet', name: 'BRUK-BET', type: 'Kostka brukowa i płyty', productCount: 2400, status: 'active', icon: '🟫' },
    { id: 'semmelrock', name: 'SEMMELROCK stein+design', type: 'Rozwiązania krajobrazowe', productCount: 295, status: 'active', icon: '🌿' },
    { id: 'polbruk', name: 'POLBRUK S.A.', type: 'Materiały budowlane', productCount: 300, status: 'active', icon: '🏭' },
    { id: 'leier', name: 'LEIER', type: 'Systemy budowlane', productCount: 150, status: 'active', icon: '🟥' },
    { id: 'silikaty', name: 'SILIKATY SZLACHTA', type: 'Bloczki silikatowe', productCount: 45, status: 'development', icon: '⬜' }
];

export const INITIAL_POROTHERM_DATA: PorothermData = {
    agreements: [
        { id: "przyszlosc-1", name: "POROZUMIENIE PRZYSZŁOŚĆ", code: "0624-03 Grzesik przyszłość jagiellońska", validUntil: "2025-06-30", transportCosts: { leborkMalbork: 0, gnaszynMalbork: 0 }, settings: { basicDiscount: 0.22, margin: 0.1, cashDiscount: 0.03 }, products: [ { id: "pustak-vent-1b-1", name: "PUSTAK WENTYLACYJNY TYP 1B", location: "Lębork", netPrice: 5.9, additionalDiscount: 0.12, unitsPerPallet: 150, palletsPerTruck: 24, category: "Pustaki wentylacyjne", specifications: "Typ 1B, single channel" }, { id: "pustak-vent-2b90-1", name: "Pustak wentylacyjny dwukanałowy 2B/90", location: "Lębork", netPrice: 9.45, additionalDiscount: 0.14, unitsPerPallet: 90, palletsPerTruck: 24, category: "Pustaki wentylacyjne", specifications: "Typ 2B/90, double channel" } ], lastUpdate: "2025-09-14" },
        { id: "przyszlosc-2", name: "POROZUMIENIE PRZYSZŁOŚĆ", code: "0625-EZ Grzesik PBR Przyszłość Lipowiec", validUntil: "2025-07-31", transportCosts: { leborkMalbork: 1100, gnaszynMalbork: 0 }, settings: { basicDiscount: 0.22, margin: 0.1, cashDiscount: 0.03 }, products: [ { id: "porotherm-25-pw-kl15", name: "POROTHERM 25 P+W KL.15", location: "Lębork", netPrice: 10.9, additionalDiscount: 0.26, unitsPerPallet: 72, palletsPerTruck: 19, category: "Pustaki budowlane", specifications: "25cm, klasa 15, P+W system" }, { id: "porotherm-25-pw-kl20", name: "POROTHERM 25 P+W KL.20", location: "Lębork", netPrice: 11.2, additionalDiscount: 0.26, unitsPerPallet: 72, palletsPerTruck: 19, category: "Pustaki budowlane", specifications: "25cm, klasa 20, P+W system" }, { id: "porotherm-188-pw-kl15", name: "POROTHERM 18.8 P+W KL.15", location: "Lębork", netPrice: 13.2, additionalDiscount: 0.26, unitsPerPallet: 72, palletsPerTruck: 18, category: "Pustaki budowlane", specifications: "18.8cm, klasa 15, P+W system" } ], lastUpdate: "2025-09-14" }
    ],
    defaultAgreementId: "przyszlosc-2"
};

export const INITIAL_SOLBET_DATA: SolbetData = { 
    settings: { transportCost: 2800, discountPercent: 0, margin: 20 }, 
    products: [ 
        { id: "solbet-600-240", name: "SOLBET OPTIMAL 600 - 240mm", density: 600, width: 240, height: 240, length: 590, priceNet: 7.15, category: "standard", unitsPerPallet: 40, palletsPerTruck: 18, mortarType: "thin", mortarConsumption: 2.5 }, 
        { id: "solbet-500-240", name: "SOLBET OPTIMAL 500 - 240mm", density: 500, width: 240, height: 240, length: 590, priceNet: 6.80, category: "standard", unitsPerPallet: 40, palletsPerTruck: 20, mortarType: "thin", mortarConsumption: 2.5 } 
    ] 
};

export const INITIAL_SEMMELROCK_DATA: SemmelrockData = { 
    settings: { transportRate: 500, margin: 30, truckWeight: 26, maxPalletsPerTruck: 22, discounts: { 'G1': 0, 'G2': 5, 'G3': 10, 'G4': 15 } }, 
    products: [ 
        { symbol: '5538', grupa: 'G2-b', nazwa: 'Umbriano kwarcytowo-biały gr. 8 cm', iloscNaPalecie: 9, jednostka: 'm²', waga: 1.61, cenaNetto: 131.7, maxPalletsPerTruck: 15 }, 
        { symbol: '5514', grupa: 'G2-b', nazwa: 'Umbriano grafitowo-biały gr. 8 cm', iloscNaPalecie: 9, jednostka: 'm²', waga: 1.61, cenaNetto: 131.7, maxPalletsPerTruck: 15 }, 
        { symbol: '8223', grupa: 'G2-c', nazwa: 'Linero silva gr. 6 cm', iloscNaPalecie: 11.25, jednostka: 'm²', waga: 1.46, cenaNetto: 80.9, maxPalletsPerTruck: 16 } 
    ] 
};

export const INITIAL_BRUKBET_DATA: BrukbetData = { 
    settings: { 
        transportRate: 500,
        margin: 30, 
        factory: "brukbet-main", 
        factories: [ 
            { id: "brukbet-main", nazwa: "BRUK-BET Zakład Główny", kosztTransportu: 500 }, 
            { id: "brukbet-north", nazwa: "BRUK-BET Północ", kosztTransportu: 450 }, 
            { id: "brukbet-south", nazwa: "BRUK-BET Południe", kosztTransportu: 550 } 
        ], 
        maxPalletsPerTruck: 22, 
        discounts: { 'PRESTIGE': 0, 'UNI-DECOR': 5, 'STANDARD': 10, 'WYROBY UZUPEŁNIAJĄCE': 15 } 
    }, 
    products: [ 
        { id: "bruk_1", symbol: "1-MB-SC-RBI-RU0-TI", grupa: "PRESTIGE", nazwa: "Bloczek ogrodowy SCALA 60x19x15 cm – graniton biały (rustical)", zp: "Kielce", waga: 1.9, maxPalletsPerTruck: 12, iloscNaPalecie: 50, jednostka: "szt.", cenaNetto: 67.7 }, 
        { id: "bruk_2", symbol: "2-KD-HOLLAND-BLE-U0", grupa: "STANDARD", nazwa: "Holland 21x7x10,5 cm – betonowy szary", zp: "Tarnów", waga: 1.8, maxPalletsPerTruck: 14, iloscNaPalecie: 198, jednostka: "szt.", cenaNetto: 1.35 } 
    ] 
};

export const INITIAL_POLBRUK_DATA: PolbrukData = {
    settings: { transportRate: 500, margin: 30, truckWeight: 24, maxPalletsPerTruck: 22 },
    products: [
        { symbol: 'PLB001', nazwa: 'Polbruk płukany gr. 4 cm: WESTA', kolor: '', ksztalt: 'Płukany', jednostka: 'm²', iloscNaPalecie: 12, waga: 1.6, maxPalletsPerTruck: 14, cenaNetto: 65.40, rabat: 42.7 },
        { symbol: 'PLB002', nazwa: 'Polbruk gładki gr. 4 cm: NAPOLI', kolor: '', ksztalt: '', jednostka: 'm2', iloscNaPalecie: 12, waga: 1.6, maxPalletsPerTruck: 14, cenaNetto: 56.60, rabat: 40.8 }
    ]
};

export const INITIAL_LEIER_DATA: LeierData = {
    settings: {
        transportRate: 600,
        margin: 25,
    },
    products: [
        { id: 'leier_1', symbol: 'L-P-25', nazwa: 'Pustak ceramiczny 25 P+W', rabat: 10, jednostka: 'szt.', iloscNaPalecie: 72, waga: 1.2, cenaNetto: 8.50, palletsPerTruck: 22 },
        { id: 'leier_2', symbol: 'L-B-K6', nazwa: 'Kostka brukowa Klasyko 6cm szara', rabat: 15, jednostka: 'm²', iloscNaPalecie: 10.8, waga: 1.5, cenaNetto: 45.00, palletsPerTruck: 16 }
    ]
};
