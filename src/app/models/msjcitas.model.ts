import { Time } from "@angular/common";

export class CitassMsj{

    constructor(
        
        public id: number,
        // public tiempo: number,
        //---HASTA AQUI---
        public fecha: Date, // solo por esX4a Vers para editar
        public hora_inicio: Time,
        //public hora_final: Time,
        public name: string,
        public last_name : string,
        public celular : number,
        public enviomsj: boolean,  // Asegúrate de que esta propiedad exista
    ){}
}