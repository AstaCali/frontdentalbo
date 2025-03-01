import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { AnalityService } from 'src/app/services/anality.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { Chart } from 'chart.js/auto';
// import { ChartOptions, ChartType, LabelItem } from 'chart.js';
//import { LabelI } from 'ng2-charts';


@Component({
  selector: 'app-analityseis',
  templateUrl: './analityseis.component.html',
  styleUrls: ['./analityseis.component.css']
})
export class AnalityseisComponent implements OnInit {

  public tratamientoArray : Tratamiento[]= [];
  public selectedTreatment : string = '';
  public fechaFinal: string = '';
  public fehcaInicio : string = '';
  public chart: any;
  // public lineChartData: Array<{ data: number[], label: string }> = [];
  // public lineChartLabels: LabelItem[] = [];
  // public lineChartOptions: ChartOptions = {
  //   responsive: true,
  // };
  // public lineChartLegend = true;
  // public lineChartType: ChartType = 'line';

  constructor(private tratamientosService: TratamientosService, private analityservice : AnalityService){}

  ngOnInit(): void {

    this.listarTratamientos();
    
  }
  listarTratamientos(){
    this.tratamientosService.cargarTratamientReportPagos()
    .subscribe( data => {
      //console.log('TreamenT: ', data);
      this.tratamientoArray = data;
      console.log('LLEGA Tratamientos_Seis',this.tratamientoArray);
    })
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
      this.cargarAnalitySiete();
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
      this.cargarAnalitySiete();
    }

  }

  onInputTreatment(event: any): void {
    const inputText = event.target.value;
    const treatment = this.tratamientoArray.find(treatment => treatment.name_treatment === inputText);
    const treatmentInput = treatment ? treatment.name_treatment : '';
    this.selectedTreatment = treatmentInput;
    console.log('TRATAMIENTO_DADO_Siete', this.selectedTreatment);
    this.cargarAnalitySiete();
  }

  eliminarTreatment(){
    this.selectedTreatment = '';
    console.log('TRATAMIENTO: ', this.selectedTreatment);
    // Limpiar el campo de búsqueda
    const inputElement = document.getElementById('exampleDataListTratamientoSiete') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    this.cargarAnalitySiete();
  }

  cargarAnalitySiete(): void{
    // cargarReportePago( termiperson: string = '', terminotreatment: string = ''): void {
  
    this.analityservice.pythonAnalitySeis(this.selectedTreatment, this.fehcaInicio, this.fechaFinal)
      .subscribe(data=>{
        //this.tratamientoArray = data;
        console.log('LLEGA ANALITY_SIETE',data);
        this.createChart(data);
      });
  }
  createChart(data: any) {
    // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }

    // Formatea los datos
    const fechas = data.fechas;
    const frecuencias = data.ingresos;

    // Crea la gráfica de línea
    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: data.name_tratament,
            data: frecuencias,
            borderColor: 'blue',
            backgroundColor: 'red',  // Fondo rojo con opacidad
            fill: false,
            tension: 0.4 
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Ingreso' } }
        }
      }
    });
  }
  // loadChartData(): void {

  //   this.analityservice.pythonAnalitySeis(this.selectedTreatment, this.fehcaInicio, this.fechaFinal)
  //     .subscribe((response: any) => {
  //       console.log("LLEGA_ANALITY_SIETE", response);
  //       // Asumimos que response tiene dos arrays: 'fechas' y 'ingresos'
  //       this.lineChartLabels = response.fechas; // Eje X: las fechas
  //       this.lineChartData = [
  //         { data: response.ingresos, label: 'Ingresos por Fecha' } // Eje Y: los ingresos
  //       ];
  //     });
  // }

}
