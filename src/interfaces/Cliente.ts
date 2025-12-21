export interface Cliente {
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