
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
        { symbol: 'PLB002', nazwa: 'Polbruk gładki gr. 4 cm: NAPOLI', kolor: '', ksztalt: '', jednostka: 'm2', iloscNaPalecie: 12, waga: 1.6, maxPalletsPerTruck: 14, cenaNetto: 56.60, rabat: 40.8 },
        { symbol: 'PLB003', nazwa: 'Polbruk gładki | monokolor | gr. 4.5 cm I płyta: LAMELL', kolor: '', ksztalt: '4.5x40x60', jednostka: 'szt', iloscNaPalecie: 80, waga: 1.2, maxPalletsPerTruck: 18, cenaNetto: 19.90, rabat: 40.2 },
        { symbol: 'PLB004', nazwa: 'Polbruk gładki | melanż | gr. 6 cm: IDEO, CARMINO, GRANITO', kolor: '', ksztalt: 'Gładka', jednostka: 'm2', iloscNaPalecie: 10, waga: 1.5, maxPalletsPerTruck: 15, cenaNetto: 73.50, rabat: 44.2 },
        { symbol: 'PLB005', nazwa: 'Polbruk płukany gr. 6 cm: AVANTI, COMPLEX, TRENTO', kolor: '', ksztalt: 'Płukany', jednostka: 'm2', iloscNaPalecie: 10, waga: 1.5, maxPalletsPerTruck: 15, cenaNetto: 83.40, rabat: 43.7 },
        { symbol: 'PLB006', nazwa: 'Polbruk postarzany gr. 6 cm: CARMINO, NAPOLI, METRIK', kolor: '', ksztalt: 'Postarzany', jednostka: 'm2', iloscNaPalecie: 10, waga: 1.6, maxPalletsPerTruck: 14, cenaNetto: 99.00, rabat: 44.4 },
        { symbol: 'PLB007', nazwa: 'Polbruk LUMIA 10x20, gr. 6 cm', kolor: '', ksztalt: 'Specjalny', jednostka: 'szt', iloscNaPalecie: 200, waga: 1.1, maxPalletsPerTruck: 20, cenaNetto: 8.40, rabat: 16.7 },
        { symbol: 'PLB008', nazwa: 'Polbruk gładki | melanż | gr. 8 cm | płyta: MAGNA 50x75', kolor: '', ksztalt: '8x50x75', jednostka: 'szt', iloscNaPalecie: 30, waga: 1.8, maxPalletsPerTruck: 13, cenaNetto: 40.00, rabat: 38.8 },
        { symbol: 'PLB009', nazwa: 'Polbruk płukany gr. 8 cm: AVANTI, URBANIKA, NAPOLI', kolor: '', ksztalt: 'Płukany', jednostka: 'm2', iloscNaPalecie: 8, waga: 1.8, maxPalletsPerTruck: 13, cenaNetto: 99.00, rabat: 43.9 },
        { symbol: 'PLB010', nazwa: 'Polbruk gładki | melanż | gr. 8 cm I płyta: BOSSO 60X60', kolor: '', ksztalt: '8x60x60', jednostka: 'szt', iloscNaPalecie: 25, waga: 1.8, maxPalletsPerTruck: 13, cenaNetto: 49.00, rabat: 42.9 },
        { symbol: 'PLB011', nazwa: 'Polbruk drobnopłukany | kolor | PŁYTA PLANO 8x80x80', kolor: '', ksztalt: 'Płukany', jednostka: 'szt', iloscNaPalecie: 20, waga: 1.9, maxPalletsPerTruck: 12, cenaNetto: 98.00, rabat: 43.9 },
        { symbol: 'PLB012', nazwa: 'Polbruk gładki | melanż | gr. 8 cm : DYNAMIK', kolor: '', ksztalt: '8x14x50', jednostka: 'm2', iloscNaPalecie: 9, waga: 1.7, maxPalletsPerTruck: 13, cenaNetto: 89.00, rabat: 44.9 },
        { symbol: 'PLB013', nazwa: 'Polbruk gładki gr. 4 cm: NOSTALITE, NAPOLI', kolor: '', ksztalt: '', jednostka: 'm2', iloscNaPalecie: 14, waga: 1.2, maxPalletsPerTruck: 18, cenaNetto: 48.00, rabat: 42.3 },
        { symbol: 'PLB014', nazwa: 'Obrzeże TREO | szary | 8x30x50 | drobnoutwardzony', kolor: '', ksztalt: '50x30x08', jednostka: 'szt', iloscNaPalecie: 60, waga: 1.4, maxPalletsPerTruck: 16, cenaNetto: 21.55, rabat: 25.8 },
        { symbol: 'PLB015', nazwa: 'Polbruk gr. 6 cm z fazą / bez fazy', kolor: '', ksztalt: 'Prostokąt, Tetka', jednostka: 'm2', iloscNaPalecie: 10, waga: 1.5, maxPalletsPerTruck: 15, cenaNetto: 55.00, rabat: 47.3 },
        { symbol: 'PLB016', nazwa: 'Płytka chodnikowa 30x30 gładka gr. 5 cm', kolor: '', ksztalt: '30X30X5', jednostka: 'szt', iloscNaPalecie: 100, waga: 1.1, maxPalletsPerTruck: 20, cenaNetto: 5.40, rabat: 40.7 },
        { symbol: 'PLB017', nazwa: 'Płyta MEBA gr. 12 cm', kolor: '', ksztalt: '40X60', jednostka: 'szt', iloscNaPalecie: 40, waga: 1.6, maxPalletsPerTruck: 14, cenaNetto: 25.68, rabat: 46.9 },
        { symbol: 'PLB018', nazwa: 'Krawężnik lekki 15', kolor: '', ksztalt: '15X30X100', jednostka: 'szt', iloscNaPalecie: 30, waga: 1.8, maxPalletsPerTruck: 13, cenaNetto: 38.88, rabat: 48.6 },
        { symbol: 'PLB019', nazwa: 'Obrzeże trawnikowe 6x20x100', kolor: '', ksztalt: '6x20x100', jednostka: 'szt', iloscNaPalecie: 90, waga: 1.3, maxPalletsPerTruck: 17, cenaNetto: 14.30, rabat: 47.6 },
        { symbol: 'PLB020', nazwa: 'Gazon ogrodowy MINI LUNA', kolor: '', ksztalt: 'Fi 35X20', jednostka: 'szt', iloscNaPalecie: 50, waga: 1, maxPalletsPerTruck: 22, cenaNetto: 10.10, rabat: 27.7 },
        { symbol: 'PLB021', nazwa: 'Ogrodzenie Polbruk NEO - Pustak', kolor: '', ksztalt: '60x20x10', jednostka: 'szt', iloscNaPalecie: 45, waga: 1.7, maxPalletsPerTruck: 13, cenaNetto: 12.96, rabat: 32.5 },
        { symbol: 'PLB022', nazwa: 'Stopień schodowy GRANDO 15x40x100 łamany', kolor: '', ksztalt: '15x40x100', jednostka: 'szt', iloscNaPalecie: 10, waga: 2.0, maxPalletsPerTruck: 12, cenaNetto: 135.00, rabat: 40.0 },
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