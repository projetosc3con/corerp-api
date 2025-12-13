import { Role } from "./Role";

export interface Funcionario {
    uid?: string;
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    perfil: Role | string;
}