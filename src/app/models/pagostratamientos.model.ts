export class PagoProforma{

    constructor(
        
        public id: number,
        public quotation_id: number, // solo por esX4a Vers para editar
        public quote_detail_id: number, // solo por esX4a Vers para editar
        public fecha_pago: Date, // solo por esX4a Vers para editar
        public 	monto: number, // solo por esX4a Vers para editar
        public 	descripcion: string, // solo por esX4a Vers para editar
        public 	tipo_pago: string, // solo por esX4a Vers para editar
        public createdAt: Date,
        public updatedAt: Date
    ){}
}