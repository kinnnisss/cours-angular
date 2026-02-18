export interface PatientModel{
    id: number;
    numero: string;
    nom: string;
    prenom: string;
    tel: string;
    adresse: string;
    antecedents?: string;
}
export interface PatientApi{
    id: number;
    userId: string;
    numero: string;
    nom: string;
    prenom: string;
    tel: string;
    adresse: string;
    antecedents?: string;
}
export type PatientRequest = Omit<PatientModel, 'id'>;