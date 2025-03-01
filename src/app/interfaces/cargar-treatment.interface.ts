import { Tratamiento } from "../models/tratamientos.modelo";

export interface CargarTratamiento{
    total: number;
    treatments: Tratamiento[];
}