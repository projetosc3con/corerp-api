export interface Pet {
    id: string;
    nome: string;
    especie: string;
    raca: string;
    sexo: string;
    dataNascimento?: string | null;
    peso: number;
    cor: string;
    comportamento?: string;
    alergias?: string;
    restricoes?: string;
    microchip?: string;
    idCliente: string;
}