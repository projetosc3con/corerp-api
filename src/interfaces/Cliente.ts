export interface Cliente {
    id: string;
    nome: string;
    cpfCnpj: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    observacoes?: string | null;
    preferencias?: string | null;
}