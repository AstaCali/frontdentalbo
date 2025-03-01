import { PagoProforma } from "./pagostratamientos.model";
import { Tratamiento } from "./tratamientos.modelo";

export class DetalleProforma{

    constructor(
        
        public id: number,
        public quotation_id: number,
        // public 	treatment_id: number,
        public 	treatment_id: Tratamiento,
        public diente_id: Date,
        public 	fecha: Date,
        public 	discounted_price: string,
        public 	price_without_discount: string, 
        public estato : Boolean,
        public createdAt: Date,
        public updatedAt: Date,
        //--coloca auque no esTe en la base de datos
        public 	pagocotizacion: PagoProforma,
    ){}
}