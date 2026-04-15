export interface Servico {
    created_at?: string;
    id?: string;
    nome: string;
    descricao: string;
    duracaoMedia: string;
    diaSemana: string[];
    horarios: string[];
}