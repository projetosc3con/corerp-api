import { Categoria } from "./Categoria";
import { Servico } from "./Servico";

export interface MarketLanding {
    pageTitle: string;
    banners: string[] | null;
    destaques: ProdutoMarketLanding[];
    servicos?: Servico[];
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