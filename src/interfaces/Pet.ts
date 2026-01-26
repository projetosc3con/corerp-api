export interface Pet {
    id?: string;
    nome: string;
    especie: string;
    raca: string;
    sexo: string;
    idade: number;
    peso: number;
    cor: string;
    comportamento?: string;
    alergias?: string;
    restricoes?: string;
    photo?: string;
    microchip?: string;
    idCliente: string;
}