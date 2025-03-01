import { Persona } from "./persona.modelo";
import { Role } from "./roles.model";

export class Usuario{

    constructor(
        
        public id: number,
        public email: string,
        public password: string, // solo por esX4a Vers para editar
        // public role: Roles,
        public role: Role,
        public person: Persona,
        //public role_id: number,
        //--SE COLOCO EL odontologoId PARA QUE SE MUESTRE
        public odontologoId: number,

    ){}
}