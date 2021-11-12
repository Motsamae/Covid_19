import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartDataSets, ChartType } from 'chart.js';
import { QedCovidService } from '../services/qed-covid.service';
import { DatePipe } from '@angular/common';
import { BaseChartDirective, Color } from 'ng2-charts';

@Component({
  selector: 'south-africa',
  templateUrl: './south-africa.component.html',
  styleUrls: ['./south-africa.component.css']
})
export class SouthAfricaComponent implements OnInit {

  type = 'line';
  data = {
    labels: new Array<string>(),// ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Positive Covid Results Last 7 Days",
        data: new Array<number>()// [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private qedCovidService: QedCovidService, public datepipe: DatePipe) {

  }

  ngOnInit() {
    this.getDailyReportByCountryNameAndDate();
  }

  public doughnutChartLabels: string[] = [];// ['Age 18 to 24', 'Age 25 to 35', 'Above 35+'];
  public demodoughnutChartData: number[] = [];// [[350, 450, 100], [250, 350, 150], [0, 100, 150]];
  public demodoughnutChartData2: ChartDataSets[] = [{ data: [], label:'Positive Covid Results Last 7 Days'}]
  public doughnutChartType: ChartType = 'line';
  public doughnutChartColors: Color[] = [{
     // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getDailyReportByCountryNameAndDate() {
    const overAllDateList: string[] = []
    for (var i = 0; i < 7; i++) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - i);
      const todaysDateIso = todaysDate.toISOString().substring(0, 10);
      overAllDateList.push(todaysDateIso);
    }
    console.log(overAllDateList);
    forkJoin(this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[0]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[1]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[2]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[3]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[4]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[5]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[6])).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix]:
        [any, any, any, any, any, any, any]) => {
        // console.log(dayOne);
        // console.log(dayTwo);
        // console.log(dayThree);
        // console.log(dayFour);
        // console.log(dayFive);
        // console.log(daySix);
        // console.log(this.qedCovidService.dailyReportByCountryName);

        // separate the days data to get labels
        // this.data
        for (var i = 0; i < overAllDateList.length; i++) {
          const getCaseDay = this.qedCovidService.dailyReportByCountryName['south-africa'].find((x: any) => x.day === overAllDateList[i]);
          const convertCaseToNumberArray = getCaseDay.cases.new.split('+');
          const caseToNumber = Number(convertCaseToNumberArray[1]);
          this.data.datasets[0].data.push(caseToNumber);
          const todaysDateLable = new Date(overAllDateList[i]);
          const todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
          this.data.labels.push(todaysDateLableConverted);
          // if (!this.demodoughnutChartData[0]) {
          //  this.demodoughnutChartData[0] = [];
          // }
          this.demodoughnutChartData.push(caseToNumber!);
          this.doughnutChartLabels.push(todaysDateLableConverted!);
          this.demodoughnutChartData2[0].data?.push(caseToNumber);
        }
        // this.chart.update();
        console.log(this.data);
        console.log('ng2-charts');
        console.log(this.demodoughnutChartData);
        console.log(this.doughnutChartLabels);
      }, function (err: any) {
        console.log(err);
      });

  }
}
