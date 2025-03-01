//import

import { Time } from "@angular/common";
import { Persona } from "./persona.modelo";
//import { Person } from ".";

export class Citass{

    constructor(
        
        public id: number,
        //public tipo_cita_id: number,
        //--UMENTE ESTO---
        //public user_id: number,
        public dentista_id: number,
        public person_id: number,
        public tipo_cita_id: number,
        public tiempo: number,
        //---HASTA AQUI---
        public fecha: Date, // solo por esX4a Vers para editar
        public hora_inicio: Time,
        public hora_final: Time,
        public person: Persona

    ){}
}