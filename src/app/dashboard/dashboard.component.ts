import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { PatientService } from '../services/patient.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('myPieChart', { static: true })
  myPieChart!: ElementRef;

  public chart: any;
  pieChartData!: any;
  topTenPatientData!: any;
  product = [];

  constructor(private router: Router, private patientService: PatientService) {}
  ngOnInit() {
    this.patientService.getTopTenPatientData().subscribe((res) => {
      this.topTenPatientData = res;
      // console.log(res);
    });
    this.createChart();
    this.patientService.getBarChartData().subscribe((res)=>{
      this.createBarChart(res[0]);
    })

    const chart = echarts.init(this.myPieChart.nativeElement);
    this.patientService.getPieChartData().subscribe((res) => {
      // this.createChart();

      const chart = echarts.init(this.myPieChart.nativeElement);

      // Set chart options
      const options: echarts.EChartsOption = {
        title: {
          text: 'Patients Health Risk',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Patient Reports',
            type: 'pie',
            radius: '70%',
            data: [
              {
                value: res[0].Low,
                name: 'Low',
                itemStyle: { color: 'lightgreen' },
              },
              {
                value: res[0].Medium,
                name: 'Medium',
                itemStyle: { color: 'yellow' },
              },
              {
                value: res[0].High,
                name: 'High',
                itemStyle: { color: 'orange' },
              },
              {
                value: res[0].Urgent,
                name: 'Severe',
                itemStyle: { color: 'red' },
              },
            ],
            label: {
              formatter: '{d}%',
              // position: 'inner'
            },
          },
        ],
      };

      // Set chart options and render
      chart.setOption(options);

      // this.prods.getWishProd();

      // setTimeout(()=>{
      //   this.product = this.prods.wishProd;
      // },1000)

      // Set chart options and render
    });
  }

  createChart() {
    this.patientService.getLineChartData().subscribe((res: any) => {
      // console.log(res);
      
      this.chart = new Chart('MyChart', {
        
        type: 'line',
      
        data: {
          labels: ['Urgent', 'High', 'Medium', 'Low'],
          datasets: [
            {
              label: 'Average Health Status',
              data: res,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
              labels: [
                '0-9',
                '10-19',
                '20-29',
                '30-39',
                '40-49',
                '50-59',
                '60-69',
                '70-79',
                '80-89',
                '90-',
              ],
              position: 'bottom',
            },
            y: {
              type: 'category',
              // labels: ['Severe', 'High', 'Medium', 'Low']
            },
          },
        },
      });
    });
  }

  createBarChart(data:any) {
    
    this.chart = new Chart('MyBarChart', {
      
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis

        labels: [
          '0-9',
          '10-19',
          '20-29',
          '30-39',
          '40-49',
          '50-59',
          '60-69',
          '70-79',
          '80-89',
          '90-',
        ],

        datasets: [
          {
            label: 'CC_Score',

            data: data.ccScore,

            backgroundColor: 'Blue',
          },

          {
            label: 'ED_Score',

            data: data.edScore,

            backgroundColor: 'lightgreen',
          },


          {
            label: 'RISK_Score',

            data: data.riskScore,

            backgroundColor: 'red',
          }
        ],
      },

      options: {
        aspectRatio: 2,
      },
    });
  }

  patientList() {
    this.router.navigateByUrl('/patients');
  }
}
