import { Categoria } from "./Categoria";

export interface MarketLanding {
    pageTitle: string;
    banners: string[] | null;
    destaques: ProdutoMarketLanding[];
    servicos?: string[];
    categorias?: Categoria[];
    tempoBanner: number;
    tempoDestaque: number;
}

export type ProdutoMarketLanding = {
    id: string;
    vlrVendaUn: number;
    photo: string;
    categoria: string;
    descricao: string;
}