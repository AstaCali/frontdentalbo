//import
// import { Usuario } from "./persona.modelo";
import { Usuario } from "./usuario.model";

interface Persona {
    id: number;
    name: string;
    last_name: string;
    ci: number;
    celular: number;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
}

interface TreatmentDetail {
    id: number;
    dentist_id: number;
    treatment_id: number;
    createdAt: Date;
    updatedAt: Date;
}
export class Odontologo{

    constructor(
        
        public id: number,
        public state: boolean,
        public users: Usuario,
        public person: Persona,
        //public detalles: TreatmentDetail[]
        //-----PARA FULL_CALENDAR SE COLOCO ESTO --
        public name: string,
        public last_name: string ,

    ){}
}