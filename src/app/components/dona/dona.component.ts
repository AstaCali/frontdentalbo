import { Component, Input } from '@angular/core';

import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';
//import { Color } from 'chart.js'; 

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  //styleUrls: ['./dona.component.css']
})
export class DonaComponent {

  @Input() title: string='Sin titulo';

  @Input('labels') doughnutChartLabels: string[] = ['Doctor1','Doctor2','Doctor3'];
  //public doughnutChartLabels: string[] = ['Download Sales','In-Store Sales','Mail-Order Sales'];

  //@Input() data: any;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [350, 450, 100],backgroundColor: ['#6857E6', '#009FEE', '#F02059']},
      
      // { data: [50, 150, 120] },
      // { data: [250, 130, 70] },
    ],
  };
}
