import { Component } from '@angular/core';

//import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';
//import { Color } from 'chart.js'; 

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: []
})
export class Grafica1Component {

  public labels1: string[] = ['EXTRACCION','LIMPIEZA','CERRILLA',];
  //console.log(this.labels1);

  public data1 = {
    labels: this.labels1,
    datasets: [
      { data: [10, 20, 40],backgroundColor: ['#6857E6', '#009FEE', '#F02059']},
    ],
  };

  // public data1 =[
  //    [10, 15, 40]
  //   ];

  // public data1 = {
  //   //labels: this.doughnutChartLabels,
  //   labels: this.labels1,
  //   datasets: [
  //     { data: [10, 15, 40]},
  //   ],
  // };

  //public doughnutChartType: ChartType = 'doughnut';
  //public colors: Color[] = [{ backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }];
  // public colors: Color[] = [
  //   { backgroundColor: ['#6857E6','#009FEE','#F02059']}
  // ];

}
