export class Proforma{

    constructor(
        
        public id: number,
        public person_id: number, // solo por esX4a Vers para editar
        public users_id: number, // solo por esX4a Vers para editar
        public titulo: string, // solo por esX4a Vers para editar
        public 	fecha: Date, // solo por esX4a Vers para editar
        public 	total: number, // solo por esX4a Vers para editar
        public 	estato_cotizacion: Boolean, // solo por esX4a Vers para editar
        public createdAt: Date,
        public updatedAt: Date
    ){}
}