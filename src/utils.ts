export const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunked.push(arr.slice(i, i + size));
    }
    return chunked;
};

export const chunkListDynamic = <T>(arr: T[]): T[][] => {
    const firstPageSize = 16;
    const otherPageSize = 21;
    const chunks: T[][] = [];
    
    if (arr.length === 0) return chunks;
    
    // İlk Sayfa
    chunks.push(arr.slice(0, firstPageSize));
    
    // Diğer Sayfalar
    let i = firstPageSize;
    while (i < arr.length) {
        chunks.push(arr.slice(i, i + otherPageSize));
        i += otherPageSize;
    }
    return chunks;
};

export const calculateFontSize = (name: string) => {
    const len = name ? name.length : 0;
    if (len > 25) return '14pt';
    if (len > 20) return '17pt';
    if (len > 15) return '19pt';
    return '22pt';
};

export const formatTableDisplay = (tableVal: string | number) => {
    if (tableVal === "IHLARA") return "IHLARA";
    return `G-${tableVal.toString().padStart(2, '0')}`;
};
