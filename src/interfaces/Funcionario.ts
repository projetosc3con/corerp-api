import { Role } from "./Role";

export interface Funcionario {
    created_at?: string;
    id?: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    perfil: Role | string;
}