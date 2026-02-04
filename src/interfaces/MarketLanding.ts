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

export interface AboutUs {
    titleSize: string; // 1rem, 12px, etc...
    contentSize: string; // 1rem, 12px, etc...
    itens: { index: number; title: string; content: string }[];
}

export interface Contact {
    email: string;
    telefone: string;
    cep: string;
    numero: string;
    horario: string;
    instagram: string;
    facebook: string;
}