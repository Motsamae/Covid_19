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
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#17a2b8' },
    { backgroundColor: '#6610f2' },
  ]

  constructor(private qedCovidService: QedCovidService) {
    console.log('On Load...');
  }

  ngOnInit() {
    this.getDailyReportByTestsAndHospitalasationAndDate();
  }

  getDailyReportByTestsAndHospitalasationAndDate() {
    const overAllDateList: string[] = []
    for (var i = 0; i < 7; i++) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - i);
      const todaysDateIso = todaysDate.toISOString().substring(0, 10);
      overAllDateList.push(todaysDateIso);
    }

    forkJoin(this.qedCovidService.getDailyReportForCountry(overAllDateList[0]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[1]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[2]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[3]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[4]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[5]),
      this.qedCovidService.getDailyReportForCountry(overAllDateList[6]),
      this.qedCovidService.getDailyReportForProvinces()).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven]:
        [any, any, any, any, any, any, any]) => {
        console.log(dayOne);
        console.log(dayTwo);
        console.log(dayThree);
        console.log(dayFour);
        console.log(dayFive);
        console.log(daySix);
        console.log(daySeven);
        //for (var i = 0; i < overAllDateList.length; i++) {
        //  if (this.qedCovidService.dailyReportByCountryName['south-africa'][i]) {
        //  }
        //}
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
