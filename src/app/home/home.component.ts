import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { QedCovidService } from '../services/qed-covid.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public barChartLabels: Label[] = [];// ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Hospitilisation' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#17a2b8' },
    { backgroundColor: '#6610f2' },
  ]

  constructor(private qedCovidService: QedCovidService, public datepipe: DatePipe) {
    console.log('On Load...');
  }

  ngOnInit() {
    this.getDailyReportByTestsAndHospitalasationAndDate();
  }

  getDailyReportByTestsAndHospitalasationAndDate() {
    const overAllDateList: string[] = []

    // for (i = timer; i < 1; i–) { console.log(i); }
    for (var i = 8; i > -1; i--) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - i);
      // const x = this.datepipe.transform(todaysDate, 'dd-MM-yyyy') || '';
      const todaysDateIso = this.datepipe.transform(todaysDate, 'dd-MM-yyyy') || '';;// todaysDate.toISOString().substring(0, 10);
      overAllDateList.push(todaysDateIso);
    }

    forkJoin(this.qedCovidService.getDailyReportForCountry(overAllDateList[0]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[1]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[2]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[3]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[4]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[5]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[6])).subscribe((
        [dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven]:
          [any, any, any, any, any, any, any]) => {
        console.log(dayOne);
        const hospitilasationCovidDataHolder = [];
        const tests = [];
        for (var i = 0; i < dayOne.length; i++) {
          if (dayOne[i]) {
            const getCaseDay = dayOne.find((x: any) => x.date === overAllDateList[i]);
            hospitilasationCovidDataHolder.push(Number(getCaseDay.hospitalisation));
            tests.push(Number(getCaseDay.cumulative_tests));
            this.barChartLabels.push(overAllDateList[i]);

          } else {
            this.barChartLabels.push(overAllDateList[i]);
            hospitilasationCovidDataHolder.push(0);
            tests.push(0);
          }
        }
        let diffVal: number;
        let totalHolder = [];
        for (let i = 0; i < hospitilasationCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (hospitilasationCovidDataHolder[i + 1]) - hospitilasationCovidDataHolder[i];
          } else {
            diffVal = (hospitilasationCovidDataHolder[1]) - hospitilasationCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        // let gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        this.barChartData[0].data = totalHolder;
        totalHolder = [];
        console.log(this.barChartData[0]);
      }, function (err: any) {
        console.log(err);
      });

  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
