export interface Agendamento {
    created_at?: string;
    id?: string;
    cliente: string;
    pet: string;
    clientePhoto?: string;
    petPhoto?: string;
    horario: string;
    dia: string;
    servico: string;
    status: string;
}