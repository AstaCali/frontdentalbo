import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboar.service';

import { ChartData, ChartDataset, ChartEvent, ChartOptions, ChartType, Color, LabelItem } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  //--ALMACENAR AÑO, MES Y DIA--
  //public year?: string;
  public mesyear?: string;
  //public mes?: string;
  public dia?: string;
  //---HASTA AQUI---

  public pagosAnalisis: any[] = [];
  errorMessage: string = '';
  //---PARA ANALISIS DE DATOS--
  public tratamientos: any[] = [];
  public errodos: string = '';

  // Configuración del gráfico de barras
  // public barChartOptions = {
  //   scaleShowVerticalLines: false,
  //   responsive: true
  // };
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Esto evita que el gráfico mantenga el aspecto
    scales: {
      x: { 
        grid: { display: false } // Opciones de la escala X
      },
      y: { 
        grid: { display: true }, // Opciones de la escala Y
        //ticks: { beginAtZero: true } // Configuración de los ticks (etiquetas) de la escala Y
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: { callbacks: {} }
    },
  };

  public barChartLabels: LabelItem[] = [];
  //public barChartType = 'bar';
  public barChartType: ChartType = 'bar'; // Asegúrate de importar ChartType desde 'ng2-charts'
  public barChartLegend = true;

  // public barChartData : any[] = [
  //   { data: [], label: 'Tratamientos' }
  // ];
  public barChartData: ChartDataset[] = [
    { 
      data: [], 
      label: 'Tratamientos',
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }
  ];

  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {

    //this.loadPagos();
    this.yearActual();
    //this.obtenerTratamientosMasDemandados();
    
  }

  loadPagos(year?: string, month?: string, day?: string): void {
    this.dashboardService.cargarAnalisis(year, month, day).subscribe({
      next: (response) => {
        if (response.ok) {
          this.pagosAnalisis = response.pagoanalisis;
          //console.log('LOAD_PAGO', this.pagosAnalisis);
          //---cargar para analisis llamo aqui
          //this.obtenerTratamientosMasDemandados();
          this.obtenerTratamientosMasDemandados(year, month, day);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        //console.error('Error fetching pagos', error);
        this.errorMessage = 'Hubo un error al obtener los pagos';
      }
    });
  }

  // onFilter(year: string, month: string, day: string): void {
  // onFilter(year: string, month: string): void {

  //   console.log('año-mes-dia', year,month);
  //   //this.loadPagos(year, month, day);
  // }

  //----PARA LOS CHART---
  // obtenerTratamientosMasDemandados(): void {
  //   this.dashboardService.pythonAnalisis()
  //     .subscribe(
  //       (data) => {
  //         console.log('LLEGA_PYTHON: ', data);
  //         this.tratamientos = data;
  //         this.prepararDatosParaGrafico();
  //       },
  //       (error) => {
  //         this.error = 'Error al obtener los tratamientos más demandados.';
  //         console.error('ERROR',error);
  //       }
  //     );
  // }

  obtenerTratamientosMasDemandados(year?: string, month?: string, day?: string): void {
    this.dashboardService.pythonAnalisis(year, month, day).subscribe(
      (data) => {
        //console.log('LLEGA_PYTHON: ', data);
        this.tratamientos = data;
        this.prepararDatosParaGrafico();
      },
      (error) => {
        this.errodos = error.error;
        //Swal.fire(error.error)
      }
    );
  }

  prepararDatosParaGrafico(): void {
    const labels: LabelItem[] = [];
    const data: any[] = [];
    this.tratamientos.forEach(tratamiento => {
      labels.push(tratamiento.name_treatment);
      data.push(tratamiento.count);
    });
    this.barChartLabels = labels;
    this.barChartData = [
      { data: data, label: 'Tratamientos' }
    ];
  }

  //----MANEJAR EL FILTRO DE AÑO, MES Y DIA--

  // yearActual() {
  //   const today = new Date();
  //   const yearact = today.getFullYear(); // Obtiene el año actual (ej. 2024)
  //   const month = ('0' + (today.getMonth() + 1)).slice(-2); //--MES
  //   this.mesyear = `${yearact}-${month}`; // PARA MOS◘4RAR EN LA VISTA
  //   const mesactyear = this.mesyear;
  //   console.log(mesactyear);
  //   this.loadPagos(yearact, month,'');
  // }
  yearActual() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.dia = `${year}-${month}-${day}`;
    const todayDate = this.dia;
    this.loadPagos('','',todayDate);
    //this.cargarCitasMsj('', todayDate);
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.mesyear = input.value;
    //console.log('AÑO-Mes',this.mesyear);
    // Separar el año y el mes
    const [yearStr, month] = this.mesyear.split('-');

    // Convertir a número
    //const year = parseInt(yearStr, 10);
    //const month = parseInt(monthStr, 10);
    this.errodos = '';
    this.dia= '';

    this.loadPagos(yearStr, month,'');
  }
  cambiarFeha(event: Event){
    const input = event.target as HTMLInputElement;
    //console.log(input);
    if (input && input.value) {
    // Obtener el valor del campo de entrada (formato "yyyy-MM")
    const [year, month] = input.value.split('-');

    // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

    // Formatear la fecha en "yyyy-MM-dd"
    const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

      //console.log('Fecha seleccionada:', formattedDate);
      this.errodos = '';
      this.mesyear= '';
      this.loadPagos('','',formattedDate);
    }

  }

}
