export interface Produto {
    id?: string;
    barCode: string;
    sku: string;
    descricao: string;
    categoria: string;
    fornecedor: string;
    custoUn: number;
    vlrVendaUn: number;
    anuncio: string;
    medida: 'Un' | 'Kg' | 'Lt' | 'Mt';
    quantidade: number;
};