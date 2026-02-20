export const MENU_DATABASE: Record<string, string[]> = {
    '2026-02-19': ["Mantar Çorbası", "Uluırmak Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-02-20': ["Mercimek Çorbası", "Tas Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-02-21': ["Domates Çorbası", "İzmir Köfte", "Pirinç Pilavı", "Cacık"],
    '2026-02-22': ["Ezogelin Çorbası", "Çiftlik Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-02-23': ["Şehriye Çorbası", "Rosto Köfte", "Pirinç Pilavı", "Salata"],
    '2026-02-24': ["Mercimek Çorbası", "Saksı Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-02-25': ["Mantar Çorbası", "Patlıcan Musakka", "Pirinç Pilavı", "Cacık"],
    '2026-02-26': ["Domates Çorbası", "Et Sote", "Pirinç Pilavı", "Salata"],
    '2026-02-27': ["Ezogelin Çorbası", "Sebzeli Köfte", "Bulgur Pilavı", "Salata"],
    '2026-02-28': ["Şehriye Çorbası", "Orman Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-03-01': ["Mantar Çorbası", "Karnıyarık", "Pirinç Pilavı", "Cacık"],
    '2026-03-02': ["Mercimek Çorbası", "Uluırmak Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-03-03': ["Ezogelin Çorbası", "Tas Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-03-04': ["Domates Çorbası", "İzmir Köfte", "Pirinç Pilavı", "Cacık"],
    '2026-03-05': ["Şehriye Çorbası", "Çiftlik Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-03-06': ["Y. Yoğurt Çorbası", "Rosto Köfte", "Bulgur Pilavı", "Salata"],
    '2026-03-07': ["Şehriye Çorbası", "Saksı Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-03-08': ["Mantar Çorbası", "Patlıcan Musakka", "Pirinç Pilavı", "Cacık"],
    '2026-03-09': ["Mercimek Çorbası", "Et Sote", "Pirinç Pilavı", "Salata"],
    '2026-03-10': ["Ezogelin Çorbası", "Sebzeli Köfte", "Bulgur Pilavı", "Salata"],
    '2026-03-11': ["Şehriye Çorbası", "Orman Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-03-12': ["Mantar Çorbası", "Karnıyarık", "Pirinç Pilavı", "Cacık"],
    '2026-03-13': ["Mercimek Çorbası", "Uluırmak Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-03-14': ["Ezogelin Çorbası", "Tas Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-03-15': ["Domates Çorbası", "İzmir Köfte", "Pirinç Pilavı", "Cacık"],
    '2026-03-16': ["Şehriye Çorbası", "Çiftlik Kebabı", "Pirinç Pilavı", "Salata"],
    '2026-03-17': ["Ezogelin Çorbası", "Rosto Köfte", "Bulgur Pilavı", "Salata"],
    '2026-03-18': ["Mercimek Çorbası", "Saksı Kebabı", "Bulgur Pilavı", "Salata"],
    '2026-03-19': ["Mantar Çorbası", "Uluırmak Kebabı", "Pirinç Pilavı", "Salata"]
};

export const IFTAR_TIMES: Record<string, string> = {
    '2026-02-19': '18:33',
    '2026-02-20': '18:34',
    '2026-02-21': '18:35',
    '2026-02-22': '18:36',
    '2026-02-23': '18:37',
    '2026-02-24': '18:38',
    '2026-02-25': '18:39',
    '2026-02-26': '18:40',
    '2026-02-27': '18:41',
    '2026-02-28': '18:42',
    '2026-03-01': '18:43',
    '2026-03-02': '18:44',
    '2026-03-03': '18:45',
    '2026-03-04': '18:46',
    '2026-03-05': '18:47',
    '2026-03-06': '18:48',
    '2026-03-07': '18:49',
    '2026-03-08': '18:50',
    '2026-03-09': '18:51',
    '2026-03-10': '18:52',
    '2026-03-11': '18:53',
    '2026-03-12': '18:54',
    '2026-03-13': '18:55',
    '2026-03-14': '18:56',
    '2026-03-15': '18:57',
    '2026-03-16': '18:58',
    '2026-03-17': '18:59',
    '2026-03-18': '19:00',
    '2026-03-19': '19:01'
};

export const CATEGORY_ORDER = ["GÜNÜN MENÜSÜ", "İFTAR MENÜLERİ", "ALAKART MENÜLER", "TATLILAR", "PASTALAR"];

// Masa Listesi - 1'den 40'a kadar ve IHLARA
export const TABLE_LIST: (number | string)[] = [...Array.from({ length: 40 }, (_, i) => i + 1), "IHLARA"];

// Personel Listesi
export const STAFF_LIST = ["HİMMET", "KENAN", "SERDAR", "İBRAHİM", "BATUHAN"];

export const INITIAL_MENU_STRUCTURE = {
    "GÜNÜN MENÜSÜ": [
        { name: "GÜNÜN MENÜSÜ", price: "300,00" },
        { name: "İFTAR TABAĞI MİNİ", price: "75,00" },
        { name: "İFTAR TABAĞI STANDART", price: "100,00" },
        { name: "İFTAR TABAĞI EKSTRA", price: "150,00" },
        { name: "PATATES KIZARTMASI", price: "75,00" }
    ],
    "İFTAR MENÜLERİ": [
        { name: "İFTAR ET SOTE", price: "750,00" }, { name: "İFTAR PİLİÇ SARMA", price: "600,00" },
        { name: "İFTAR ROSTO KÖFTE", price: "700,00" }, { name: "İFTAR TAVUK SOTE", price: "550,00" },
        { name: "İFTAR ULUIRMAK KEBABI", price: "700,00" }, { name: "İFTAR ULUIRMAK KÖFTE", price: "750,00" }
    ],
    "ALAKART MENÜLER": [
        { name: "TAVUK SOTE", price: "350,00" }, { name: "TAVUK ŞİŞ", price: "350,00" },
        { name: "TAVUK BONFİLE", price: "350,00" }, { name: "MANTAR SOTE", price: "400,00" },
        { name: "ET SOTE", price: "450,00" }, { name: "SAC KAVURMA", price: "600,00" },
        { name: "KARIŞIK SOTE", price: "450,00" }, 
        { name: "IZGARA KÖFTE", price: "400,00" }, { name: "KILIÇARSLAN ÇÖKERTMESİ", price: "450,00" }
    ],
    "TATLILAR": [
        { name: "HELVADERE", price: "100,00" }, { name: "SÜTLAÇ", price: "90,00" }, { name: "HASANDAĞI ZİRVESİ", price: "190,00" },
        { name: "TRİLEÇE", price: "90,00" }, { name: "REVANİ", price: "90,00" }, { name: "GÜZGÜNEŞİ", price: "90,00" },
        { name: "GÜLLAÇ", price: "90,00" }, { name: "KALBURABASTI", price: "90,00" }, { name: "PROFİTEROL", price: "140,00" },
        { name: "İNCİM", price: "140,00" }, { name: "LATTEM", price: "100,00" }, { name: "İNCELEK", price: "90,00" },
        { name: "KADAYIF BURMA", price: "175,00" }, { name: "MAGNOLYA", price: "90,00" }
    ],
    "PASTALAR": [
        { name: "RULO PASTA", price: "110,00" }, { name: "MOZAİK PASTA", price: "90,00" }, { name: "BALBADEM", price: "175,00" },
        { name: "SULTANHANI", price: "175,00" }, { name: "EKLER", price: "30,00" }, { name: "EĞRİ MİNARE", price: "200,00" },
        { name: "AŞIKLI HÖYÜK", price: "190,00" }, { name: "EKECİK", price: "200,00" }, { name: "PROFESÖR PASTA", price: "120,00" },
        { name: "SARIKARAMAN", price: "250,00" }, { name: "TOPAKKAYA", price: "90,00" }, { name: "BELİSIRMA", price: "120,00" }
    ]
};
