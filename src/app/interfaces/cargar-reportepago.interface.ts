// Interfaz para el detalle de la cotización
interface QuoteDetail {
    discounted_price: number;
    Treatment: {
        name_treatment: string;
    };
}

// Interfaz para cada pago reportado
interface ReportPago {
    fecha_pago: string;
    monto: number;
    id: number;
    Quote_detail: QuoteDetail;
}

// Interfaz para la respuesta completa del servicio
interface ReportePagosResponse {
    ok: boolean;
    reportpagos: ReportPago[];
    total: number;
    desde: number;
    limite: number;
}