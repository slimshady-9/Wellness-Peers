import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-single-patient-details',
  templateUrl: './single-patient-details.component.html',
  styleUrls: ['./single-patient-details.component.scss']
})
export class SinglePatientDetailsComponent {

  @ViewChild('gaugeChart', { static: true })
  gaugeChart!: ElementRef;
  patientData!:any;
  hadmId!:number;

  constructor(private patientService:PatientService, private route:ActivatedRoute){}

  ngOnInit(){
    this.hadmId = Number(this.route.snapshot.paramMap.get('hadmId'));
    console.log(this.hadmId);

    this.patientService.getParticularPatientData(this.hadmId).subscribe((res)=>{
      this.patientData=res[0];

    // Gauge Chart  Start -------------------------------------


    const chart = echarts.init(this.gaugeChart.nativeElement);

    const options:echarts.EChartsOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '100%',
          min: 0,
          max: 4,
          splitNumber: 3,
          axisLine: {
            lineStyle: {
              width: 7,
              color: [
                [0.25, 'lightgreen'],
                [0.5, 'yellow'],
                [0.75, 'orange'],
                [1, 'red']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '22%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'inherit'
            }
          },
          axisTick: {
            length: 5,
            lineStyle: {
              color: 'inherit',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'inherit',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            rotate: 'tangential',
            formatter: function (value) {
              if (value <= 1) {
                return 'Low';
              } else if (value <= 2) {
                return 'Medium';
              } else if (value <= 3) {
                return 'High';
              } else if (value <= 4) {
                return 'Urgent';
              }
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 25,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 25) + '%';
            },
            color: 'inherit'
          },
          data: [
            {
              value: res[0].Riskscore,
              name: 'Risk Score'
            }
          ]
        }
      ]
    };
    chart.setOption(options)
    // Gauge Chart End ----------------------------------
  })


  }

}
