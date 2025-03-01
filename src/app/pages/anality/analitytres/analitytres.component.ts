import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalityService } from 'src/app/services/anality.service';

@Component({
  selector: 'app-analitytres',
  templateUrl: './analitytres.component.html',
  styleUrls: ['./analitytres.component.css']
})
export class AnalitytresComponent implements OnInit {

  public chart: any;
  public errodos: string = '';
  public mesyear: string = '';
  public dato_listado: any =[];

  constructor(private analityservice : AnalityService){}

  ngOnInit(): void {
    
  }
  anomes(event: Event) {
    const input = event.target as HTMLInputElement;
    this.mesyear = input.value;
    console.log('AÑO-MES', this.mesyear);
    this.cargarCitaPorMes();
  }
  cargarCitaPorMes() {

    this.analityservice.pythonAnalityTres(this.mesyear).subscribe(data => {
      console.log('CITAS_MES', data);
        if (data.ok) {
          this.dato_listado = data.dato_list;
          console.log('DATO_LIST_TRES', this.dato_listado);
          this.createChart(data.meses, data.frecuencias);
        } else {
          console.error('Error al obtener datos:', data.error);
        }
    })
    // const fecha_inicio = '2024-06'; // Cambia esto según tus necesidades
    // const url = `http://localhost:5000/api/analitydos?fecha_inicio=${fecha_inicio}`;

    // this.http.get<any>(url).subscribe(data => {
    //   if (data.ok) {
    //     this.createChart(data.meses, data.frecuencias);
    //   } else {
    //     console.error('Error al obtener datos:', data.error);
    //   }
    // });
  }

  createChart(meses: string[], frecuencias: number[]) {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Frecuencia de Citas',
          data: frecuencias,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
