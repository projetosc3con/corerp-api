export interface Cliente {
    created_at?: string;
    id: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    observacoes?: string | null;
    preferencias?: string | null;
}