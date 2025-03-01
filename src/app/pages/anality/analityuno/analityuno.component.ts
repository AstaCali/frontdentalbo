import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { AnalityService } from 'src/app/services/anality.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analityuno',
  templateUrl: './analityuno.component.html',
  styleUrls: ['./analityuno.component.css']
})
export class AnalityunoComponent implements OnInit{

  public tratamientoArray : Tratamiento[]= [];
  public selectedTreatment : string = '';
  public fechaFinal: string = '';
  // public fehcaInicio?: Date | undefined;
  public fehcaInicio : string = '';
  public chart: any;
  public dato_listado : any=[];
  constructor(private tratamientosService: TratamientosService, private analityservice : AnalityService){}

  ngOnInit(): void {

    this.listarTratamientos();
    //this.cargarAnalityUno();
    //this.yearActual();
    
  }

  cambiarFehaInicio(event: Event){
    const input = event.target as HTMLInputElement;
    //console.log('Fecha_Inicio',input.value);

    if (input && input.value) {
      // Obtener el valor del campo de entrada (formato "yyyy-MM")
      const [year, month] = input.value.split('-');

      // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

      // Formatear la fecha en "yyyy-MM-dd"
      const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

      this.fehcaInicio = formattedDate;
      console.log('Fecha_Inicio:', formattedDate);
      this.cargarAnalityUno();
    }
  }

  cambiarFechaFinal(event: Event){
    const input = event.target as HTMLInputElement;
    //console.log('Fecha_Final',input.value);
    if (input && input.value) {
      // Obtener el valor del campo de entrada (formato "yyyy-MM")
      const [year, month] = input.value.split('-');

      // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

      // Formatear la fecha en "yyyy-MM-dd"
      const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

      this.fechaFinal = formattedDate;
      console.log('Fecha_Final:', formattedDate);
      this.cargarAnalityUno();
    }

  }

  listarTratamientos(){
    this.tratamientosService.cargarTratamientReportPagos()
    .subscribe( data => {
      //console.log('TreamenT: ', data);
      this.tratamientoArray = data;
      console.log('LLEGA Tratamientos',this.tratamientoArray);
    })
  }

  onInputTreatment(event: any): void {
    const inputText = event.target.value;
    const treatment = this.tratamientoArray.find(treatment => treatment.name_treatment === inputText);
    const treatmentInput = treatment ? treatment.name_treatment : '';
    this.selectedTreatment = treatmentInput;
    console.log('TRATAMIENTO_DADO', this.selectedTreatment);
    this.cargarAnalityUno();
    //---this.cargarReportePago('', treatmentInput);
  }
  // yearActual() {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = ('0' + (today.getMonth() + 1)).slice(-2);
  //   const day = ('0' + today.getDate()).slice(-2);
  //   this.fechaFinal = `${year}-${month}-${day}`;
  //   //const todayDate = this.dia;
  //   //this.cargarCitasMsj('', todayDate);
  // }
  //----CARGAR LOS DATOS DE ANALISIS DE DATOS----

  cargarAnalityUno(): void{
    // cargarReportePago( termiperson: string = '', terminotreatment: string = ''): void {
  
    this.analityservice.pythonAnalityUno(this.selectedTreatment, this.fehcaInicio, this.fechaFinal)
      .subscribe(data=>{
        //this.tratamientoArray = data;
        console.log('LLEGA ANALITY_UNO',data);
        this.dato_listado = data.datos_list;
        console.log('DATO_LIST_UNO', this.dato_listado);
        this.createChart(data);
      });
    // this.reportePagosService.reportePago(this.desde, this.currentDate, this.mes, termiperson, terminotreatment)
      // .subscribe(({ total, reportpagos }) => {
      //   console.log(total,reportpagos);
      //   this.totalReportePago = total;
      //   this.reportePagosArray = reportpagos;
      //   this.calcularTotalDiscountedPrice();
      // });
  }
  eliminarTreatment(){
    this.selectedTreatment = '';
    console.log('TRATAMIENTO: ', this.selectedTreatment);
    // Limpiar el campo de búsqueda
    const inputElement = document.getElementById('exampleDataListTratamiento') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    this.cargarAnalityUno();
  }

  createChart(data: any) {
    // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }

    // Formatea los datos
    const fechas = data.dato.fecha;
    const frecuencias = data.dato.Frecuencia;

    // Crea la gráfica de línea
    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: data.Tratamiento,
            data: frecuencias,
            borderColor: 'blue',
            fill: false,
            tension: 0.4 
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Frecuencia' } }
        }
      }
    });
  }

}
